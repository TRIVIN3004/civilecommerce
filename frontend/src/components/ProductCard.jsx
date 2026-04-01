import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getDealersForProduct } from '../data/dealers';
import DealerCard from './DealerCard';

const ProductCard = ({ product }) => {
  const [showDealers, setShowDealers] = useState(false);
  const availableDealers = getDealersForProduct(product.id || product._id);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col h-full group">
      <div className="h-48 w-full bg-white flex items-center justify-center p-4 relative overflow-hidden">
        {product.image || (product.images && product.images[0]) ? (
          <img 
             src={product.image || product.images[0]} 
             alt={product.name} 
             onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=Product+Image' }}
             className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <span className="text-gray-400 font-medium">No Image</span>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <span className="text-xs font-semibold text-amazon-orange uppercase tracking-wider mb-1 block">
           {product.category}
        </span>
        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2 mb-2 group-hover:text-amazon-orange transition-colors">
           {product.name}
        </h3>
        
        {product.price && (
           <div className="flex items-center justify-between mt-auto mb-3">
              <span className="text-xl font-black text-gray-900">₹{product.price} <span className="text-xs text-gray-500 font-medium">/ {product.unit || 'unit'}</span></span>
              <span className={`text-xs font-bold px-2 py-1 rounded-md ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                 {product.stock > 0 ? `${product.stock} In Stock` : 'Out of Stock'}
              </span>
           </div>
        )}
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 flex-grow">{product.description || ""}</p>
        
        {showDealers && (
          <div className="mb-4 text-sm bg-gray-50/50 rounded-xl border border-gray-200 p-3 max-h-64 overflow-y-auto w-full custom-scrollbar">
            <h4 className="font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2 text-xs uppercase tracking-wider">Available Dealers</h4>
            {availableDealers.length > 0 ? availableDealers.map(dealer => (
              <DealerCard key={dealer.id} dealer={dealer} productId={product.id || product._id} />
            )) : <p className="text-xs text-red-500 italic p-2 bg-red-50 rounded">No dealers stock this right now.</p>}
          </div>
        )}

        <button 
          onClick={() => setShowDealers(!showDealers)}
          className="w-full mt-auto block text-center bg-amazon-bg hover:bg-amazon-orange text-amazon-dark hover:text-white font-bold py-2.5 rounded-xl transition-colors border border-gray-300 hover:border-amazon-orange shadow-sm"
        >
          {showDealers ? 'Hide Dealers' : 'Find Dealers'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
