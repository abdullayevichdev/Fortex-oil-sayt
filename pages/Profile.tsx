import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getOrders } from '../services/storage';
import { Order } from '../types';
import { Car, Plus, Trash, LogOut, Package, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
    const { user, logout, updateUser } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [newCar, setNewCar] = useState({ brand: '', model: '', year: '' });
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/auth');
            return;
        }
        // Filter orders for this user
        const allOrders = getOrders();
        const userOrders = allOrders.filter(o => o.phone === user.phone);
        setOrders(userOrders.reverse());
    }, [user, navigate]);

    if (!user) return null;

    const handleAddCar = (e: React.FormEvent) => {
        e.preventDefault();
        const car = { ...newCar, id: `car_${Date.now()}` };
        const updatedUser = { ...user, garage: [...user.garage, car] };
        updateUser(updatedUser);
        setNewCar({ brand: '', model: '', year: '' });
    };

    const handleDeleteCar = (id: string) => {
        const updatedUser = { ...user, garage: user.garage.filter(c => c.id !== id) };
        updateUser(updatedUser);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-24 pb-12 bg-gray-50">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Info Card */}
                    <div className="col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100">
                            <div className="flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-fortex-primary rounded-full flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-500/30 mb-4">
                                    {user.name[0].toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-black text-slate-800">{user.name}</h2>
                                <p className="text-gray-500 font-medium mb-6">{user.phone}</p>

                                <div className="w-full bg-blue-50 p-4 rounded-xl flex items-center justify-between mb-6">
                                    <div className="flex items-center text-blue-800 font-bold">
                                        <Award className="mr-2" /> Ballar
                                    </div>
                                    <span className="text-2xl font-black text-fortex-primary">{user.points}</span>
                                </div>

                                <button onClick={handleLogout} className="w-full flex items-center justify-center py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl transition">
                                    <LogOut size={20} className="mr-2" /> Chiqish
                                </button>
                            </div>
                        </div>

                        {/* Add Car */}
                        <div className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 mt-6">
                            <h3 className="font-bold text-lg mb-4 flex items-center"><Car className="mr-2 text-fortex-primary" /> Yangi Mashina</h3>
                            <form onSubmit={handleAddCar} className="space-y-3">
                                <input className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-fortex-primary" placeholder="Marka (Chevrolet)" value={newCar.brand} onChange={e => setNewCar({ ...newCar, brand: e.target.value })} required />
                                <input className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-fortex-primary" placeholder="Model (Cobalt)" value={newCar.model} onChange={e => setNewCar({ ...newCar, model: e.target.value })} required />
                                <input className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-fortex-primary" placeholder="Yil (2020)" value={newCar.year} onChange={e => setNewCar({ ...newCar, year: e.target.value })} required />
                                <button className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center hover:bg-gray-800 transition"><Plus size={18} className="mr-2" /> Qo'shish</button>
                            </form>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-1 md:col-span-2 space-y-8">

                        {/* Garage */}
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center">Mening Garajim <span className="ml-3 bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">{user.garage.length}</span></h3>
                            {user.garage.length === 0 ? (
                                <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-300 text-center text-gray-400">
                                    <Car size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Hozircha mashina yo'q</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {user.garage.map(car => (
                                        <div key={car.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start group hover:border-fortex-primary transition">
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-800">{car.brand} {car.model}</h4>
                                                <p className="text-gray-500 font-medium text-sm">{car.year}-yil</p>
                                            </div>
                                            <button onClick={() => handleDeleteCar(car.id)} className="text-gray-300 hover:text-red-500 transition"><Trash size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Order History */}
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 mb-4 flex items-center">Buyurtmalar Tarixi</h3>
                            {orders.length === 0 ? (
                                <div className="bg-white p-8 rounded-3xl border border-dashed border-gray-300 text-center text-gray-400">
                                    <Package size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>Buyurtmalar mavjud emas</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center">
                                            <div className="mb-4 md:mb-0">
                                                <div className="flex items-center mb-2">
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold mr-3 ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                            order.status === 'Ready' ? 'bg-green-100 text-green-700' :
                                                                'bg-blue-100 text-blue-700'
                                                        }`}>{order.status}</span>
                                                    <span className="text-gray-400 text-sm font-mono">#{order.id.slice(-6)}</span>
                                                </div>
                                                <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</p>
                                                <div className="mt-2 text-sm font-bold text-slate-700">
                                                    {order.items.map(i => `${i.product.name} (${i.quantity}x)`).join(', ')}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-fortex-primary">{order.totalAmount.toLocaleString()} UZS</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
