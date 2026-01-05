import React, { useState } from 'react';
import { Product } from '../types';
import { Search, ChevronRight, Droplet, Car, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OilSelectorProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

// Mock Database
const CAR_DATA: Record<string, { models: string[] }> = {
    "Chevrolet": {
        models: ["Spark (1.0/1.25)", "Nexia 3", "Cobalt", "Gentra", "Lacetti (1.8)", "Malibu 1", "Malibu 2 (Turbo)", "Tracker 1", "Tracker 2 (Turbo)", "Tahoe", "Captiva", "Damas/Labo"]
    },
    "Daewoo": {
        models: ["Matiz", "Nexia 1/2 (DOHC)", "Nexia 1/2 (SOHC)"]
    },
    "Hyundai": {
        models: ["Accent", "Elantra", "Sonata", "Santa Fe", "Tucson"]
    },
    "Kia": {
        models: ["Carnival", "K5", "Seltos", "Sportage", "Sorento"]
    },
    "Lada": {
        models: ["Vesta", "XRay", "Granta", "Largus"]
    }
};

const RECOMMENDATIONS: Record<string, string> = {
    "Spark (1.0/1.25)": "10W-40",
    "Nexia 3": "5W-30",
    "Cobalt": "5W-30",
    "Gentra": "5W-30",
    "Lacetti (1.8)": "10W-40",
    "Malibu 1": "5W-30",
    "Malibu 2 (Turbo)": "5W-30",
    "Tracker 1": "5W-30",
    "Tracker 2 (Turbo)": "5W-30",
    "Tahoe": "0W-20",
    "Captiva": "5W-40",
    "Damas/Labo": "10W-40",
    "Matiz": "10W-40",
    "Nexia 1/2 (DOHC)": "10W-40",
    "Nexia 1/2 (SOHC)": "10W-40",
    "Accent": "5W-30",
    "Elantra": "5W-30",
    "Sonata": "5W-30",
    "Santa Fe": "5W-30",
    "Tucson": "5W-30",
    "Carnival": "5W-30",
    "K5": "5W-30",
    "Seltos": "5W-30",
    "Sportage": "5W-30",
    "Sorento": "5W-30",
    "Vesta": "5W-40",
    "XRay": "5W-40",
    "Granta": "10W-40",
    "Largus": "10W-40"
};

const OilSelector: React.FC<OilSelectorProps> = ({ products, onAddToCart }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [result, setResult] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleSearch = () => {
        if (!brand || !model) return;

        setLoading(true);
        setResult(null);

        // Simulate analysis delay
        setTimeout(() => {
            const viscosity = RECOMMENDATIONS[model];
            if (viscosity) {
                // Find best match in products. Prioritize premium brands if available, or just matching viscosity name.
                // Simple fuzzy match: check if product name contains the viscosity
                const match = products.find(p => p.name.includes(viscosity) && (p.tags.includes('Premium') || p.tags.includes('Top Product')))
                    || products.find(p => p.name.includes(viscosity));

                setResult(match || null);
            }
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="relative z-40 -mt-10 mb-20 container mx-auto px-4">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-100/50">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
                        <div>
                            <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                                <Car size={14} />
                                <span>{t('os_badge')}</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900">{t('os_title')}</h2>
                            <p className="text-gray-500 mt-2">{t('os_desc')}</p>
                        </div>

                        {/* Steps Indicator */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className={`w-3 h-3 rounded-full ${brand ? 'bg-green-500' : 'bg-gray-200'} transition-all`}></div>
                            <div className={`w-12 h-1 bg-gray-100 rounded-full overflow-hidden`}>
                                <div className={`h-full bg-green-500 transition-all duration-500 ${brand ? 'w-full' : 'w-0'}`}></div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${model ? 'bg-green-500' : 'bg-gray-200'} transition-all`}></div>
                            <div className={`w-12 h-1 bg-gray-100 rounded-full overflow-hidden`}>
                                <div className={`h-full bg-green-500 transition-all duration-500 ${model ? 'w-full' : 'w-0'}`}></div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${result ? 'bg-green-500' : 'bg-gray-200'} transition-all`}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Brand Selector */}
                        <div className="relative group">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{t('os_brand')}</label>
                            <select
                                value={brand}
                                onChange={e => { setBrand(e.target.value); setModel(''); setResult(null); }}
                                className="w-full bg-gray-50 hover:bg-white border text-lg border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700"
                            >
                                <option value="">{t('os_select')}</option>
                                {Object.keys(CAR_DATA).map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-[42px] pointer-events-none text-gray-400 group-hover:text-blue-500 transition">
                                <ChevronRight className="transform rotate-90" />
                            </div>
                        </div>

                        {/* Model Selector */}
                        <div className={`relative group transition-all duration-300 ${!brand ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">{t('os_model')}</label>
                            <select
                                value={model}
                                onChange={e => { setModel(e.target.value); setResult(null); }}
                                disabled={!brand}
                                className="w-full bg-gray-50 hover:bg-white border text-lg border-gray-200 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-bold text-slate-700"
                            >
                                <option value="">{t('os_select_brand_first')}</option>
                                {brand && CAR_DATA[brand].models.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-[42px] pointer-events-none text-gray-400 group-hover:text-blue-500 transition">
                                <ChevronRight className="transform rotate-90" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={!brand || !model || loading}
                                className="w-full h-[62px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                                        {t('os_analyzing')}
                                    </span>
                                ) : (
                                    <>
                                        <Search size={22} />
                                        <span>{t('os_btn')}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Results Section */}
                    {result && (
                        <div className="mt-8 pt-8 border-t border-dashed border-gray-200 animate-slide-up">
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-4">
                                    <CheckCircle size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">{t('os_success_title')}</h3>
                                    <p className="text-gray-500 text-sm">{t('os_success_desc', { car: `${brand} ${model}` })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 rounded-2xl p-6 border border-blue-100 hover:border-blue-200 transition-colors">
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24 bg-white rounded-xl p-2 shadow-sm border border-gray-100 flex-shrink-0">
                                        <img src={result.image_url} alt={result.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-blue-500 uppercase mb-1">{result.category}</div>
                                        <h4 className="font-black text-slate-900 text-xl leading-tight mb-2">{result.name}</h4>
                                        <div className="flex items-baseline space-x-2">
                                            <span className="font-bold text-slate-700">{result.price_uzs[0].toLocaleString()}</span>
                                            <span className="text-xs text-gray-500">{t('os_price_from')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={() => onAddToCart(result)}
                                        className="w-full md:w-auto bg-slate-900 hover:bg-black text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center"
                                    >
                                        <Droplet size={18} className="mr-2" />
                                        {t('os_add_cart')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OilSelector;
