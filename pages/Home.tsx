import React from 'react';
import { Product } from '../types';
import { MapPin, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import OilSelector from '../components/OilSelector';
import { useLanguage } from '../contexts/LanguageContext';

interface HomeProps {
  products: Product[];
  addToCart: (product: Product, liter?: string) => void;
}

const Home: React.FC<HomeProps> = ({ products, addToCart }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center overflow-hidden bg-fortex-dark text-white">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0 opacity-30 animate-scale-in" style={{ animationDuration: '10s' }}>
          <img
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-fortex-dark via-fortex-dark/90 to-transparent z-10"></div>

        <div className="container mx-auto px-4 relative z-20 pt-16">
          <div className="max-w-3xl space-y-8">
            <div className="inline-block px-4 py-1 border border-blue-500/50 rounded-full bg-blue-500/10 backdrop-blur-sm text-blue-400 text-sm font-bold uppercase tracking-wider animate-fade-in-up">
              {t('hero_badge')}
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t('hero_title_1')} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t('hero_title_2')}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {t('hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <Link to="/products" className="group bg-fortex-primary hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center">
                {t('hero_btn_catalog')} <ArrowRight className="ml-2 group-hover:translate-x-1 transition" />
              </Link>
              <a href="#location" className="px-10 py-4 rounded-lg border border-white/20 hover:bg-white/10 transition flex items-center justify-center font-bold">
                {t('hero_btn_location')}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Oil Selector Wizard */}
      <OilSelector products={products} onAddToCart={addToCart} />

      {/* Features Grid (Replaces Red Banner) */}
      <div className="container mx-auto px-4 py-12 relative z-30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition duration-500">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-fortex-primary">
              <ShieldCheck size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t('feat_1_title')}</h3>
            <p className="text-gray-500 leading-relaxed">{t('feat_1_desc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition duration-500">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-fortex-primary">
              <Zap size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t('feat_2_title')}</h3>
            <p className="text-gray-500 leading-relaxed">{t('feat_2_desc')}</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-xl hover:-translate-y-2 transition duration-500">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-fortex-primary">
              <Award size={32} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">{t('feat_3_title')}</h3>
            <p className="text-gray-500 leading-relaxed">{t('feat_3_desc')}</p>
          </div>
        </div>
      </div>

      {/* Google Map Section */}
      <div id="location" className="py-20 bg-white relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in-up">
            <span className="text-fortex-primary font-bold tracking-widest uppercase text-sm mb-2 block">Lokatsiya</span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Bizni Topish Oson</h2>
            <div className="w-20 h-1 bg-fortex-primary mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="bg-slate-100 p-2 rounded-3xl shadow-2xl overflow-hidden h-[500px] relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3012.378954752672!2d71.732222!3d40.969778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNDDCsDU4JzExLjIiTiA3McKwNDMnNTYuMCJF!5e0!3m2!1sen!2s!4v1715000000000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fortex Location"
              className="rounded-2xl"
            ></iframe>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-lg flex items-center space-x-4 max-w-xs animate-fade-in-up">
              <div className="bg-fortex-primary text-white p-3 rounded-full">
                <MapPin size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-800">Namangan, O'zbekiston</p>
                <p className="text-xs text-gray-500">40°58'11.2"N 71°43'56.0"E</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;