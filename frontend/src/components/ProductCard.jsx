import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col h-full group">
      <div className="h-56 bg-white flex flex-col justify-center items-center p-4 relative border-b border-gray-50">
        {product.images && product.images[0] ? (
          <img 
             src={product.images[0]} 
             alt={product.name} 
             className="max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" 
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
        <p className="text-gray-500 text-sm line-clamp-2 mb-5 flex-grow">{product.description}</p>
        
        <Link 
          to={`/product/${product._id}`} 
          className="w-full mt-auto block text-center bg-amazon-bg hover:bg-amazon-orange text-amazon-dark hover:text-white font-bold py-2.5 rounded-xl transition-colors border border-gray-300 hover:border-amazon-orange shadow-sm"
        >
          See Available Sellers
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
