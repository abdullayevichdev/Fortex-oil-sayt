import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Eye, Tag } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full border border-gray-100 overflow-hidden relative">
      
      {/* Image Section */}
      <div className="relative h-56 p-6 flex items-center justify-center bg-gray-50 group-hover:bg-blue-50/30 transition duration-500 cursor-pointer" onClick={() => onViewDetails(product)}>
        <img 
          src={product.image_url} 
          alt={product.name} 
          className="max-h-full max-w-full object-contain drop-shadow-sm group-hover:scale-110 transition duration-500"
        />
        
        {/* Tags - Updated Colors */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.tags.includes("Sale") && (
            <span className="bg-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-orange-500/30 flex items-center">
                <Tag size={10} className="mr-1" /> CHEGIRMA
            </span>
            )}
            {product.tags.includes("New") && (
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-600/30">
                YANGI
            </span>
            )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-wider flex items-center">
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            {product.category}
        </div>
        
        <h3 className="font-bold text-slate-800 text-lg mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 transition" onClick={() => onViewDetails(product)}>
            {product.name}
        </h3>
        
        <div className="mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col mb-4">
             <span className="text-xs text-gray-400 font-medium mb-1">Boshlang'ich narx:</span>
             <div className="flex items-baseline">
                <span className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition duration-300">
                {product.price_uzs[0].toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 ml-1 font-medium">UZS</span>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => onViewDetails(product)}
              className="flex items-center justify-center py-2.5 px-3 border border-gray-200 bg-white text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition text-sm font-bold"
            >
              <Eye size={18} className="mr-2" /> Ko'rish
            </button>
            <button 
              onClick={() => onAddToCart(product)}
              className="flex items-center justify-center py-2.5 px-3 bg-fortex-primary text-white rounded-xl hover:bg-blue-700 transition text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <ShoppingCart size={18} className="mr-2" /> Savat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;