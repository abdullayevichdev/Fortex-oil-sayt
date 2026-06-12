import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Calendar, Clock, Car, User, Phone, CheckCircle, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { sendBookingToTelegram } from '../services/telegram';

interface BookingForm {
    name: string;
    phone: string;
    carModel: string;
    serviceType: string;
    date: string;
}

// Bosh sahifaga ko'chirilgan "Xizmatlar" bo'limi (avvalgi alohida sahifa o'rniga)
const ServicesSection: React.FC = () => {
    const { t } = useLanguage();
    const [formData, setFormData] = useState<BookingForm>({
        name: '',
        phone: '+998 ',
        carModel: '',
        serviceType: 'oil_filter_change',
        date: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const services = [
        {
            id: 'oil_filter_change',
            icon: <Zap className="w-12 h-12 text-blue-500" />,
            title: t('serv_oil_filter'),
            desc: t('serv_oil_desc'),
            bg: 'bg-blue-50'
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
        let digits = e.target.value.replace(/\D/g, '');
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
            setFormData({ name: '', phone: '+998 ', carModel: '', serviceType: 'oil_filter_change', date: '' });
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-14 animate-fade-in-up">
                    <span className="text-fortex-primary font-bold tracking-widest uppercase text-sm mb-2 block">{t('serv_subtitle')}</span>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{t('serv_title')}</h2>
                    <div className="w-20 h-1 bg-fortex-primary mx-auto mt-4 rounded-full"></div>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-5">{t('serv_desc')}</p>
                </div>

                {/* Service Cards */}
                <div className="flex flex-wrap justify-center gap-8 mb-16">
                    {services.map((service, idx) => (
                        <div key={service.id} className="w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-sm bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300 transform hover:-translate-y-2 animate-fade-in-up border border-gray-100 dark:border-slate-700" style={{ animationDelay: `${0.1 + (idx * 0.1)}s` }}>
                            <div className={`w-20 h-20 rounded-2xl ${service.bg} dark:bg-opacity-20 flex items-center justify-center mb-6`}>
                                {service.icon}
                            </div>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">{service.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{service.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Booking Form */}
                <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up border border-gray-100 dark:border-slate-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        <div className="p-8 lg:p-12">
                            <div className="flex items-center space-x-3 mb-8">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-fortex-primary">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 dark:text-white">{t('serv_book_title')}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('serv_desc')}</p>
                                </div>
                            </div>

                            {isSuccess ? (
                                <div className="text-center py-10">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-bounce-slow">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{t('serv_success_title')}</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mb-6">{t('serv_success_desc')}</p>
                                    <button onClick={() => setIsSuccess(false)} className="text-fortex-primary font-bold hover:underline">
                                        {t('serv_new_request')}
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('cart_form_name')}</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition dark:text-white dark:placeholder-gray-500"
                                                placeholder={t('placeholder_fullname')}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('cart_form_phone')}</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                            <input
                                                required
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handlePhoneChange}
                                                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition dark:text-white dark:placeholder-gray-500"
                                                placeholder="+998 90 123 45 67"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('serv_form_car')}</label>
                                            <div className="relative">
                                                <Car className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.carModel}
                                                    onChange={e => setFormData({ ...formData, carModel: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition dark:text-white dark:placeholder-gray-500"
                                                    placeholder={t('serv_car_placeholder')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('serv_form_date')}</label>
                                            <div className="relative">
                                                <Clock className="absolute left-4 top-3.5 text-gray-400" size={20} />
                                                <input
                                                    required
                                                    type="datetime-local"
                                                    value={formData.date}
                                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-fortex-primary focus:border-transparent outline-none transition text-gray-500 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('serv_form_type')}</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {services.map(service => (
                                                <label
                                                    key={service.id}
                                                    className={`cursor-pointer border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all ${formData.serviceType === service.id ? 'border-fortex-primary bg-blue-50 dark:bg-blue-900/20 text-fortex-primary shadow-md transform scale-105' : 'border-gray-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600 text-gray-500 dark:text-gray-400'}`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="serviceType"
                                                        value={service.id}
                                                        checked={formData.serviceType === service.id}
                                                        onChange={() => setFormData({ ...formData, serviceType: service.id })}
                                                        className="hidden"
                                                    />
                                                    <div className="mb-2">{service.icon}</div>
                                                    <span className="text-sm font-bold">{service.title}</span>
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
                                                <Loader2 className="animate-spin mr-2" /> {t('reviews_submitting')}
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
        </section>
    );
};

export default ServicesSection;
