import React from 'react';
import { Product } from '../types';
import { MapPin, ArrowRight, ShieldCheck, Zap, Award, Sparkles, Navigation } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import OilSelector from '../components/OilSelector';
import ProductCard from '../components/ProductCard';
import ServicesSection from '../components/ServicesSection';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  products: Product[];
  addToCart: (product: Product, liter?: string) => void;
}

// Bosh sahifada ko'rsatiladigan tanlangan premium mahsulotlar (tartib bilan)
const FEATURED_IDS = ['p9', 'p10', 'p3', 'p15', 'p5', 'p1'];

const Home: React.FC<HomeProps> = ({ products, addToCart }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // Tanlangan mahsulotlarni tartib bo'yicha olish; topilmasa birinchi 6 tasi bilan to'ldirish
  const featuredProducts = (() => {
    const picked = FEATURED_IDS
      .map(id => products.find(p => p.id === id))
      .filter((p): p is Product => Boolean(p));
    if (picked.length >= 6) return picked.slice(0, 6);
    const extra = products.filter(p => !picked.includes(p)).slice(0, 6 - picked.length);
    return [...picked, ...extra];
  })();

  const features = [
    { icon: <ShieldCheck size={26} />, title: t('feat_1_title'), desc: t('feat_1_desc'), tint: 'from-blue-500 to-indigo-600', glow: 'rgba(59,130,246,0.55)' },
    { icon: <Zap size={26} />, title: t('feat_2_title'), desc: t('feat_2_desc'), tint: 'from-cyan-400 to-blue-600', glow: 'rgba(6,182,212,0.55)' },
    { icon: <Award size={26} />, title: t('feat_3_title'), desc: t('feat_3_desc'), tint: 'from-violet-500 to-fuchsia-600', glow: 'rgba(139,92,246,0.55)' },
  ];

  const brands = ['FORTEX', 'SHELL', 'CASTROL', 'LUKOIL', 'LIQUI MOLY', 'VENOL', 'ZIC', 'MOBIL', 'TOTAL', 'MOTUL', 'G-ENERGY', 'KIXX'];

  return (
    <div className="transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-fortex-dark text-white">
        {/* Background photo (public/fortex-store.jpg) */}
        <img
          src="/fortex-store.png"
          alt="Fortex"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
          className="absolute inset-0 w-full h-full object-cover z-0 animate-scale-in"
          style={{ animationDuration: '12s' }}
        />
        {/* Yengil overlay - rasm tiniq, lekin chap tomondagi yozuvlar o'qiladigan bo'lsin */}
        <div className="absolute inset-0 bg-gradient-to-r from-fortex-dark/95 via-fortex-dark/60 to-fortex-dark/20 z-10 transition-colors"></div>

        <div className="container mx-auto px-4 relative z-20 pt-16">
          <div className="max-w-3xl space-y-8">
            <div className="glass-dark inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-blue-200 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] animate-fade-in-up">
              <span className="eyebrow-dot text-cyan-300"></span>
              {t('hero_badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black leading-[1.05] tracking-tight animate-fade-in-up break-words drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]" style={{ animationDelay: '0.1s' }}>
              {t('hero_title_1')} <br />
              <span className="text-shimmer">{t('hero_title_2')}</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/75 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t('hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="btn-glow group font-bold py-4 px-9 rounded-full flex items-center justify-center">
                {t('hero_btn_catalog')} <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </Link>
              <button
                type="button"
                onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
                className="glass-dark px-9 py-4 rounded-full hover:bg-white/15 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-center font-bold"
              >
                <Navigation size={18} className="mr-2" /> {t('hero_btn_location')}
              </button>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Scroll"
          onClick={() => window.scrollTo({ top: window.innerHeight - 40, behavior: 'smooth' })}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 hidden sm:block animate-fade-in"
          style={{ animationDelay: '1s' }}
        >
          <span className="scroll-cue block"></span>
        </button>
      </div>

      {/* Oil Selector Wizard */}
      <OilSelector products={products} onAddToCart={addToCart} />

      {/* Brendlar lentasi */}
      <div className="reveal container mx-auto px-4 pb-6">
        <div className="marquee overflow-hidden py-4">
          <div className="marquee-track gap-12">
            {[...brands, ...brands].map((b, i) => (
              <span key={i} className="text-2xl md:text-3xl font-black italic tracking-tighter text-slate-400/60 dark:text-white/20 hover:text-blue-500 dark:hover:text-blue-400 transition-colors whitespace-nowrap">{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-12 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="reveal" style={{ ['--d' as any]: `${i * 0.1}s` }}>
              <div className="glass spotlight group h-full p-8 rounded-[28px] transition-all duration-500 hover:-translate-y-2">
                <div
                  className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.tint} flex items-center justify-center mb-6 text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                  style={{ boxShadow: `0 10px 30px -6px ${f.glow}, inset 0 1px 0 rgba(255,255,255,0.4)` }}
                >
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white tracking-tight">{f.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <div className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-14 reveal">
              <span className="eyebrow mb-5"><Sparkles size={13} /> {t('featured_subtitle')}</span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">{t('featured_title')}</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-5 text-lg">{t('featured_desc')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className="reveal" style={{ ['--d' as any]: `${(index % 3) * 0.08}s` }}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onViewDetails={() => navigate('/products')}
                  />
                </div>
              ))}
            </div>

            <div className="text-center mt-14 reveal">
              <Link
                to="/products"
                className="btn-glass group inline-flex items-center text-slate-900 dark:text-white font-bold py-4 px-10 rounded-full"
              >
                {t('featured_view_all')} <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <ServicesSection />

      {/* Google Map Section */}
      <div id="location" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14 reveal">
            <span className="eyebrow"><MapPin size={13} /> {t('map_subtitle')}</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mt-4">{t('map_title')}</h2>
          </div>

          <div className="reveal glass glow-border p-2 rounded-[32px] h-[460px] md:h-[520px] relative">
            <span className="glow-halo"></span>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3012.378954752672!2d71.732222!3d40.969778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDU4JzExLjIiTiA3McKwNDMnNTYuMCJF!5e0!3m2!1sen!2s!4v1715000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fortex Location"
              className="rounded-[26px] w-full h-full"
            ></iframe>
            <div className="glass-strong absolute bottom-5 left-5 right-5 sm:right-auto p-4 rounded-2xl flex items-center gap-4 sm:max-w-xs animate-float">
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-3 rounded-2xl shadow-[0_0_24px_rgba(59,130,246,0.6)]">
                <MapPin size={22} />
                <span className="absolute inset-0 rounded-2xl ring-2 ring-blue-400/60 animate-ping"></span>
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t('map_location')}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">40°58'11.2"N 71°43'56.0"E</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
