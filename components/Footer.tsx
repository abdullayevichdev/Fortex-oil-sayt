import React from 'react';
import { MapPin, Phone, Mail, Send, Instagram, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../types';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="relative mt-10 px-3 sm:px-4 pb-4">
      <div className="container mx-auto">
        <div className="relative overflow-hidden rounded-[36px] bg-slate-950 text-slate-400 border border-white/10 shadow-[0_-20px_80px_-30px_rgba(37,99,235,0.5)]">
          {/* Glow dekoratsiyasi */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-blue-600/25 blur-[100px]"></div>
          <div className="pointer-events-none absolute -bottom-32 -right-20 w-[400px] h-[300px] rounded-full bg-violet-600/20 blur-[100px]"></div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent"></div>

          <div className="relative px-6 sm:px-10 pt-14 pb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
              {/* Company Info */}
              <div className="reveal">
                <h3 className="text-3xl font-black italic tracking-tighter text-white mb-5">FORTEX<span className="text-shimmer">.UZ</span></h3>
                <p className="mb-6 leading-relaxed">
                  {t('footer_about_desc')}
                </p>
                <Link to="/products" className="group inline-flex items-center text-blue-400 font-bold hover:text-blue-300 transition">
                  {t('footer_view_products')} <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              {/* Contacts */}
              <div className="reveal" style={{ ['--d' as any]: '0.1s' }}>
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-[0.16em]">{t('footer_contact_title')}</h3>
                <ul className="space-y-4">
                  <li className="flex items-center group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mr-3 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 transition">
                      <MapPin size={18} className="text-blue-400" />
                    </span>
                    <span>{COMPANY_INFO.address}</span>
                  </li>
                  <li className="flex items-center group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mr-3 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition">
                      <Phone size={18} className="text-emerald-400" />
                    </span>
                    <a
                      href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`}
                      className="hover:text-white transition-all duration-300 font-bold text-lg text-slate-200"
                    >
                      {COMPANY_INFO.phone}
                    </a>
                  </li>
                  <li className="flex items-center group">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 border border-white/10 mr-3 group-hover:bg-blue-500/20 group-hover:border-blue-400/40 transition">
                      <Mail size={18} className="text-blue-400" />
                    </span>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition">{COMPANY_INFO.email}</a>
                  </li>
                </ul>
              </div>

              {/* Socials */}
              <div className="reveal" style={{ ['--d' as any]: '0.2s' }}>
                <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-[0.16em]">{t('footer_social_title')}</h3>
                <p className="mb-6 text-sm">{t('footer_social_desc')}</p>
                <div className="flex gap-3">
                  <a href={COMPANY_INFO.telegram} target="_blank" rel="noreferrer" aria-label="Telegram" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(56,189,248,0.6)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                    <Send size={20} />
                  </a>
                  <a href={COMPANY_INFO.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 text-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(236,72,153,0.6)] shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <p>© {new Date().getFullYear()} {t('footer_rights')}</p>
              <div className="flex gap-1">
                <Link to="/" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition">{t('home')}</Link>
                <Link to="/products" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition">{t('products')}</Link>
                <Link to="/admin" className="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/5 transition">{t('admin')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;