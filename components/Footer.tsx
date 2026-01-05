import React from 'react';
import { MapPin, Phone, Mail, Send, Instagram, ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '../types';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-fortex-dark text-gray-400 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Company Info */}
          <div className="animate-fade-in">
             <h3 className="text-2xl font-black italic text-white mb-6">FORTEX<span className="text-fortex-red">.UZ</span></h3>
             <p className="mb-6 leading-relaxed">
               Avtomobilingiz uchun eng yuqori sifatli moylash vositalari. 
               Bizning mahsulotlar dvigatelingiz uzoq va ishonchli xizmat qilishini ta'minlaydi.
             </p>
             <Link to="/products" className="inline-flex items-center text-fortex-primary font-bold hover:text-blue-400 transition">
               Mahsulotlarni ko'rish <ArrowRight size={16} className="ml-2" />
             </Link>
          </div>

          {/* Contacts */}
          <div className="animate-fade-in" style={{animationDelay: '0.1s'}}>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Biz bilan aloqa</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin size={20} className="mr-3 text-fortex-primary group-hover:text-white transition mt-1" />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center group">
                <div className="bg-white/5 p-2 rounded-full mr-3 group-hover:bg-green-500 transition-all duration-300 group-hover:scale-110">
                    <Phone size={18} className="text-fortex-primary group-hover:text-white transition" />
                </div>
                <a 
                    href={`tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`} 
                    className="hover:text-white transition-all duration-300 font-bold text-lg group-hover:translate-x-1"
                >
                    {COMPANY_INFO.phone}
                </a>
              </li>
              <li className="flex items-center group">
                <Mail size={20} className="mr-3 text-fortex-primary group-hover:text-white transition" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white transition">{COMPANY_INFO.email}</a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
            <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider">Ijtimoiy Tarmoqlar</h3>
            <p className="mb-6 text-sm">Yangiliklar va aksiyalardan xabardor bo'lish uchun bizga qo'shiling.</p>
            <div className="flex space-x-4">
              <a href={COMPANY_INFO.telegram} target="_blank" rel="noreferrer" className="bg-blue-500 hover:bg-blue-600 p-3 rounded-full text-white transition transform hover:scale-110 shadow-lg shadow-blue-500/30">
                <Send size={22} />
              </a>
              <a href={COMPANY_INFO.instagram} target="_blank" rel="noreferrer" className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-3 rounded-full text-white transition transform hover:scale-110 shadow-lg shadow-purple-500/30">
                <Instagram size={22} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© {new Date().getFullYear()} Fortex. Barcha huquqlar himoyalangan.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/" className="hover:text-white transition">Bosh Sahifa</Link>
            <Link to="/products" className="hover:text-white transition">Mahsulotlar</Link>
            <Link to="/admin" className="hover:text-white transition">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;