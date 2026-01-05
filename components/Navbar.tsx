import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe, User } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pages that have a dark Hero section at the top where navbar can be transparent
  const isHeroPage = location.pathname === '/' || location.pathname === '/products';

  // Logic: 
  // If scrolled -> dark background
  // If NOT scrolled AND on Hero page -> transparent (text visible on dark image)
  // If NOT scrolled AND NOT on Hero page (e.g. Cart) -> dark background (to make white text visible)
  const useDarkBackground = scrolled || !isHeroPage;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${useDarkBackground ? 'bg-fortex-dark/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-6'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <span className="text-3xl font-black italic tracking-tighter text-white animate-slide-in-left drop-shadow-md">
              FORTEX<span className="text-blue-500">.UZ</span>
            </span>
          </Link>

          {/* Desktop Menu - Pill Style (Matches image 2) */}
          <div className="hidden md:flex items-center space-x-8 animate-fade-in">
            <div className="bg-white/5 backdrop-blur-sm px-6 py-2 rounded-full border border-white/10 flex items-center space-x-6 shadow-lg shadow-black/5">
              <Link to="/" className={`text-sm font-bold hover:text-white transition duration-300 uppercase tracking-wide ${location.pathname === '/' ? 'text-white' : 'text-gray-400'}`}>
                {t('home')}
              </Link>
              <Link to="/products" className={`text-sm font-bold hover:text-white transition duration-300 uppercase tracking-wide ${location.pathname === '/products' ? 'text-white' : 'text-gray-400'}`}>
                {t('products')}
              </Link>
              <Link to="/services" className={`text-sm font-bold hover:text-white transition duration-300 uppercase tracking-wide ${location.pathname === '/services' ? 'text-white' : 'text-gray-400'}`}>
                {t('services')}
              </Link>
              <Link to="/admin" className={`text-sm font-bold hover:text-white transition duration-300 uppercase tracking-wide ${location.pathname === '/admin' ? 'text-white' : 'text-gray-400'}`}>
                {t('admin')}
              </Link>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
                className="flex items-center space-x-1 text-sm font-bold text-gray-400 hover:text-white transition uppercase border-l border-white/10 pl-4"
              >
                <Globe size={16} />
                <span>{language.toUpperCase()}</span>
              </button>
            </div>

            <Link to="/cart" className="relative p-3 bg-blue-600 hover:bg-blue-500 rounded-full transition duration-300 group shadow-lg shadow-blue-600/30 border border-blue-400/30">
              <ShoppingCart size={24} className="text-white group-hover:scale-110 transition duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-fortex-dark">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Link */}
            <Link to={user ? "/profile" : "/auth"} className={`relative p-3 rounded-full transition duration-300 group ${user ? 'bg-fortex-primary hover:bg-blue-500 shadow-lg shadow-blue-600/30' : 'bg-white/10 hover:bg-white/20'}`}>
              <User size={24} className="text-white group-hover:scale-110 transition duration-300" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white bg-white/10 p-2 rounded-lg backdrop-blur-sm hover:bg-white/20 transition" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-fortex-dark/95 backdrop-blur-xl border-t border-gray-800 animate-fade-in-up shadow-2xl">
          <div className="flex flex-col p-6 space-y-4">
            <Link to="/" className="text-gray-300 hover:text-fortex-primary text-lg font-medium p-2 hover:bg-white/5 rounded transition" onClick={() => setIsOpen(false)}>{t('home')}</Link>
            <Link to="/products" className="text-gray-300 hover:text-fortex-primary text-lg font-medium p-2 hover:bg-white/5 rounded transition" onClick={() => setIsOpen(false)}>{t('products')}</Link>
            <Link to="/services" className="text-gray-300 hover:text-fortex-primary text-lg font-medium p-2 hover:bg-white/5 rounded transition" onClick={() => setIsOpen(false)}>{t('services')}</Link>
            <Link to="/cart" className="text-gray-300 hover:text-fortex-primary text-lg font-medium p-2 hover:bg-white/5 rounded transition" onClick={() => setIsOpen(false)}>{t('cart')} ({cartCount})</Link>
            <Link to={user ? "/profile" : "/auth"} className="text-gray-300 hover:text-fortex-primary text-lg font-medium p-2 hover:bg-white/5 rounded transition" onClick={() => setIsOpen(false)}>{user ? "Mening Profilim" : "Kirish / Ro'yxatdan o'tish"}</Link>
            <Link to="/admin" className="text-gray-300 hover:text-fortex-primary text-lg font-medium p-2 hover:bg-white/5 rounded transition" onClick={() => setIsOpen(false)}>{t('admin')}</Link>

            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={() => {
                  setLanguage(language === 'uz' ? 'ru' : 'uz');
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-between text-gray-300 hover:text-white p-2"
              >
                <span className="font-bold flex items-center"><Globe size={18} className="mr-2" /> Tilni o'zgartirish</span>
                <span className="bg-white/10 px-2 py-1 rounded text-sm font-bold">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;