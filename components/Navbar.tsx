import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Globe, Moon, Sun, Droplets, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  cartCount: number;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  // "Xizmatlar" Bosh sahifadagi bo'lim. Avval "/" ga o'tib, keyin bo'limga silliq scroll qilamiz.
  const goToServices = () => {
    setIsOpen(false);
    const scroll = () => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
    if (location.pathname === '/') {
      scroll();
    } else {
      navigate('/');
      setTimeout(scroll, 350);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Qorong'i hero bo'lmagan sahifalarda (masalan, Savat) kapsula doim to'q bo'ladi
  const isHeroPage = location.pathname === '/' || location.pathname === '/products';
  const solid = scrolled || isOpen || !isHeroPage;

  // Savat raqami o'zgarganda "pop" animatsiyasi
  const [popKey, setPopKey] = useState(0);
  useEffect(() => { setPopKey(k => k + 1); }, [cartCount]);

  // Mobil menyu ochiq bo'lsa, yo'nalish o'zgarganda yopish
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const links = [
    { to: '/', label: t('home') },
    { to: '/products', label: t('products') },
  ];

  const pillLink = (active: boolean) =>
    `relative px-4 py-2 rounded-full text-[13px] font-semibold tracking-wide transition-all duration-300 ${active
      ? 'text-white bg-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_20px_rgba(59,130,246,0.35)]'
      : 'text-white/70 hover:text-white hover:bg-white/10'}`;

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'pt-3' : 'pt-5'}`}>
      <div className="container mx-auto px-3 sm:px-4">
        <div
          className={`relative flex justify-between items-center rounded-full pl-5 pr-2 py-2 transition-all duration-500 ${solid
            ? 'bg-slate-950/70 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.15)] border border-white/10'
            : 'bg-slate-950/25 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'}`}
          style={{ WebkitBackdropFilter: 'blur(24px) saturate(180%)', backdropFilter: 'blur(24px) saturate(180%)' }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_0_20px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.4)] transition-transform duration-500 group-hover:rotate-[12deg] group-hover:scale-110">
              <Droplets size={16} className="text-white" />
            </span>
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-white">
              FORTEX<span className="text-shimmer">.UZ</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to} className={pillLink(location.pathname === l.to)}>{l.label}</Link>
            ))}
            <button onClick={goToServices} className={pillLink(false)}>{t('services')}</button>
            <Link to="/admin" className={pillLink(location.pathname === '/admin')}>{t('admin')}</Link>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'uz' ? 'ru' : 'uz')}
              className="hidden md:flex items-center gap-1.5 h-10 px-3 rounded-full text-[13px] font-bold text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Til"
            >
              <Globe size={16} />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hidden md:flex h-10 w-10 items-center justify-center rounded-full text-white/80 hover:text-yellow-300 hover:bg-white/10 transition"
              aria-label="Mavzu"
            >
              <span key={theme} className="animate-scale-in">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</span>
            </button>

            {/* Cart — badge tugmadan tashqarida, shuning uchun kesilmaydi */}
            <div className="relative">
              <Link to="/cart" className="btn-glow flex h-11 w-11 items-center justify-center rounded-full" aria-label={t('cart')}>
                <ShoppingCart size={19} />
              </Link>
              {cartCount > 0 && (
                <span key={popKey} className="badge-pop pointer-events-none absolute -top-1.5 -right-1.5 z-10 bg-gradient-to-br from-rose-500 to-orange-500 text-white text-[10px] font-bold leading-none rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center ring-2 ring-slate-950 shadow-[0_0_12px_rgba(244,63,94,0.7)]">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex h-11 w-11 items-center justify-center rounded-full text-white bg-white/10 hover:bg-white/20 transition"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Menu"
            >
              <span key={String(isOpen)} className="animate-scale-in">{isOpen ? <X size={22} /> : <Menu size={22} />}</span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden mt-2 rounded-3xl border border-white/10 bg-slate-950/70 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] animate-scale-in origin-top"
            style={{ WebkitBackdropFilter: 'blur(28px) saturate(180%)', backdropFilter: 'blur(28px) saturate(180%)' }}
          >
            <div className="flex flex-col p-3">
              {[
                { to: '/', label: t('home') },
                { to: '/products', label: t('products') },
              ].map((l, i) => (
                <Link key={l.to} to={l.to} onClick={() => setIsOpen(false)} className="animate-fade-in-up opacity-0 flex items-center justify-between text-white/85 hover:text-white text-base font-semibold px-4 py-3 rounded-2xl hover:bg-white/10 transition" style={{ animationDelay: `${i * 0.05}s` }}>
                  {l.label}<ChevronRight size={18} className="text-white/40" />
                </Link>
              ))}
              <button onClick={goToServices} className="animate-fade-in-up opacity-0 flex items-center justify-between text-left text-white/85 hover:text-white text-base font-semibold px-4 py-3 rounded-2xl hover:bg-white/10 transition" style={{ animationDelay: '0.1s' }}>
                {t('services')}<ChevronRight size={18} className="text-white/40" />
              </button>
              <Link to="/cart" onClick={() => setIsOpen(false)} className="animate-fade-in-up opacity-0 flex items-center justify-between text-white/85 hover:text-white text-base font-semibold px-4 py-3 rounded-2xl hover:bg-white/10 transition" style={{ animationDelay: '0.15s' }}>
                {t('cart')}<span className="text-xs font-bold bg-blue-500/30 text-blue-200 px-2.5 py-1 rounded-full">{cartCount}</span>
              </Link>
              <Link to="/admin" onClick={() => setIsOpen(false)} className="animate-fade-in-up opacity-0 flex items-center justify-between text-white/85 hover:text-white text-base font-semibold px-4 py-3 rounded-2xl hover:bg-white/10 transition" style={{ animationDelay: '0.2s' }}>
                {t('admin')}<ChevronRight size={18} className="text-white/40" />
              </Link>

              <div className="mt-2 pt-3 border-t border-white/10 grid grid-cols-2 gap-2">
                <button
                  onClick={() => { setLanguage(language === 'uz' ? 'ru' : 'uz'); setIsOpen(false); }}
                  className="flex items-center justify-between text-white/80 hover:text-white px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition"
                >
                  <span className="flex items-center text-sm font-semibold"><Globe size={16} className="mr-2" />{t('theme_lang')}</span>
                  <span className="text-xs font-bold">{language.toUpperCase()}</span>
                </button>
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="flex items-center justify-between text-white/80 hover:text-white px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition"
                >
                  <span className="flex items-center text-sm font-semibold">
                    {theme === 'dark' ? <Sun size={16} className="mr-2" /> : <Moon size={16} className="mr-2" />}
                    {theme === 'dark' ? t('theme_dark') : t('theme_light')}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;