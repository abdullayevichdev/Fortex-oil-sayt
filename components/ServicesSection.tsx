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
            icon: <Zap className="w-9 h-9" />,
            title: t('serv_oil_filter'),
            desc: t('serv_oil_desc'),
            bg: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.55)'
        },
        {
            id: 'diagnostics',
            icon: <ShieldCheck className="w-9 h-9" />,
            title: t('serv_diagnostics'),
            desc: t('serv_diagnostics_desc'),
            bg: 'from-emerald-400 to-teal-600', glow: 'rgba(16,185,129,0.55)'
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

    const label = "block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.14em] mb-2";
    const icon = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none";

    return (
        <section id="services" className="py-20 relative">
            <div className="container mx-auto px-4">
                {/* Section Header */}
                <div className="text-center mb-14 reveal">
                    <span className="eyebrow"><span className="eyebrow-dot"></span> {t('serv_subtitle')}</span>
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">{t('serv_title')}</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-5 text-lg">{t('serv_desc')}</p>
                </div>

                {/* Service Cards */}
                <div className="flex flex-wrap justify-center gap-6 mb-16">
                    {services.map((service, idx) => (
                        <div key={service.id} className="reveal w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] max-w-sm" style={{ ['--d' as any]: `${idx * 0.1}s` }}>
                            <div className="glass spotlight group h-full p-8 rounded-[28px] transition-all duration-500 hover:-translate-y-2">
                                <div
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.bg} text-white flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                                    style={{ boxShadow: `0 12px 30px -6px ${service.glow}, inset 0 1px 0 rgba(255,255,255,0.4)` }}
                                >
                                    {service.icon}
                                </div>
                                <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white mb-3">{service.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Booking Form */}
                <div className="reveal max-w-5xl mx-auto">
                    <div className="glass glow-border rounded-[32px]">
                        <span className="glow-halo"></span>
                        <div className="grid grid-cols-1 lg:grid-cols-2 relative">
                            <div className="p-6 sm:p-8 lg:p-12">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-12 h-12 shrink-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_24px_rgba(59,130,246,0.55),inset_0_1px_0_rgba(255,255,255,0.4)]">
                                        <Calendar size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">{t('serv_book_title')}</h2>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{t('serv_desc')}</p>
                                    </div>
                                </div>

                                {isSuccess ? (
                                    <div className="text-center py-10 animate-scale-in">
                                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white animate-bounce-slow shadow-[0_0_40px_rgba(52,211,153,0.6)]">
                                            <CheckCircle size={40} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('serv_success_title')}</h3>
                                        <p className="text-slate-500 dark:text-slate-400 mb-6">{t('serv_success_desc')}</p>
                                        <button onClick={() => setIsSuccess(false)} className="btn-glass px-6 py-3 rounded-full text-blue-600 dark:text-blue-400 font-bold">
                                            {t('serv_new_request')}
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div>
                                            <label className={label}>{t('cart_form_name')}</label>
                                            <div className="relative">
                                                <User className={icon} size={19} />
                                                <input
                                                    required
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="field pl-12 pr-4 py-3.5"
                                                    placeholder={t('placeholder_fullname')}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className={label}>{t('cart_form_phone')}</label>
                                            <div className="relative">
                                                <Phone className={icon} size={19} />
                                                <input
                                                    required
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={handlePhoneChange}
                                                    className="field pl-12 pr-4 py-3.5"
                                                    placeholder="+998 90 123 45 67"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-end">
                                            <div>
                                                <label className={label}>{t('serv_form_car')}</label>
                                                <div className="relative">
                                                    <Car className={icon} size={19} />
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.carModel}
                                                        onChange={e => setFormData({ ...formData, carModel: e.target.value })}
                                                        className="field pl-12 pr-4 py-3.5"
                                                        placeholder={t('serv_car_placeholder')}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className={label}>{t('serv_form_date')}</label>
                                                <div className="relative">
                                                    <Clock className={icon} size={19} />
                                                    <input
                                                        required
                                                        type="datetime-local"
                                                        value={formData.date}
                                                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                                                        className="field pl-12 pr-4 py-3.5"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className={label}>{t('serv_form_type')}</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {services.map(service => {
                                                    const active = formData.serviceType === service.id;
                                                    return (
                                                        <label
                                                            key={service.id}
                                                            className={`cursor-pointer rounded-2xl p-4 flex flex-col items-center justify-center text-center border transition-all duration-300 ${active
                                                                ? 'border-blue-500/60 bg-blue-500/10 text-blue-600 dark:text-blue-300 shadow-[0_0_0_4px_rgba(59,130,246,0.12),0_0_30px_rgba(59,130,246,0.25)] scale-[1.02]'
                                                                : 'border-slate-900/10 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:border-blue-400/40 hover:bg-white/40 dark:hover:bg-white/5'}`}
                                                        >
                                                            <input
                                                                type="radio"
                                                                name="serviceType"
                                                                value={service.id}
                                                                checked={active}
                                                                onChange={() => setFormData({ ...formData, serviceType: service.id })}
                                                                className="hidden"
                                                            />
                                                            <div className="mb-2 [&>svg]:w-7 [&>svg]:h-7">{service.icon}</div>
                                                            <span className="text-sm font-bold">{service.title}</span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn-glow w-full font-bold py-4 rounded-2xl flex items-center justify-center"
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

                            <div className="hidden lg:block relative m-2 rounded-[26px] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="Service Center"
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/10 to-transparent"></div>
                                <div className="glass-dark absolute bottom-5 left-5 right-5 rounded-2xl p-5 text-white">
                                    <p className="text-xs uppercase tracking-[0.16em] text-blue-200 font-bold mb-1">FORTEX SERVICE</p>
                                    <p className="font-bold text-lg leading-snug">{t('serv_title')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
