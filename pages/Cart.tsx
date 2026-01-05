import React, { useState } from 'react';
import { CartItem, Order, COMPANY_INFO } from '../types';
import { Trash2, Plus, Minus, CheckCircle, CreditCard, Banknote, ShoppingBag, ArrowLeft, Loader2 } from 'lucide-react';
import { saveOrder } from '../services/storage';
import { sendOrderToTelegram } from '../services/telegram';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: string, liter: string, delta: number) => void;
  clearCart: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, clearCart }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    paymentMethod: 'cash' as 'cash' | 'card'
  });
  const [orderComplete, setOrderComplete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white p-12 rounded-3xl shadow-2xl animate-scale-in max-w-lg w-full">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 shadow-lg shadow-green-500/20">
                <CheckCircle size={48} />
            </div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Buyurtma Qabul Qilindi!</h1>
            <p className="text-gray-500 mb-6 font-medium">Buyurtma ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-slate-700">{orderComplete}</span></p>
            <p className="text-gray-600 mb-8 leading-relaxed">
            Sizning buyurtmangiz muvaffaqiyatli rasmiylashtirildi. Tez orada administratorlarimiz siz bilan bog'lanishadi. Chek avtomatik yuklab olindi.
            </p>
            <Link to="/" className="w-full block bg-fortex-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30">
            Bosh Sahifaga Qaytish
            </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center animate-fade-in-up">
            <div className="bg-white p-8 rounded-full shadow-xl mb-8 inline-block">
                <ShoppingBag size={64} className="text-gray-300" />
            </div>
            <h2 className="text-4xl font-black text-slate-800 mb-4">Savatcha Bo'sh</h2>
            <p className="text-gray-500 mb-8 text-lg max-w-md mx-auto">Avtomobilingiz uchun eng yaxshi moylarni tanlash uchun katalogga o'ting.</p>
            <Link to="/products" className="inline-flex items-center bg-fortex-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30">
                <ArrowLeft className="mr-2" /> Mahsulotlarni Ko'rish
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-4">
        
        <div className="flex items-center justify-between mb-8 animate-fade-in">
             <h1 className="text-3xl md:text-4xl font-black text-slate-800">Sizning Savatchangiz</h1>
             <span className="bg-blue-100 text-fortex-primary px-4 py-2 rounded-full font-bold text-sm shadow-sm">{cart.reduce((a,c)=>a+c.quantity, 0)} ta mahsulot</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            {cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedLiter}`} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row items-center hover:shadow-md transition duration-300">
                <div className="w-24 h-24 bg-gray-50 rounded-xl p-2 flex-shrink-0 border border-gray-50 mb-4 md:mb-0">
                    <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                
                <div className="flex-grow text-center md:text-left md:ml-6">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase">{item.product.category}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-lg">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">Hajm: <span className="text-slate-700 bg-gray-100 px-2 rounded">{item.selectedLiter}</span></p>
                  <p className="text-fortex-primary font-black text-lg mt-2 md:hidden">{item.selectedPrice.toLocaleString()} UZS</p>
                </div>

                <div className="flex flex-col items-end gap-4 mt-4 md:mt-0 w-full md:w-auto">
                    <p className="text-fortex-primary font-black text-xl hidden md:block">{item.selectedPrice.toLocaleString()} <span className="text-xs text-gray-400 font-normal">UZS</span></p>
                    <div className="flex items-center justify-between w-full md:w-auto bg-gray-50 rounded-xl p-1 border border-gray-200">
                        <button onClick={() => updateQuantity(item.product.id, item.selectedLiter, -1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100 transition text-gray-600 font-bold disabled:opacity-50"><Minus size={14} /></button>
                        <span className="font-bold w-10 text-center text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.selectedLiter, 1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-100 transition text-gray-600 font-bold"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => updateQuantity(item.product.id, item.selectedLiter, -1000)} className="text-red-400 hover:text-red-600 text-xs font-bold flex items-center transition"><Trash2 size={14} className="mr-1" /> O'chirish</button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-end pt-4">
                <button onClick={clearCart} className="text-red-500 font-bold hover:bg-red-50 px-4 py-2 rounded-xl transition flex items-center">
                    <Trash2 size={18} className="mr-2" /> Savatchani Tozalash
                </button>
            </div>
          </div>

          {/* Checkout Section */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sticky top-28">
              <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center">
                  <span className="w-1 h-6 bg-fortex-primary rounded-full mr-3"></span>
                  Buyurtmani Rasmiylashtirish
              </h2>
              
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-100">
                  <span className="text-gray-500 font-medium">Jami summa:</span>
                  <span className="text-3xl font-black text-fortex-primary">{totalAmount.toLocaleString()} <span className="text-sm text-gray-400 font-medium">UZS</span></span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To'liq Ism</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition font-medium text-slate-800"
                    value={formData.fullName}
                    onChange={e => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Ism Familiya"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Telefon Raqam</label>
                  <input 
                    required 
                    type="tel" 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition font-medium text-slate-800"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+998"
                    disabled={isSubmitting}
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">To'lov Turi</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col items-center justify-center text-center ${formData.paymentMethod === 'cash' ? 'border-fortex-primary bg-blue-50 text-fortex-primary shadow-md' : 'border-gray-100 hover:bg-gray-50 text-gray-500'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="cash"
                        className="hidden"
                        checked={formData.paymentMethod === 'cash'} 
                        onChange={() => setFormData({...formData, paymentMethod: 'cash'})}
                        disabled={isSubmitting}
                      />
                      <Banknote size={24} className="mb-2" />
                      <span className="text-sm font-bold">Naqd Pul</span>
                    </label>
                    <label className={`cursor-pointer rounded-xl p-3 border-2 transition-all flex flex-col items-center justify-center text-center ${formData.paymentMethod === 'card' ? 'border-fortex-primary bg-blue-50 text-fortex-primary shadow-md' : 'border-gray-100 hover:bg-gray-50 text-gray-500'}`}>
                      <input 
                        type="radio" 
                        name="payment" 
                        value="card"
                        className="hidden"
                        checked={formData.paymentMethod === 'card'} 
                        onChange={() => setFormData({...formData, paymentMethod: 'card'})}
                        disabled={isSubmitting}
                      />
                      <CreditCard size={24} className="mb-2" />
                      <span className="text-sm font-bold">Karta</span>
                    </label>
                  </div>
                </div>

                {formData.paymentMethod === 'card' && (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-5 rounded-2xl text-white shadow-lg animate-fade-in relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                    <p className="font-medium text-gray-400 text-xs uppercase mb-1">Karta raqam (Humo/Uzcard)</p>
                    <p className="font-mono text-xl tracking-widest font-bold text-shadow-sm">{COMPANY_INFO.card}</p>
                    <p className="text-xs mt-3 text-gray-400">Fortex MCHJ hisob raqami</p>
                  </div>
                )}

                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className={`w-full bg-fortex-primary text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 mt-4 flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2" /> Yuborilmoqda...
                      </>
                  ) : (
                      "Buyurtmani Tasdiqlash"
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