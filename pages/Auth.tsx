import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Phone, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [phone, setPhone] = useState('+998 ');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            if (login(phone, password)) {
                navigate('/profile');
            } else {
                alert("Login yoki parol xato!");
            }
        } else {
            register(name, phone, password);
            navigate('/profile');
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        // Allow digit input, ensuring +998 prefix
        let digits = val.replace(/\D/g, '');
        if (!digits.startsWith('998')) digits = '998' + digits;

        // Limit to 12 digits (998 + 9 digits)
        if (digits.length > 12) digits = digits.slice(0, 12);

        // Format: +998 90 123 45 67
        let res = "+998";
        if (digits.length > 3) res += " " + digits.slice(3, 5);
        if (digits.length > 5) res += " " + digits.slice(5, 8);
        if (digits.length > 8) res += " " + digits.slice(8, 10);
        if (digits.length > 10) res += " " + digits.slice(10, 12);

        setPhone(res);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                <div className="bg-fortex-dark p-8 text-center text-white">
                    <h2 className="text-3xl font-black italic tracking-tighter">FORTEX<span className="text-blue-500">.UZ</span></h2>
                    <p className="text-gray-400 mt-2">{isLogin ? t('auth_welcome') : t('auth_register')}</p>
                </div>

                <div className="p-8">
                    <div className="flex mb-8 bg-gray-100 dark:bg-slate-700 p-1 rounded-xl">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${isLogin ? 'bg-white dark:bg-slate-600 text-fortex-primary shadow-sm' : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            {t('auth_login')}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-2 rounded-lg font-bold text-sm transition ${!isLogin ? 'bg-white dark:bg-slate-600 text-fortex-primary shadow-sm' : 'text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
                        >
                            {t('auth_register')}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth_name')}</label>
                                <div className="relative">
                                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition font-medium dark:text-white dark:placeholder-gray-500"
                                        placeholder={t('auth_name_placeholder')}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth_phone')}</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    maxLength={17}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition font-medium dark:text-white dark:placeholder-gray-500"
                                    placeholder={t('auth_phone_placeholder')}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{t('auth_password')}</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary outline-none transition font-medium dark:text-white dark:placeholder-gray-500"
                                    placeholder={t('auth_password_placeholder')}
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-fortex-primary text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition mt-4">
                            {isLogin ? t('auth_submit_login') : t('auth_submit_register')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Auth;
