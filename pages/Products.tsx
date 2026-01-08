import React, { useState, useMemo } from 'react';
import { Product, CATEGORIES } from '../types';
import ProductCard from '../components/ProductCard';
import Modal from '../components/Modal';
import { Search, Filter, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { sendReviewToTelegram } from '../services/telegram';

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
      alert("Izohingiz uchun rahmat!");
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

  return (
    <div className="bg-slate-50 min-h-screen pb-12 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-fortex-dark text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 animate-scale-in" style={{ animationDuration: '20s' }}>
          <div className="w-full h-full bg-gradient-to-tr from-cyan-900 via-slate-900 to-blue-900"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-fortex-dark/50 via-fortex-dark/90 to-slate-50 dark:to-slate-900 z-10 transition-colors duration-300"></div>

        <div className="container mx-auto px-4 relative z-20 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 backdrop-blur-sm text-blue-300 text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in-up">
            <Layers size={14} />
            <span>{t('prod_badge')}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {t('prod_title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t('prod_title_accent')}</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('prod_desc')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-16 relative z-30">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters (Desktop) & Mobile Toggle */}
          <div className={`lg:w-1/4 space-y-6 ${isFilterOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-800 p-6 overflow-y-auto' : 'hidden lg:block'}`}>
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h3 className="text-xl font-bold dark:text-white">{t('filters_title')}</h3>
              <button onClick={() => setIsFilterOpen(false)}><span className="text-2xl">&times;</span></button>
            </div>

            {/* Filter Group: Search */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 dark:border-white/5">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Search size={18} className="mr-2" /> {t('filters_search')}</h3>
              <input
                type="text"
                placeholder={t('prod_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-fortex-primary dark:text-white transition-all"
              />
            </div>

            {/* Filter Group: Category */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 dark:border-white/5">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center"><Filter size={18} className="mr-2" /> {t('filters_categories')}</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === 'All' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                >
                  {t('prod_all')}
                </button>
                {Object.values(CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${selectedCategory === cat ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-700'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter Group: Brands */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 dark:border-white/5">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">{t('filters_brands')}</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
                {allBrands.map(brand => (
                  <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedBrands.includes(brand) ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white dark:bg-slate-700 dark:border-gray-600'}`}>
                      {selectedBrands.includes(brand) && <span className="text-white text-xs">✓</span>}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedBrands.includes(brand)} onChange={() => toggleBrand(brand)} />
                    <span className="text-sm text-gray-600 group-hover:text-blue-600 dark:text-gray-400 dark:group-hover:text-blue-400 transition">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Viscosity */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 dark:border-white/5">
              <h3 className="font-bold text-slate-800 dark:text-white mb-4">{t('filters_viscosity')}</h3>
              <div className="flex flex-wrap gap-2">
                {allViscosities.map(viscosity => (
                  <button
                    key={viscosity}
                    onClick={() => toggleViscosity(viscosity)}
                    className={`px-3 py-1 rounded-full text-xs font-bold border transition ${selectedViscosities.includes(viscosity) ? 'bg-blue-600 text-white border-blue-600' : 'bg-transparent text-gray-600 border-gray-200 hover:border-blue-400 dark:text-gray-400 dark:border-gray-600'}`}
                  >
                    {viscosity}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle & Sort */}
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 font-bold text-sm flex items-center text-slate-700 dark:text-white"
              >
                <Filter size={16} className="mr-2" /> {t('filters_title')}
              </button>

              <div className="flex items-center space-x-2 ml-auto">
                <span className="text-sm text-gray-500 font-medium hidden sm:inline">{t('filters_sort')}</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-fortex-primary"
                >
                  <option value="default">{t('filters_sort_default')}</option>
                  <option value="price-asc">{t('filters_sort_price_asc')}</option>
                  <option value="price-desc">{t('filters_sort_price_desc')}</option>
                  <option value="name-asc">{t('filters_sort_name_asc')}</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 + (index * 0.05)}s` }}>
                  <ProductCard
                    product={product}
                    onAddToCart={() => addToCart(product)}
                    onViewDetails={handleOpenProduct}
                  />
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-slate-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{t('prod_not_found')}</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">{t('prod_not_found_desc')}</p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setSelectedBrands([]);
                    setSelectedViscosities([]);
                  }}
                  className="mt-6 text-blue-600 font-bold hover:underline"
                >
                  Filtrlarni tozalash
                </button>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={t('product_details') || "Mahsulot Tafsilotlari"}
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Image */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-200 dark:to-slate-300 p-8 rounded-3xl flex items-center justify-center relative overflow-hidden group border border-gray-100 dark:border-gray-500/50">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-700"></div>
              {/* Decorative Circle */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>

              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="max-h-96 object-contain drop-shadow-2xl z-10 transition duration-500 group-hover:scale-105 group-hover:-rotate-2 mix-blend-multiply"
              />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-fortex-primary dark:text-blue-400 rounded-lg text-xs font-bold mb-3 uppercase tracking-wide">{selectedProduct.category}</div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">{selectedProduct.name}</h2>

              <div className="bg-white dark:bg-slate-800 p-5 rounded-xl mb-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 font-medium">{t('available_sizes')}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProduct.liters.map(liter => (
                    <button
                      key={liter}
                      onClick={() => setSelectedLiterForModal(liter)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${selectedLiterForModal === liter ? 'bg-fortex-dark text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600'}`}
                    >
                      {liter}
                    </button>
                  ))}
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-black text-fortex-primary">
                    {getCurrentPrice().toLocaleString()}
                  </span>
                  <span className="text-lg text-gray-400 font-medium">UZS</span>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">{selectedProduct.description}</p>
              </div>

              {/* Reviews Section */}
              <div className="mb-6 border-t border-gray-100 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                  <span>Mijozlar Fikri ({selectedProduct.reviews?.length || 0})</span>
                  <span className="text-yellow-500 flex items-center text-sm">
                    ⭐ {selectedProduct.rating?.toFixed(1) || '0.0'}
                  </span>
                </h3>

                {/* Review List */}
                <div className="space-y-4 max-h-40 overflow-y-auto pr-2 mb-4 scrollbar-thin">
                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map(review => (
                      <div key={review.id} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-xl text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-800 dark:text-white">{review.userName}</span>
                          <span className="text-yellow-500 text-xs">{'⭐'.repeat(review.rating)}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">Hozircha izohlar yo'q. Birinchi bo'lib fikr bildiring!</p>
                  )}
                </div>
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="mb-6 bg-gray-50 dark:bg-slate-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                <h4 className="font-bold text-sm mb-3 dark:text-white">Izoh qoldirish</h4>
                <div className="space-y-3">
                  <input
                    required
                    className="w-full text-sm p-2 border rounded-lg outline-none focus:border-fortex-primary dark:bg-slate-600 dark:border-gray-500 dark:text-white"
                    placeholder="Ismingiz"
                    value={reviewForm.name}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Baho:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="text-lg focus:outline-none transition hover:scale-110">
                        {star <= reviewForm.rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    className="w-full text-sm p-2 border rounded-lg outline-none focus:border-fortex-primary h-20 resize-none dark:bg-slate-600 dark:border-gray-500 dark:text-white"
                    placeholder="Fikringiz..."
                    value={reviewForm.comment}
                    onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  />
                  <button type="submit" disabled={isReviewSubmitting} className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition">
                    {isReviewSubmitting ? 'Yuborilmoqda...' : 'Yuborish'}
                  </button>
                </div>
              </form>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    addToCart(selectedProduct, selectedLiterForModal);
                    setSelectedProduct(null);
                  }}
                  className="w-full bg-fortex-primary text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-500/30 flex items-center justify-center transform hover:-translate-y-1"
                >
                  {t('add_to_cart')}
                </button>
              </div>
            </div>
          </div >
        )}
      </Modal >
    </div >
  );
};

export default Products;