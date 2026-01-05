import React, { useState, useEffect } from 'react';
import { Product, Order, CATEGORIES } from '../types';
import { getProducts, saveProduct, deleteProduct, getOrders, updateOrderStatus } from '../services/storage';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Settings, Package, ShoppingBag, LogOut, Edit, Trash, Plus, Lock, Image as ImageIcon, Home, ExternalLink, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setProducts(getProducts());
      setOrders(getOrders());
    }
  }, [isAuthenticated, activeTab]); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1980') {
      setIsAuthenticated(true);
    } else {
      alert("Noto'g'ri kod");
    }
  };

  // --- Logic ---
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const salesData = Object.values(CATEGORIES).map(cat => {
    const count = orders.reduce((acc, order) => {
       return acc + order.items.filter(i => i.product.category === cat).reduce((s, i) => s + i.quantity, 0);
    }, 0);
    return { name: cat, sales: count };
  });

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct && editingProduct.name) {
      const prodToSave = {
        ...editingProduct,
        id: editingProduct.id || `prod_${Date.now()}`,
        liters: typeof editingProduct.liters === 'string' ? (editingProduct.liters as string).split(',').map(s=>s.trim()) : editingProduct.liters,
      } as Product;
      
      saveProduct(prodToSave);
      setProducts(getProducts());
      setEditingProduct(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    if(window.confirm("O'chirishni tasdiqlaysizmi?")) {
        deleteProduct(id);
        setProducts(getProducts());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
             <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-blue-600/30 rounded-full blur-[100px] animate-pulse"></div>
             <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 z-10 animate-fade-in-up">
          <div className="flex justify-center mb-6">
              <div className="bg-fortex-primary p-4 rounded-full shadow-lg shadow-blue-500/50">
                  <Lock className="text-white" size={32} />
              </div>
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-white tracking-tight">Admin Panel</h2>
          <p className="text-center text-gray-400 mb-8 text-sm">Tizimga kirish uchun maxsus kodni kiriting</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kirish kodi"
              className="w-full bg-black/30 border border-white/10 text-white p-4 rounded-xl mb-6 text-center text-2xl tracking-[1em] focus:border-fortex-primary outline-none transition placeholder-gray-600"
              autoFocus
            />
            <button className="w-full bg-fortex-primary hover:bg-blue-600 text-white py-4 rounded-xl font-bold transition shadow-lg shadow-blue-900/50">
              Tizimga Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-fortex-dark text-white flex flex-col shadow-2xl z-20 transition-all">
        <div className="p-8 border-b border-gray-800">
             <span className="text-2xl font-black italic tracking-tighter text-white">
              FORTEX<span className="text-blue-500">.UZ</span>
            </span>
            <p className="text-xs text-gray-500 mt-2 uppercase tracking-wider">Boshqaruv Paneli</p>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-4">Menu</p>
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'dashboard' ? 'bg-fortex-primary text-white shadow-lg shadow-blue-900/50 translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Settings size={18} className="mr-3" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'products' ? 'bg-fortex-primary text-white shadow-lg shadow-blue-900/50 translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Package size={18} className="mr-3" /> Mahsulotlar
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 font-medium ${activeTab === 'orders' ? 'bg-fortex-primary text-white shadow-lg shadow-blue-900/50 translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <ShoppingBag size={18} className="mr-3" /> Buyurtmalar
          </button>

          <p className="px-4 text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 mt-8">Sayt</p>
          <Link 
            to="/"
            className="w-full flex items-center p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 font-medium group"
          >
            <Home size={18} className="mr-3 group-hover:text-blue-400 transition-colors" /> Bosh Sahifa
          </Link>
          <Link 
            to="/products"
            className="w-full flex items-center p-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all duration-300 font-medium group"
          >
            <ExternalLink size={18} className="mr-3 group-hover:text-blue-400 transition-colors" /> Mahsulotlar
          </Link>
        </nav>
        <button onClick={() => setIsAuthenticated(false)} className="p-6 flex items-center text-gray-400 hover:text-red-400 transition border-t border-gray-800">
            <LogOut size={20} className="mr-3" /> Chiqish
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-8 bg-slate-50 scroll-smooth">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800">Umumiy Statistika</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Jami Buyurtmalar</h3>
                        <p className="text-4xl font-black text-slate-800 mt-2">{totalOrders}</p>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-2xl text-fortex-primary"><ShoppingBag size={24} /></div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-fortex-primary h-1.5 rounded-full shadow-lg shadow-blue-500/50" style={{width: '70%'}}></div></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Jami Tushum</h3>
                        <p className="text-3xl font-black text-slate-800 mt-2 tracking-tight">{totalRevenue.toLocaleString()} <span className="text-sm text-gray-400 font-medium">UZS</span></p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-2xl text-green-600"><div className="font-black text-xl">$</div></div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-green-500 h-1.5 rounded-full shadow-lg shadow-green-500/50" style={{width: '50%'}}></div></div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition duration-300">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Mahsulotlar Soni</h3>
                        <p className="text-4xl font-black text-slate-800 mt-2">{products.length}</p>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-2xl text-purple-600"><Package size={24} /></div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full shadow-lg shadow-purple-500/50" style={{width: '90%'}}></div></div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 h-[500px]">
              <h3 className="font-bold text-xl mb-6 text-slate-800">Sotuvlar Statistikasi</h3>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} dy={10} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}
                  />
                  <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="animate-fade-in max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
               <div>
                   <h2 className="text-3xl font-black text-slate-800">Mahsulotlar</h2>
                   <p className="text-gray-500 mt-1">Jami {products.length} ta mahsulot mavjud</p>
               </div>
               <button 
                 onClick={() => setEditingProduct({ 
                     id: '', name: '', category: 'Motor Oil', liters: ['1L'], price_uzs: [0], 
                     image_url: 'https://picsum.photos/seed/new/400/400', description: '', tags: [], 
                     seo: {title: '', meta_description: ''},
                     telegram_bot: { buy_button: true, status_sequence: [], admin_notification: true, pdf_receipt: true, payment_card: '', user_data_required: [] } 
                 })}
                 className="bg-fortex-primary text-white px-6 py-3 rounded-xl hover:bg-blue-600 shadow-lg shadow-blue-500/30 flex items-center font-bold transition transform hover:-translate-y-0.5"
               >
                 <Plus size={20} className="mr-2" /> Yangi Mahsulot
               </button>
            </div>

            {editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 text-slate-800 border-b pb-4">{editingProduct.id ? 'Mahsulotni Tahrirlash' : 'Yangi Mahsulot'}</h3>
                        <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mahsulot Nomi</label>
                                <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition" placeholder="Masalan: Shell Helix" value={editingProduct.name} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} required />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Kategoriya</label>
                                <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none bg-white transition" value={editingProduct.category} onChange={e => setEditingProduct({...editingProduct, category: e.target.value as any})}>
                                    {Object.values(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Narxlar (so'mda)</label>
                                <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition" placeholder="Masalan: 100000, 200000" 
                                    value={editingProduct.price_uzs?.join(',')} 
                                    onChange={e => setEditingProduct({...editingProduct, price_uzs: e.target.value.split(',').map(Number)})} 
                                />
                                <p className="text-xs text-gray-500 mt-1">Hajmlarga mos ketma-ketlikda yozing</p>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Hajmlar</label>
                                <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition" placeholder="Masalan: 1L, 4L" 
                                    value={editingProduct.liters?.join(',')} 
                                    onChange={e => setEditingProduct({...editingProduct, liters: e.target.value.split(',')})} 
                                />
                            </div>

                            {/* Image Input Section */}
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center">
                                    <ImageIcon size={16} className="mr-2" /> Rasm Havolasi (URL)
                                </label>
                                <div className="flex gap-4">
                                    <input 
                                        className="flex-grow border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition" 
                                        placeholder="https://example.com/image.jpg"
                                        value={editingProduct.image_url} 
                                        onChange={e => setEditingProduct({...editingProduct, image_url: e.target.value})} 
                                    />
                                    {editingProduct.image_url && (
                                        <div className="w-12 h-12 rounded-lg border overflow-hidden flex-shrink-0">
                                            <img src={editingProduct.image_url} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Tavsif</label>
                                <textarea className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none h-32 transition" placeholder="Mahsulot haqida to'liq ma'lumot..." value={editingProduct.description} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} />
                            </div>
                            
                            <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                 <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition">Bekor qilish</button>
                                 <button type="submit" className="px-6 py-3 bg-fortex-primary text-white rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30">Saqlash</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                   {products.map((p, idx) => (
                       <div key={p.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${idx * 0.05}s`}}>
                           <div className="flex items-center space-x-6">
                               <div className="w-20 h-20 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 p-2 flex-shrink-0">
                                   <img src={p.image_url} alt="" className="w-full h-full object-contain mix-blend-multiply" />
                               </div>
                               <div>
                                   <div className="flex items-center gap-2 mb-1">
                                     <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wide">{p.category}</span>
                                     {p.tags.includes("New") && <span className="text-[10px] font-bold text-white bg-green-500 px-2 py-0.5 rounded-full">NEW</span>}
                                   </div>
                                   <h3 className="font-bold text-slate-800 text-lg">{p.name}</h3>
                                   <div className="text-gray-400 text-sm mt-1">{p.liters.join(', ')}</div>
                               </div>
                           </div>
                           
                           <div className="flex items-center gap-8">
                               <div className="text-right hidden md:block">
                                   <p className="text-xs text-gray-400 font-bold uppercase">Boshlang'ich Narx</p>
                                   <p className="text-xl font-black text-fortex-primary">{p.price_uzs[0]?.toLocaleString()} <span className="text-xs text-gray-400 font-normal">UZS</span></p>
                               </div>
                               <div className="flex space-x-2">
                                    <button onClick={() => setEditingProduct(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition shadow-sm hover:shadow-md"><Edit size={18} /></button>
                                    <button onClick={() => handleDeleteProduct(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition shadow-sm hover:shadow-md"><Trash size={18} /></button>
                               </div>
                           </div>
                       </div>
                   ))}
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="animate-fade-in max-w-7xl mx-auto">
            <h2 className="text-3xl font-black text-slate-800 mb-8">Buyurtmalar</h2>
            <div className="space-y-6">
               {orders.length === 0 && (
                   <div className="bg-white p-20 text-center rounded-3xl border border-dashed border-gray-300">
                       <ShoppingBag className="mx-auto text-gray-300 mb-6" size={64} />
                       <h3 className="text-xl font-bold text-gray-400">Hozircha buyurtmalar mavjud emas</h3>
                   </div>
               )}
               {orders.slice().reverse().map((order, idx) => (
                   <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 animate-fade-in-up" style={{animationDelay: `${idx * 0.05}s`}}>
                       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-gray-50 pb-4">
                           <div>
                               <div className="flex items-center gap-3 mb-1">
                                    <h3 className="font-black text-xl text-slate-800">{order.customerName}</h3>
                                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-mono font-bold">{order.id}</span>
                               </div>
                               <div className="flex items-center text-sm text-gray-500 font-medium gap-4">
                                   <span>{order.phone}</span>
                                   <span>•</span>
                                   <span>{new Date(order.date).toLocaleString()}</span>
                               </div>
                           </div>
                           <div className="mt-4 md:mt-0 flex flex-col items-end">
                               <p className="font-black text-2xl text-fortex-primary">{order.totalAmount.toLocaleString()} <span className="text-sm text-gray-400 font-normal">UZS</span></p>
                               <div className="mt-2 relative">
                                <select 
                                    value={order.status} 
                                    onChange={(e) => {
                                        updateOrderStatus(order.id, e.target.value as any);
                                        setOrders(getOrders()); 
                                    }}
                                    className={`appearance-none text-sm font-bold px-4 py-2 pr-8 rounded-lg border-2 cursor-pointer transition outline-none shadow-sm ${
                                        order.status === 'Pending' ? 'text-yellow-700 bg-yellow-50 border-yellow-200' : 
                                        order.status === 'Accepted' ? 'text-blue-700 bg-blue-50 border-blue-200' :
                                        order.status === 'Ready' ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'
                                    }`}
                                >
                                    <option value="Pending">Kutilmoqda</option>
                                    <option value="Accepted">Qabul qilindi</option>
                                    <option value="Ready">Tayyor</option>
                                    <option value="Cancelled">Bekor qilindi</option>
                                </select>
                               </div>
                           </div>
                       </div>
                       <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                           {order.items.map((item, idx) => (
                               <div key={idx} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0 text-sm">
                                   <div className="flex items-center">
                                       <span className="font-bold text-slate-400 mr-3 w-4">{idx + 1}.</span>
                                       <img src={item.product.image_url} className="w-8 h-8 object-contain mr-3 bg-white rounded border border-gray-200" alt=""/>
                                       <span className="font-bold text-slate-700">{item.product.name}</span>
                                       <span className="text-gray-300 mx-2">|</span>
                                       <span className="bg-white border px-2 py-0.5 rounded text-xs text-gray-600 font-medium">{item.selectedLiter}</span>
                                       <span className="text-gray-400 mx-2 text-xs">x</span>
                                       <span className="font-bold bg-slate-200 px-2 rounded-full text-xs">{item.quantity}</span>
                                   </div>
                                   <span className="font-bold text-slate-600">{(item.selectedPrice * item.quantity).toLocaleString()}</span>
                               </div>
                           ))}
                       </div>
                       <div className="mt-4 flex justify-between items-center text-sm px-1">
                            <span className="text-gray-500 font-medium flex items-center">
                                To'lov turi: 
                                <span className={`ml-2 font-bold px-2 py-0.5 rounded ${order.paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                    {order.paymentMethod === 'card' ? 'Karta orqali' : 'Naqd pul'}
                                </span>
                            </span>
                       </div>
                   </div>
               ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;