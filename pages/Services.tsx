import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Clock, Car, User, Phone, CheckCircle, Wrench, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { sendBookingToTelegram } from '../services/telegram';

interface BookingForm {
    name: string;
    phone: string;
    carModel: string;
    serviceType: string;
    date: string;
}

const Services: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<BookingForm>({
        name: '',
        phone: '+998 ',
        carModel: '',
        serviceType: 'oil_change',
        date: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const services = [
        {
            id: 'oil_change',
            icon: <Zap className="w-12 h-12 text-blue-500" />,
            title: t('serv_oil_change'),
            desc: t('serv_oil_desc'),
            bg: 'bg-blue-50'
        },
        {
            id: 'filter_replace',
            icon: <Wrench className="w-12 h-12 text-orange-500" />,
            title: t('serv_filter'),
            desc: t('serv_filter_desc'),
            bg: 'bg-orange-50'
        },
        {
            id: 'diagnostics',
            icon: <ShieldCheck className="w-12 h-12 text-green-500" />,
            title: t('serv_diagnostics'),
            desc: t('serv_diagnostics_desc'),
            bg: 'bg-green-50'
        }
    ];

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        let digits = val.replace(/\D/g, '');
        if (!digits.startsWith('998')) digits = '998' + digits;
        if (digits.length > 12) digits = digits.slice(0, 12);

        let res = "+998";
        if (digits.length > 3) res += " " + digits.slice(3, 5);
        if (digits.length > 5) res += " " + digits.slice(5, 8);
        if (digits.length > 8) res += " " + digits.slice(8, 10);
        if (digits.length > 10) res += " " + digits.slice(10, 12);

        setFormData(prev => ({ ...prev, phone: res }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await sendBookingToTelegram(formData);
            setIsSuccess(true);
            setFormData({
                name: '',
                phone: '+998 ',
                carModel: '',
                serviceType: 'oil_change',
                date: ''
            });
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative pt-32 pb-24 bg-fortex-dark text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-900 opacity-90 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                    alt="Car Service"
                    className="absolute inset-0 w-full h-full object-cover opacity-30 animate-scale-in"
                    style={{ animationDuration: '30s' }}
                />

                <div className="container mx-auto px-4 relative z-20 text-center">
                    <div className="inline-block p-3 rounded-full bg-white/10 backdrop-blur-md mb-6 animate-fade-in-up">
                        <Wrench size={32} className="text-blue-400" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        {t('serv_title')}
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                        {t('serv_subtitle')}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {services.map((service, idx) => (
                        <div key={service.id} className={`bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100`} style={{ animationDelay: `${0.3 + (idx * 0.1)}s` }}>
                            <div className={`w-20 h-20 rounded-2xl ${service.bg} flex items-center justify-center mb-6`}>
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 mb-3">{service.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 lg:p-12">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-fortex-primary">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800">{t('serv_book_title')}</h2>
                                    <p className="text-sm text-gray-500">{t('serv_desc')}</p>
                                </div>
                            </div>

                            {isSuccess ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce-slow">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 mb-2">So'rovingiz Qabul Qilindi!</h3>
                                    <p className="text-gray-500 mb-6">Tez orada operatorlarimiz siz bilan bog'lanib, vaqtni tasqlashadi.</p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="text-fortex-primary font-bold hover:underline"
                                    >
                                        Yangi so'rov yuborish
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart_form_name')}</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition"
                                                placeholder="Ism Familiya"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('cart_form_phone')}</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition"
                                                placeholder="+998 90 123 45 67"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('serv_form_car')}</label>
                                            <div className="relative">
                                                <Car className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.carModel}
                                                    onChange={e => setFormData({ ...formData, carModel: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition"
                                                    placeholder="Chevrolet Malibu 2"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">{t('serv_form_date')}</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                                <input
                                                    required
                                                    type="datetime-local"
                                                    value={formData.date}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition text-gray-500"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('serv_form_type')}</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {services.map(service => (
                                                <label
                                                    key={service.id}
                                                    className={`cursor-pointer border-2 rounded-xl p-3 flex flex-col items-center justify-center text-center transition-all ${formData.serviceType === service.id ? 'border-fortex-primary bg-blue-50 text-fortex-primary shadow-md transform scale-105' : 'border-gray-100 hover:border-blue-200 text-gray-500'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="serviceType"
                                                        value={service.id}
                                                        checked={formData.serviceType === service.id}
                                                        onChange={() => setFormData({ ...formData, serviceType: service.id })}
                                                        className="hidden"
                                                    />
                                                    <div className="mb-2 scale-75">{service.icon}</div>
                                                    <span className="text-xs font-bold">{service.title}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-fortex-primary text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition shadow-lg shadow-blue-500/30 transform hover:-translate-y-1 flex items-center justify-center"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2" /> Yuborilmoqda...
                                            </>
                                        ) : (
                                            t('serv_submit')
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        <div className="hidden lg:block relative">
                            <img
                                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Service Center"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-fortex-dark/20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
