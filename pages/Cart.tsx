import React, { useState } from 'react';
import { CartItem, Order, COMPANY_INFO } from '../types';
import { Trash2, Plus, Minus, CheckCircle, CreditCard, Banknote, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { saveOrder } from '../services/storage';
import { sendOrderToTelegram } from '../services/telegram';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import { handleImageError } from '../utils/image';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, liter: string, delta: number) => void;
  clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, clearCart }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+998 ',
    paymentMethod: 'cash' as 'cash' | 'card'
  });
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const totalAmount = cart.reduce((sum, item) => sum + (item.selectedPrice * item.quantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      customerName: formData.fullName,
      phone: formData.phone,
      paymentMethod: formData.paymentMethod,
      items: cart,
      totalAmount,
      status: 'Pending',
      date: new Date().toISOString()
    };

    // 1. Save to Local Storage (Admin Panel)
    saveOrder(newOrder);

    // 2. Generate PDF Receipt
    generatePDF(newOrder);

    // 3. Send to Telegram Bot
    await sendOrderToTelegram(newOrder);

    // 4. Finish
    setOrderComplete(newOrder.id);
    clearCart();
    setIsSubmitting(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Keep only numbers
    let digits = val.replace(/\D/g, '');

    // Handle case where user types regular number (e.g., 901234567) without prefix
    if (!digits.startsWith('998')) {
      digits = '998' + digits;
    }

    // Limit to 12 digits (998 + 9 digits)
    if (digits.length > 12) digits = digits.slice(0, 12);

    // Build the string
    let res = "+998";
    if (digits.length > 3) res += " " + digits.slice(3, 5);
    if (digits.length > 5) res += " " + digits.slice(5, 8);
    if (digits.length > 8) res += " " + digits.slice(8, 10);
    if (digits.length > 10) res += " " + digits.slice(10, 12);

    setFormData(prev => ({ ...prev, phone: res }));
  };

  const generatePDF = (order: Order) => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text("FORTEX.UZ", 20, 20);
      doc.setFontSize(12);
      doc.text(`Buyurtma: #${order.id}`, 20, 30);
      doc.text(`Sana: ${new Date(order.date).toLocaleDateString()}`, 20, 36);

      doc.text("-----------------------------------------", 20, 42);
      doc.text(`Mijoz: ${order.customerName}`, 20, 48);
      doc.text(`Tel: ${order.phone}`, 20, 54);
      doc.text(`To'lov turi: ${order.paymentMethod === 'card' ? 'Karta orqali' : 'Naqd pul'}`, 20, 60);

      let y = 70;
      order.items.forEach((item, index) => {
        // PDF page break check could be added here for very long orders
        doc.text(`${index + 1}. ${item.product.name} (${item.selectedLiter}) x ${item.quantity}`, 20, y);
        doc.text(`${(item.selectedPrice * item.quantity).toLocaleString()} UZS`, 150, y);
        y += 8;
      });

      doc.text("-----------------------------------------", 20, y + 5);
      doc.setFontSize(16);
      doc.text(`JAMI: ${order.totalAmount.toLocaleString()} UZS`, 20, y + 15);

      doc.setFontSize(10);
      doc.text("To'lovingiz uchun rahmat! Soliqsiz.", 20, y + 30);

      doc.save(`fortex-order-${order.id}.pdf`);
    } catch (e) {
      console.error("PDF generation failed", e);
    }
  };

  const payOption = (active: boolean) =>
    `cursor-pointer rounded-2xl p-3.5 border flex flex-col items-center justify-center text-center transition-all duration-300 ${active
      ? 'border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-300 shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_0_24px_rgba(59,130,246,0.25)]'
      : 'border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-white/5'}`;

  if (orderComplete) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 pt-28">
        <div className="glass glow-border p-8 sm:p-12 rounded-[36px] animate-scale-in max-w-lg w-full">
          <span className="glow-halo"></span>
          <div className="relative w-24 h-24 mx-auto mb-8">
            <span className="absolute inset-0 rounded-full bg-emerald-400/40 animate-ping"></span>
            <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white shadow-[0_0_50px_rgba(52,211,153,0.6),inset_0_2px_0_rgba(255,255,255,0.4)]">
              <CheckCircle size={46} />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-3">{t('cart_success_title')}</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium">{t('order_id')} <span className="font-mono bg-slate-900/5 dark:bg-white/10 px-2 py-1 rounded-lg text-slate-700 dark:text-slate-200">{orderComplete}</span></p>
          <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            {t('cart_success_desc')}
          </p>
          <Link to="/" className="btn-glow w-full block py-4 rounded-2xl font-bold">
            {t('cart_home_btn')}
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-28">
        <div className="text-center animate-fade-in-up">
          <div className="glass relative w-36 h-36 rounded-full mb-8 mx-auto flex items-center justify-center animate-float">
            <span className="absolute inset-4 rounded-full bg-blue-500/20 blur-2xl"></span>
            <ShoppingBag size={60} className="relative text-blue-500/70" strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-4">{t('cart_empty')}</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 text-lg max-w-md mx-auto">{t('cart_empty_desc')}</p>
          <Link to="/products" className="btn-glow group inline-flex items-center px-8 py-4 rounded-full font-bold">
            <ArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" size={20} /> {t('cart_back')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4">

        <div className="flex items-center justify-between mb-10 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{t('cart_title')}</h1>
          <span className="eyebrow">{cart.reduce((a, c) => a + c.quantity, 0)} {t('items_suffix')}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedLiter}`} className="glass spotlight group rounded-[26px] p-4 md:p-5 flex flex-col md:flex-row items-center transition-all duration-500 hover:-translate-y-0.5 animate-fade-in-up opacity-0" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="relative w-24 h-24 bg-gradient-to-b from-white to-slate-100 dark:from-slate-200 dark:to-slate-300 rounded-2xl p-2 flex-shrink-0 mb-4 md:mb-0 overflow-hidden flex items-center justify-center">
                  <span className="product-halo"></span>
                  <img src={item.product.image_url} alt={item.product.name} onError={handleImageError} className="relative w-full h-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-110" />
                </div>

                <div className="flex-grow text-center md:text-left md:ml-6 min-w-0">
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.12em]">{item.product.category}</span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg tracking-tight mt-1">{item.product.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{t('size')}: <span className="text-slate-700 dark:text-slate-200 bg-slate-900/5 dark:bg-white/10 px-2 py-0.5 rounded-md">{item.selectedLiter}</span></p>
                  <p className="text-blue-600 dark:text-blue-400 font-black text-lg mt-2 md:hidden">{item.selectedPrice.toLocaleString()} UZS</p>
                </div>

                <div className="flex flex-col items-end gap-3 mt-4 md:mt-0 w-full md:w-auto">
                  <p className="text-slate-900 dark:text-white font-black text-xl tracking-tight hidden md:block">{item.selectedPrice.toLocaleString()} <span className="text-xs text-slate-400 font-normal">UZS</span></p>
                  <div className="flex items-center justify-between w-full md:w-auto rounded-full p-1 bg-slate-900/5 dark:bg-white/5 border border-slate-900/5 dark:border-white/10">
                    <button onClick={() => updateQuantity(item.product.id, item.selectedLiter, -1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-white/10 shadow-sm hover:scale-105 active:scale-95 transition text-slate-600 dark:text-slate-200" aria-label="-"><Minus size={14} /></button>
                    <span key={item.quantity} className="font-bold w-10 text-center text-slate-900 dark:text-white animate-scale-in">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.selectedLiter, 1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_0_14px_rgba(59,130,246,0.5)] hover:scale-105 active:scale-95 transition" aria-label="+"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => updateQuantity(item.product.id, item.selectedLiter, -1000)} className="text-rose-400 hover:text-rose-600 text-xs font-bold flex items-center transition"><Trash2 size={14} className="mr-1" /> {t('remove')}</button>
                </div>
              </div>
            ))}

            <div className="flex justify-end pt-2">
              <button onClick={clearCart} className="text-rose-500 font-bold hover:bg-rose-500/10 px-4 py-2 rounded-full transition flex items-center">
                <Trash2 size={18} className="mr-2" /> {t('cart_clear')}
              </button>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="animate-fade-in-up opacity-0" style={{ animationDelay: '0.15s' }}>
            <div className="glass glow-border rounded-[32px] p-6 sm:p-8 sticky top-28">
              <span className="glow-halo"></span>
              <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-6 flex items-center">
                <span className="w-1.5 h-6 bg-gradient-to-b from-blue-400 to-indigo-600 rounded-full mr-3 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span>
                {t('cart_checkout')}
              </h2>

              <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-900/5 dark:border-white/10">
                <span className="text-slate-500 dark:text-slate-400 font-medium">{t('cart_total')}</span>
                <span key={totalAmount} className="text-3xl font-black tracking-tight text-shimmer animate-scale-in">{totalAmount.toLocaleString()} <span className="text-sm text-slate-400 font-medium">UZS</span></span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.14em] mb-2">{t('cart_form_name')}</label>
                  <input
                    required
                    type="text"
                    className="field px-4 py-3.5 font-medium"
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={t('placeholder_fullname')}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.14em] mb-2">{t('cart_form_phone')}</label>
                  <input
                    required
                    type="tel"
                    className="field px-4 py-3.5 font-medium"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="+998 90 123 45 67"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.14em] mb-3">{t('cart_form_payment')}</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={payOption(formData.paymentMethod === 'cash')}>
                      <input
                        type="radio"
                        name="payment"
                        value="cash"
                        className="hidden"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'cash' })}
                        disabled={isSubmitting}
                      />
                      <Banknote size={24} className="mb-2" />
                      <span className="text-sm font-bold">{t('cart_cash')}</span>
                    </label>
                    <label className={payOption(formData.paymentMethod === 'card')}>
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        className="hidden"
                        checked={formData.paymentMethod === 'card'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        disabled={isSubmitting}
                      />
                      <CreditCard size={24} className="mb-2" />
                      <span className="text-sm font-bold">{t('cart_card')}</span>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="relative overflow-hidden rounded-3xl p-5 text-white animate-scale-in bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 border border-white/10 shadow-[0_20px_40px_-12px_rgba(30,58,138,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]">
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/40 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-12 -left-8 w-32 h-32 bg-violet-500/30 rounded-full blur-3xl"></div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmerCard_3s_ease-in-out_infinite]"></div>
                    <div className="relative">
                      <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-500 mb-4 shadow-inner"></div>
                      <p className="font-medium text-white/50 text-[11px] uppercase tracking-[0.14em] mb-1">{t('cart_card_number')}</p>
                      <p className="font-mono text-xl tracking-widest font-bold">{COMPANY_INFO.card}</p>
                      <p className="text-xs mt-3 text-white/50">{t('cart_card_desc')}</p>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-glow w-full font-bold py-4 rounded-2xl mt-2 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" /> {t('cart_submitting')}
                    </>
                  ) : (
                    t('cart_submit')
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;