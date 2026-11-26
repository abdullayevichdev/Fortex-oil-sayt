import React, { useState } from 'react';
import { Product } from '../types';
import { Search, ChevronRight, Droplet, Car, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { handleImageError } from '../utils/image';

interface OilSelectorProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

// Comprehensive Database of Cars in Uzbekistan
const CAR_DATA: Record<string, { models: string[] }> = {
    "Chevrolet": {
        models: ["Spark (1.0/1.25)", "Nexia 1 (SOHC)", "Nexia 1/2 (DOHC)", "Nexia 3", "Cobalt", "Gentra", "Lacetti (1.8)", "Malibu 1", "Malibu 2 (1.5/2.0 Turbo)", "Tracker 1", "Tracker 2", "Captiva 1/2", "Captiva 3/4", "Captiva 5 (2024)", "Tahoe", "Traverse", "Equinox", "Trailblazer", "Orlando", "Damas", "Labo", "Monza", "Onix"]
    },
    "Daewoo": {
        models: ["Matiz (0.8/1.0)", "Nexia 1 (SOHC)", "Nexia 1/2 (DOHC)", "Tico", "Damas (Old)", "Espero", "Leganza"]
    },
    "Hyundai": {
        models: ["Accent", "Elantra", "Sonata", "Tucson", "Santa Fe", "Creta", "Palisade", "Getz", "I30", "Starex"]
    },
    "Kia": {
        models: ["K5", "K8", "Seltos", "Sportage", "Sorento", "Carnival", "Rio", "Cerato", "Picanto", "Stinger", "Telluride", "Sonet"]
    },
    "Toyota": {
        models: ["Corolla", "Camry", "RAV4", "Land Cruiser Prado", "Land Cruiser 200", "Land Cruiser 300", "Highlander", "Hilux", "Yaris"]
    },
    "Lada (VAZ)": {
        models: ["Vesta", "XRay", "Granta", "Largus", "Niva Legend (4x4)", "Niva Travel", "Priora", "Kalina", "2107", "2106"]
    },
    "BYD (Hybrid/PHEV)": {
        models: ["Song Plus DM-i", "Chazor (Destroyer 05)", "Han DM-i", "Tang DM-i", "Qin Plus"]
    },
    "Chery": {
        models: ["Tiggo 7 Pro", "Tiggo 8 Pro", "Arrizo 6"]
    },
    "Jetour": {
        models: ["X70 Plus", "X90 Plus", "Dashing"]
    },
    "BMW": {
        models: ["3 Series", "5 Series", "7 Series", "X3", "X5", "X6", "X7"]
    },
    "Mercedes-Benz": {
        models: ["C-Class", "E-Class", "S-Class", "G-Class (Gelik)", "GLE", "GLS"]
    }
};

const RECOMMENDATIONS: Record<string, string> = {
    // Chevrolet
    "Spark (1.0/1.25)": "5W-30",
    "Nexia 1 (SOHC)": "10W-40",
    "Nexia 1/2 (DOHC)": "10W-40",
    "Nexia 3": "5W-30",
    "Cobalt": "5W-30",
    "Gentra": "5W-30",
    "Lacetti (1.8)": "10W-40",
    "Malibu 1": "5W-30",
    "Malibu 2 (1.5/2.0 Turbo)": "5W-30",
    "Tracker 1": "5W-30",
    "Tracker 2": "0W-20",
    "Captiva 1/2": "5W-40",
    "Captiva 3/4": "5W-30",
    "Captiva 5 (2024)": "5W-30",
    "Tahoe": "0W-20",
    "Traverse": "5W-30",
    "Equinox": "5W-30",
    "Trailblazer": "5W-30",
    "Orlando": "5W-30",
    "Damas": "10W-40",
    "Labo": "10W-40",
    "Monza": "5W-30",
    "Onix": "0W-20",

    // Daewoo
    "Matiz (0.8/1.0)": "10W-40",

    "Tico": "10W-40",
    "Damas (Old)": "15W-40",
    "Espero": "10W-40",
    "Leganza": "10W-40",

    // Hyundai
    "Accent": "5W-40",
    "Elantra": "5W-30",
    "Sonata": "5W-30",
    "Tucson": "5W-30",
    "Santa Fe": "5W-30",
    "Creta": "5W-30",
    "Palisade": "5W-30",
    "Getz": "10W-40",
    "I30": "5W-30",
    "Starex": "10W-40",

    // Kia
    "K5": "5W-30",
    "K8": "0W-20",
    "Seltos": "5W-30",
    "Sportage": "5W-30",
    "Sorento": "5W-30",
    "Carnival": "5W-30",
    "Rio": "5W-40",
    "Cerato": "5W-30",
    "Picanto": "5W-30",
    "Stinger": "5W-30",
    "Telluride": "5W-30",
    "Sonet": "5W-30",

    // Toyota
    "Corolla": "5W-30",
    "Camry": "5W-30",
    "RAV4": "5W-30",
    "Land Cruiser Prado": "5W-30",
    "Land Cruiser 200": "5W-30",
    "Land Cruiser 300": "0W-20",
    "Highlander": "5W-30",
    "Hilux": "5W-30",
    "Yaris": "5W-30",

    // Lada
    "Vesta": "5W-40",
    "XRay": "5W-40",
    "Granta": "10W-40",
    "Largus": "10W-40",
    "Niva Legend (4x4)": "10W-40",
    "Niva Travel": "10W-40",
    "Priora": "10W-40",
    "Kalina": "10W-40",
    "2107": "10W-40",
    "2106": "15W-40",

    // BYD
    "Song Plus DM-i": "0W-20",
    "Chazor (Destroyer 05)": "0W-20",
    "Han DM-i": "0W-20",
    "Tang DM-i": "0W-20",
    "Qin Plus": "0W-20",

    // Chery
    "Tiggo 7 Pro": "5W-30",
    "Tiggo 8 Pro": "5W-30",
    "Arrizo 6": "5W-30",

    // Jetour
    "X70 Plus": "5W-30",
    "X90 Plus": "5W-30",
    "Dashing": "5W-30",

    // BMW
    "3 Series": "5W-30",
    "5 Series": "5W-30",
    "7 Series": "5W-30",
    "X3": "5W-30",
    "X5": "5W-30",
    "X6": "5W-40",
    "X7": "5W-40",

    // Mercedes
    "C-Class": "5W-40",
    "E-Class": "5W-40",
    "S-Class": "5W-40",
    "G-Class (Gelik)": "5W-40",
    "GLE": "5W-30",
    "GLS": "5W-30"
};

const OilSelector: React.FC<OilSelectorProps> = ({ products, onAddToCart }) => {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const { t } = useLanguage();

    const handleSearch = () => {
        if (!brand || !model) return;

        setLoading(true);
        setResults([]);

        // Simulate analysis delay
        setTimeout(() => {
            const viscosity = RECOMMENDATIONS[model];
            if (viscosity) {
                // Find ALL matches
                let matches = products.filter(p => p.name.includes(viscosity));

                // FALLBACK LOGIC: If 0W-20 is recommended but not found, try 5W-30
                if (matches.length === 0 && viscosity === '0W-20') {
                    matches = products.filter(p => p.name.includes('5W-30'));
                }

                // Sort: Prioritize Premium Brands
                const prioritizedBrands = ['LiQui Moly', 'Shell', 'Castrol', 'Motul', 'ZIC', 'Mobil'];

                matches.sort((a, b) => {
                    const aPrioritized = prioritizedBrands.some(brand => a.name.includes(brand));
                    const bPrioritized = prioritizedBrands.some(brand => b.name.includes(brand));
                    if (aPrioritized && !bPrioritized) return -1;
                    if (!aPrioritized && bPrioritized) return 1;
                    return 0; // Keep original order otherwise
                });

                // If no exact viscosity match found, maybe fallback? 
                // For now, strict match on viscosity string in name.

                setResults(matches);
            }
            setLoading(false);
        }, 1500);
    };

    const selectCls = "field appearance-none cursor-pointer text-lg font-bold px-5 py-4 pr-12 rounded-2xl";
    const step = (on: boolean) => `w-3 h-3 rounded-full transition-all duration-500 ${on ? 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]' : 'bg-slate-300 dark:bg-slate-600'}`;
    const bar = (on: boolean) => (
        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-700 ${on ? 'w-full' : 'w-0'}`}></div>
        </div>
    );

    return (
        <div className="relative z-40 mt-12 mb-20 container mx-auto px-4 reveal">
            <div className="glass glow-border rounded-[32px] transition-colors">
                <span className="glow-halo"></span>
                {/* Decoration */}
                <div className="absolute -top-20 -right-10 w-72 h-72 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative p-5 sm:p-8 md:p-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                        <div>
                            <span className="eyebrow mb-3"><Car size={13} /> {t('os_badge')}</span>
                            <h2 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white mt-3">{t('os_title')}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-2">{t('os_desc')}</p>
                        </div>

                        {/* Steps Indicator */}
                        <div className="hidden md:flex items-center gap-3 glass px-5 py-3 rounded-full">
                            <div className={step(!!brand)}></div>
                            {bar(!!brand)}
                            <div className={step(!!model)}></div>
                            {bar(!!model)}
                            <div className={step(results.length > 0)}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {/* Brand Selector */}
                        <div className="relative group">
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.14em] mb-2 ml-1">{t('os_brand')}</label>
                            <select
                                value={brand}
                                onChange={e => { setBrand(e.target.value); setModel(''); setResults([]); }}
                                className={selectCls}
                            >
                                <option value="">{t('os_select')}</option>
                                {Object.keys(CAR_DATA).map(b => (
                                    <option key={b} value={b}>{b}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-[42px] pointer-events-none text-slate-400 group-hover:text-blue-500 transition">
                                <ChevronRight className="transform rotate-90" />
                            </div>
                        </div>

                        {/* Model Selector */}
                        <div className={`relative group transition-all duration-500 ${!brand ? 'opacity-40 pointer-events-none blur-[1px]' : 'opacity-100'}`}>
                            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-[0.14em] mb-2 ml-1">{t('os_model')}</label>
                            <select
                                value={model}
                                onChange={e => { setModel(e.target.value); setResults([]); }}
                                disabled={!brand}
                                className={selectCls}
                            >
                                <option value="">{t('os_select_brand_first')}</option>
                                {brand && CAR_DATA[brand].models.map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-[42px] pointer-events-none text-slate-400 group-hover:text-blue-500 transition">
                                <ChevronRight className="transform rotate-90" />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-end">
                            <button
                                onClick={handleSearch}
                                disabled={!brand || !model || loading}
                                className="btn-glow w-full h-[62px] rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
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
                    {results.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-dashed border-slate-900/10 dark:border-white/10 animate-slide-up">
                            <div className="flex items-center mb-6">
                                <div className="w-11 h-11 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center text-white mr-4 shadow-[0_0_24px_rgba(52,211,153,0.55)]">
                                    <CheckCircle size={22} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{t('os_found_title')}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">{t('os_success_desc', { car: `${brand} ${model}` })}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {results.map((result, i) => (
                                    <div key={result.id} className="glass spotlight group rounded-3xl p-4 sm:p-5 flex items-center gap-4 transition-all duration-500 hover:-translate-y-1 animate-fade-in-up opacity-0" style={{ animationDelay: `${i * 0.08}s` }}>
                                        <div className="relative w-20 h-20 bg-gradient-to-b from-white to-slate-100 dark:from-slate-200 dark:to-slate-300 rounded-2xl p-2 flex-shrink-0 overflow-hidden flex items-center justify-center">
                                            <span className="product-halo"></span>
                                            <img src={result.image_url} alt={result.name} onError={handleImageError} className="relative w-full h-full object-contain mix-blend-multiply transition duration-500 group-hover:scale-110" />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-[0.12em] mb-1">{result.category}</div>
                                            <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg leading-tight mb-2 tracking-tight">{result.name}</h4>
                                            <div className="flex items-baseline gap-2">
                                                <span className="font-bold text-slate-700 dark:text-slate-200">{(result.price_uzs[0] ?? 0).toLocaleString()}</span>
                                                <span className="text-xs text-slate-500 dark:text-slate-400">{t('os_price_from')}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => onAddToCart(result)}
                                            className="btn-glow p-3 rounded-2xl flex-shrink-0"
                                            aria-label={t('add_to_cart')}
                                        >
                                            <Droplet size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OilSelector;
