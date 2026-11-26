import React, { useState, useMemo } from 'react';
import { Product, CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import { Search, Filter, Layers, Check, ChevronDown, SlidersHorizontal, X, Star, ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendReviewToTelegram } from '../services/telegram';
import { handleImageError } from '../utils/image';

interface ProductsProps {
  products: Product[];
  addToCart: (product: Product, liter?: string) => void;
}


// Helper function to extract brand from product name
const getBrand = (name: string): string => {
  const n = name.toLowerCase();

  // Custom mappings
  if (n.includes('fortex')) return 'Fortex';
  if (n.includes('shell')) return 'SHELL';
  if (n.includes('castrol')) return 'CASTROL';
  if (n.includes('lukoil')) return 'Lukoil';
  if (n.includes('liqui')) return 'LiQui';
  if (n.includes('venol')) return 'Venol';
  if (n.includes('zic')) return 'ZIC';
  if (n.includes('mannol')) return 'Mannol';
  if (n.includes('mobil')) return 'Mobil';
  if (n.includes('total')) return 'Total';
  if (n.includes('elf')) return 'Elf';
  if (n.includes('kixx')) return 'Kixx';
  if (n.includes('motul')) return 'Motul';
  if (n.includes('g-energy')) return 'G-Energy';
  if (n.includes('felix')) return 'Felix';
  if (n.includes('enoc')) return 'Enoc';
  if (n.includes('fosser')) return 'Fosser';

  // Default: First word
  return name.split(' ')[0];
};

const Products: React.FC<ProductsProps> = ({ products, addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedLiterForModal, setSelectedLiterForModal] = useState<string>('');
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  // New Filter States
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedViscosities, setSelectedViscosities] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { t } = useLanguage();

  // Extract unique brands and viscosities
  const allBrands = useMemo(() => {
    const brands = new Set<string>();
    products.forEach(p => {
      // Use helper function for robust brand extraction
      const brand = getBrand(p.name);
      if (brand) brands.add(brand);
    });
    return Array.from(brands).sort();
  }, [products]);

  const allViscosities = useMemo(() => {
    const viscosities = new Set<string>();
    const regex = /\d+W-\d+/i;
    products.forEach(p => {
      const match = p.name.match(regex);
      if (match) viscosities.add(match[0].toUpperCase());
    });
    return Array.from(viscosities).sort();
  }, [products]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setIsReviewSubmitting(true);

    const newReview = {
      id: `rev_${Date.now()}`,
      userId: 'guest',
      userName: reviewForm.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
      date: new Date().toISOString()
    };

    try {
      await sendReviewToTelegram(newReview, selectedProduct.name);

      const updatedProduct = {
        ...selectedProduct,
        reviews: [newReview, ...(selectedProduct.reviews || [])],
        rating: ((selectedProduct.rating || 5) * (selectedProduct.reviews?.length || 0) + reviewForm.rating) / ((selectedProduct.reviews?.length || 0) + 1)
      };
      setSelectedProduct(updatedProduct);
      alert(t('review_thanks'));
      setReviewForm({ name: '', rating: 5, comment: '' });
    } catch (e: any) {
      console.error(e);
      alert(`Xatolik: ${e.message || "Tizim xatosi"}`);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Category
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;

      // Search
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Brand
      const productBrand = getBrand(product.name);
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(productBrand);

      // Viscosity
      const viscosityMatch = product.name.match(/\d+W-\d+/i);
      const productViscosity = viscosityMatch ? viscosityMatch[0].toUpperCase() : null;
      const matchesViscosity = selectedViscosities.length === 0 || (productViscosity && selectedViscosities.includes(productViscosity));

      return matchesCategory && matchesSearch && matchesBrand && matchesViscosity;
    });

    // Sorting
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price_uzs[0] - b.price_uzs[0]);
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price_uzs[0] - a.price_uzs[0]);
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [products, selectedCategory, searchQuery, selectedBrands, selectedViscosities, sortOption]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleViscosity = (viscosity: string) => {
    setSelectedViscosities(prev =>
      prev.includes(viscosity) ? prev.filter(v => v !== viscosity) : [...prev, viscosity]
    );
  };

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedLiterForModal(product.liters[0]);
  };

  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    const index = selectedProduct.liters.indexOf(selectedLiterForModal);

    // Agar aniq narx ko'rsatilgan bo'lsa, o'shani qaytarish
    if (selectedProduct.price_uzs[index] && selectedProduct.price_uzs[index] > 0) {
      return selectedProduct.price_uzs[index];
    }

    // Agar narx yo'q bo'lsa, 1-litr narxiga qarab hisoblash (Avtomatik)
    const basePrice = selectedProduct.price_uzs[0];
    const baseLiterStr = selectedProduct.liters[0];

    // Faqat raqam qismini ajratib olish (1L -> 1, 4L -> 4)
    const parseVolume = (str: string) => {
      const match = str.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[0]) : 0;
    };

    const baseVol = parseVolume(baseLiterStr);
    const targetVol = parseVolume(selectedLiterForModal);

    if (basePrice > 0 && baseVol > 0 && targetVol > 0) {
      // Proportsional hisoblash (masalan: 1L = 100 so'm -> 4L = 400 so'm)
      return Math.round((basePrice / baseVol) * targetVol);
    }

    return 0;
  };

  const panel = "glass p-6 rounded-[26px]";
  const panelTitle = "font-bold text-slate-900 dark:text-white mb-4 flex items-center tracking-tight";
  const activeFilters = selectedBrands.length + selectedViscosities.length + (selectedCategory !== 'All' ? 1 : 0) + (searchQuery ? 1 : 0);

  const filters = (
    <>
      {/* Filter Group: Search */}
      <div className={panel}>
        <h3 className={panelTitle}><Search size={17} className="mr-2 text-blue-500" /> {t('filters_search')}</h3>
        <div className="relative">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder={t('prod_search_placeholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="field pl-11 pr-4 py-3"
          />
        </div>
      </div>

      {/* Filter Group: Category */}
      <div className={panel}>
        <h3 className={panelTitle}><Filter size={17} className="mr-2 text-blue-500" /> {t('filters_categories')}</h3>
        <div className="space-y-1">
          {['All', ...Object.values(CATEGORIES)].map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${active
                  ? 'text-white bg-gradient-to-r from-blue-500 to-indigo-500 shadow-[0_6px_20px_-4px_rgba(59,130,246,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-white/5 hover:translate-x-1'}`}
              >
                {cat === 'All' ? t('prod_all') : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Group: Brands */}
      <div className={panel}>
        <h3 className={panelTitle}>{t('filters_brands')}</h3>
        <div className="space-y-1 max-h-52 overflow-y-auto scrollbar-thin pr-1">
          {allBrands.map(brand => {
            const on = selectedBrands.includes(brand);
            return (
              <label key={brand} className="flex items-center gap-3 cursor-pointer group px-2 py-1.5 rounded-lg hover:bg-white/40 dark:hover:bg-white/5 transition">
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-300 ${on ? 'bg-gradient-to-br from-blue-500 to-indigo-600 border-transparent shadow-[0_0_12px_rgba(59,130,246,0.6)] scale-110' : 'border-slate-300 dark:border-slate-600 bg-white/60 dark:bg-white/5'}`}>
                  {on && <Check size={13} className="text-white" strokeWidth={3} />}
                </div>
                <input type="checkbox" className="hidden" checked={on} onChange={() => toggleBrand(brand)} />
                <span className={`text-sm transition ${on ? 'text-slate-900 dark:text-white font-semibold' : 'text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'}`}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Filter Group: Viscosity */}
      <div className={panel}>
        <h3 className={panelTitle}>{t('filters_viscosity')}</h3>
        <div className="flex flex-wrap gap-2">
          {allViscosities.map(viscosity => {
            const on = selectedViscosities.includes(viscosity);
            return (
              <button
                key={viscosity}
                onClick={() => toggleViscosity(viscosity)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-300 ${on
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-transparent shadow-[0_0_16px_rgba(59,130,246,0.55)]'
                  : 'bg-white/40 dark:bg-white/5 text-slate-600 border-slate-900/10 hover:border-blue-400 dark:text-slate-400 dark:border-white/10'}`}
              >
                {viscosity}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen pb-12 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-36 pb-28 lg:pt-44 lg:pb-36 text-white overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/40 blur-[120px] animate-float"></div>
          <div className="absolute top-10 right-0 w-[500px] h-[500px] rounded-full bg-cyan-500/25 blur-[120px] animate-float" style={{ animationDelay: '-3s' }}></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-violet-600/25 blur-[120px]"></div>
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '56px 56px', maskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)', WebkitMaskImage: 'radial-gradient(ellipse at center, #000 30%, transparent 75%)' }}></div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--bg)] to-transparent z-10"></div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="glass-dark inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-blue-200 text-xs font-bold uppercase tracking-[0.16em] mb-6 animate-fade-in-up">
            <Layers size={14} />
            <span>{t('prod_badge')}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.05] animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
            {t('prod_title')} <span className="text-shimmer">{t('prod_title_accent')}</span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '0.2s' }}>
            {t('prod_desc')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-14 relative z-30">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:w-1/4 space-y-5 animate-fade-in-up opacity-0" style={{ animationDelay: '0.25s' }}>
            {filters}
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Toggle & Sort */}
            <div className="glass flex flex-wrap justify-between items-center mb-6 gap-3 p-2 pl-3 rounded-full">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden px-4 py-2 rounded-full font-bold text-sm flex items-center text-slate-700 dark:text-white hover:bg-white/50 dark:hover:bg-white/10 transition"
              >
                <SlidersHorizontal size={16} className="mr-2" /> {t('filters_title')}
                {activeFilters > 0 && <span className="ml-2 h-5 min-w-5 px-1.5 rounded-full bg-blue-500 text-white text-[10px] flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.7)]">{activeFilters}</span>}
              </button>
              <span className="hidden lg:inline text-sm font-semibold text-slate-500 dark:text-slate-400 pl-2">
                <span className="text-slate-900 dark:text-white font-black">{filteredProducts.length}</span> / {products.length}
              </span>

              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">{t('filters_sort')}</span>
                <div className="relative">
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="field appearance-none rounded-full pl-4 pr-9 py-2 text-sm font-bold cursor-pointer"
                  >
                    <option value="default">{t('filters_sort_default')}</option>
                    <option value="price-asc">{t('filters_sort_price_asc')}</option>
                    <option value="price-desc">{t('filters_sort_price_desc')}</option>
                    <option value="name-asc">{t('filters_sort_name_asc')}</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="reveal" style={{ ['--d' as any]: `${(index % 3) * 0.07}s` }}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onViewDetails={handleOpenProduct}
                  />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="glass text-center py-20 px-6 rounded-[32px] animate-scale-in">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 bg-blue-500/10 border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.25)]">
                  <Search size={32} className="text-blue-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{t('prod_not_found')}</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">{t('prod_not_found_desc')}</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setSelectedBrands([]);
                    setSelectedViscosities([]);
                  }}
                  className="btn-glass mt-6 px-6 py-3 rounded-full text-blue-600 dark:text-blue-400 font-bold"
                >
                  {t('filters_clear')}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Mobile filters sheet */}
      {isFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-slate-950/50 animate-fade-in" style={{ WebkitBackdropFilter: 'blur(10px)', backdropFilter: 'blur(10px)' }} onClick={() => setIsFilterOpen(false)}></div>
          <div className="relative max-h-[88vh] overflow-y-auto rounded-t-[32px] p-4 pb-8 space-y-4 bg-white/80 dark:bg-slate-950/80 border-t border-white/20 shadow-[0_-20px_60px_-10px_rgba(0,0,0,0.5)] animate-slide-up" style={{ WebkitBackdropFilter: 'blur(30px) saturate(180%)', backdropFilter: 'blur(30px) saturate(180%)' }}>
            <div className="mx-auto w-12 h-1.5 rounded-full bg-slate-400/40 mb-2"></div>
            <div className="flex justify-between items-center px-2">
              <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">{t('filters_title')}</h3>
              <button onClick={() => setIsFilterOpen(false)} className="btn-glass p-2 rounded-full" aria-label="Yopish"><X size={20} className="text-slate-600 dark:text-slate-300" /></button>
            </div>
            {filters}
            <button onClick={() => setIsFilterOpen(false)} className="btn-glow w-full py-4 rounded-2xl font-bold">
              {filteredProducts.length} ✓
            </button>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={t('product_details') || "Mahsulot Tafsilotlari"}
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="relative bg-gradient-to-b from-white to-slate-100 dark:from-slate-200 dark:to-slate-300 p-8 rounded-[28px] flex items-center justify-center overflow-hidden group min-h-[280px] md:sticky md:top-24 md:self-start">
              <span className="product-halo" style={{ opacity: 0.9 }}></span>
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                onError={handleImageError}
                className="relative max-h-96 object-contain drop-shadow-[0_30px_30px_rgba(15,23,42,0.3)] transition duration-700 group-hover:scale-105 group-hover:-rotate-2 mix-blend-multiply animate-float"
              />
            </div>
            <div>
              <span className="eyebrow mb-3">{selectedProduct.category}</span>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-3 mb-5 leading-tight">{selectedProduct.name}</h2>

              <div className="glass p-5 rounded-2xl mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">{t('available_sizes')}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProduct.liters.map(liter => (
                    <button
                      key={liter}
                      onClick={() => setSelectedLiterForModal(liter)}
                      className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${selectedLiterForModal === liter
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_0_20px_rgba(59,130,246,0.55),inset_0_1px_0_rgba(255,255,255,0.35)] scale-105'
                        : 'bg-white/50 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:border-blue-400'}`}
                    >
                      {liter}
                    </button>
                  ))}
                </div>
                <div className="flex items-baseline gap-2">
                  <span key={selectedLiterForModal} className="text-4xl font-black tracking-tight text-shimmer animate-scale-in">
                    {getCurrentPrice().toLocaleString()}
                  </span>
                  <span className="text-lg text-slate-400 font-medium">UZS</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{selectedProduct.description}</p>
              </div>

              {/* Reviews Section */}
              <div className="mb-5 border-t border-slate-900/5 dark:border-white/10 pt-6">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-between">
                  <span>{t('reviews_title')} ({selectedProduct.reviews?.length || 0})</span>
                  <span className="flex items-center gap-1 text-sm font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    <Star size={14} className="fill-amber-400 text-amber-400" /> {selectedProduct.rating?.toFixed(1) || '0.0'}
                  </span>
                </h3>

                {/* Review List */}
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 mb-4 scrollbar-thin">
                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map(review => (
                      <div key={review.id} className="glass p-3 rounded-2xl text-sm animate-fade-in-up">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-900 dark:text-white">{review.userName}</span>
                          <span className="flex">{Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={12} className="fill-amber-400 text-amber-400" />)}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm italic">{t('reviews_empty')}</p>
                  )}
                </div>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="glass mb-6 p-4 rounded-2xl">
                <h4 className="font-bold text-sm mb-3 text-slate-900 dark:text-white">{t('reviews_leave')}</h4>
                <div className="space-y-3">
                  <input
                    required
                    className="field text-sm px-3 py-2.5"
                    placeholder={t('reviews_name')}
                    value={reviewForm.name}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-slate-500 dark:text-slate-400 mr-1">{t('reviews_rating')}</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="p-0.5 focus:outline-none transition-transform duration-200 hover:scale-125" aria-label={`${star}`}>
                        <Star size={20} className={star <= reviewForm.rating ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.7)]' : 'text-slate-300 dark:text-slate-600'} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    className="field text-sm px-3 py-2.5 h-20 resize-none"
                    placeholder={t('reviews_comment')}
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  />
                  <button type="submit" disabled={isReviewSubmitting} className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
                    {isReviewSubmitting ? t('reviews_submitting') : t('reviews_submit')}
                  </button>
                </div>
              </form>

              <button
                onClick={() => {
                  addToCart(selectedProduct, selectedLiterForModal);
                  setSelectedProduct(null);
                }}
                className="btn-glow w-full py-4 rounded-2xl font-bold flex items-center justify-center"
              >
                <ShoppingCart size={19} className="mr-2" /> {t('add_to_cart')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Products;