import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import { handleImageError } from '../utils/image';
import { useLanguage } from '../contexts/LanguageContext';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  const { t } = useLanguage();
  return (
    <div className="glass spotlight group rounded-[28px] flex flex-col h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(37,99,235,0.45)]">

      {/* Image Section */}
      <div className="relative m-2 h-56 rounded-[22px] p-6 flex items-center justify-center cursor-pointer overflow-hidden bg-gradient-to-b from-white to-slate-100 dark:from-slate-200 dark:to-slate-300" onClick={() => onViewDetails(product)}>
        <span className="product-halo"></span>
        <img
          src={product.image_url}
          alt={product.name}
          onError={handleImageError}
          loading="lazy"
          className="relative max-h-full max-w-full object-contain drop-shadow-[0_18px_20px_rgba(15,23,42,0.25)] transition duration-700 ease-out group-hover:scale-110 group-hover:-rotate-3 mix-blend-multiply"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.tags.includes("Sale") && (
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_16px_rgba(249,115,22,0.6)] flex items-center">
              <Tag size={10} className="mr-1" /> {t('sale')}
            </span>
          )}
          {product.tags.includes("New") && (
            <span className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-[0_0_16px_rgba(59,130,246,0.6)]">
              {t('new')}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-5 pb-5 pt-3 flex flex-col flex-grow">
        <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-[0.14em] flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 shadow-[0_0_8px_rgba(59,130,246,0.9)]"></span>
          {product.category}
        </div>

        <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-3 line-clamp-2 leading-tight tracking-tight cursor-pointer" onClick={() => onViewDetails(product)}>
          {product.name}
        </h3>

        <div className="mt-auto pt-4 border-t border-slate-900/5 dark:border-white/10">
          <div className="flex items-end justify-between mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 font-medium mb-1">{t('price_start')}</span>
              <div className="flex items-baseline">
                <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white transition duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {(product.price_uzs[0] ?? 0).toLocaleString()}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-1 font-medium">UZS</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onViewDetails(product)}
              className="btn-glass flex items-center justify-center py-2.5 px-3 rounded-2xl text-slate-700 dark:text-white text-sm font-bold"
            >
              <Eye size={17} className="mr-2" /> {t('view')}
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="btn-glow flex items-center justify-center py-2.5 px-3 rounded-2xl text-sm font-bold"
            >
              <ShoppingCart size={17} className="mr-2" /> {t('add_to_cart_short')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;