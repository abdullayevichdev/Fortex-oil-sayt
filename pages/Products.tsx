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

const Products: React.FC<ProductsProps> = ({ products, addToCart }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedLiterForModal, setSelectedLiterForModal] = useState<string>('');
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);
  const { t } = useLanguage();

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

    // Send to Telegram using the shared service
    try {
      await sendReviewToTelegram(newReview, selectedProduct.name);

      // Optimistic update
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
      // We don't need another alert here if the service already alerts, 
      // but let's keep a generic one just in case the error is local
      alert(`Xatolik: ${e.message || "Tizim xatosi"}`);
    } finally {
      setIsReviewSubmitting(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const handleOpenProduct = (product: Product) => {
    setSelectedProduct(product);
    setSelectedLiterForModal(product.liters[0]);
  };

  const getCurrentPrice = () => {
    if (!selectedProduct) return 0;
    const index = selectedProduct.liters.indexOf(selectedLiterForModal);
    return selectedProduct.price_uzs[index];
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      {/* Hero Section - Matching Home Page Style */}
      <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-fortex-dark text-white overflow-hidden">
        {/* Animated Background */}
        {/* Animated Background - Removed */}
        <div className="absolute inset-0 z-0 opacity-40 animate-scale-in" style={{ animationDuration: '20s' }}>
          <div className="w-full h-full bg-gradient-to-tr from-cyan-900 via-slate-900 to-blue-900"></div>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-fortex-dark/50 via-fortex-dark/90 to-slate-50 z-10"></div>

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

        {/* Filters & Search - Glassmorphism Style */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 mb-12 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Category Buttons */}
            <div className="flex items-center w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 space-x-2 no-scrollbar">
              <div className="bg-gray-100 p-2 rounded-full flex items-center">
                <Filter size={20} className="text-fortex-primary mx-2 flex-shrink-0" />
              </div>
              <button
                onClick={() => setSelectedCategory('All')}
                className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === 'All' ? 'bg-fortex-primary text-white shadow-lg shadow-blue-500/40 transform scale-105' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
              >
                {t('prod_all')}
              </button>
              {Object.values(CATEGORIES).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${selectedCategory === cat ? 'bg-fortex-primary text-white shadow-lg shadow-blue-500/40 transform scale-105' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-96 group">
              <input
                type="text"
                placeholder={t('prod_search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-fortex-primary focus:border-transparent transition-all group-hover:bg-white group-hover:shadow-md"
              />
              <Search className="absolute left-4 top-4 text-gray-400 group-hover:text-fortex-primary transition-colors" size={20} />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${0.2 + (index * 0.05)}s` }}>
              <ProductCard
                product={product}
                onAddToCart={() => addToCart(product)}
                onViewDetails={handleOpenProduct}
              />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="bg-white w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg text-gray-300">
              <Search size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">{t('prod_not_found')}</h3>
            <p className="text-gray-500">{t('prod_not_found_desc')}</p>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={t('product_details') || "Mahsulot Tafsilotlari"}
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-center border border-gray-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <img src={selectedProduct.image_url} alt={selectedProduct.name} className="max-h-80 object-contain drop-shadow-lg z-10 transition duration-500 group-hover:scale-110 mix-blend-multiply" />
            </div>
            <div>
              <div className="inline-block px-3 py-1 bg-blue-100 text-fortex-primary rounded-lg text-xs font-bold mb-3 uppercase tracking-wide">{selectedProduct.category}</div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">{selectedProduct.name}</h2>

              <div className="bg-white p-5 rounded-xl mb-6 border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-500 mb-3 font-medium">{t('available_sizes')}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedProduct.liters.map(liter => (
                    <button
                      key={liter}
                      onClick={() => setSelectedLiterForModal(liter)}
                      className={`px-4 py-2 rounded-lg font-bold transition-all ${selectedLiterForModal === liter ? 'bg-fortex-dark text-white shadow-lg transform scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
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
                <p className="text-gray-600 leading-relaxed text-sm">{selectedProduct.description}</p>
              </div>

              {/* Reviews Section */}
              <div className="mb-6 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-between">
                  <span>Mijozlar Fikri ({selectedProduct.reviews?.length || 0})</span>
                  <span className="text-yellow-500 flex items-center text-sm">
                    ⭐ {selectedProduct.rating?.toFixed(1) || '0.0'}
                  </span>
                </h3>

                {/* Review List */}
                <div className="space-y-4 max-h-40 overflow-y-auto pr-2 mb-4 scrollbar-thin">
                  {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                    selectedProduct.reviews.map(review => (
                      <div key={review.id} className="bg-gray-50 p-3 rounded-xl text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="font-bold text-slate-800">{review.userName}</span>
                          <span className="text-yellow-500 text-xs">{'⭐'.repeat(review.rating)}</span>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm italic">Hozircha izohlar yo'q. Birinchi bo'lib fikr bildiring!</p>
                  )}
                </div>
              </div>



              {/* Add Review Form */}
              <form onSubmit={handleReviewSubmit} className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-sm mb-3">Izoh qoldirish</h4>
                <div className="space-y-3">
                  <input
                    required
                    className="w-full text-sm p-2 border rounded-lg outline-none focus:border-fortex-primary"
                    placeholder="Ismingiz"
                    value={reviewForm.name}
                    onChange={e => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Baho:</span>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button type="button" key={star} onClick={() => setReviewForm({ ...reviewForm, rating: star })} className="text-lg focus:outline-none transition hover:scale-110">
                        {star <= reviewForm.rating ? '⭐' : '☆'}
                      </button>
                    ))}
                  </div>
                  <textarea
                    required
                    className="w-full text-sm p-2 border rounded-lg outline-none focus:border-fortex-primary h-20 resize-none"
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