import React from 'react';
import { ShoppingCart, MapPin, Phone } from 'lucide-react';

const DealerCard = ({ inventory, onAddToCart }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border border-gray-100 p-5 relative overflow-hidden flex flex-col h-full transition-shadow duration-300 group">
      <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg shadow-sm">
        {inventory.quantity} in stock
      </div>
      
      <div className="flex-grow">
          <h3 className="font-bold text-lg text-gray-900 mb-1 pr-16 group-hover:text-amazon-orange transition-colors">
             {inventory.dealer.storeName}
          </h3>
          
          <div className="flex items-start mt-2 mb-1">
             <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-1 flex-shrink-0" />
             <p className="text-sm text-gray-500 line-clamp-2">{inventory.dealer.address}</p>
          </div>
          <div className="flex items-center mb-4">
             <Phone className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
             <p className="text-sm text-gray-500 font-medium">{inventory.dealer.contactPhone}</p>
          </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-end mb-4">
             <div>
                <span className="text-xs text-gray-400 uppercase font-semibold block mb-1">Price</span>
                <span className="text-2xl font-black text-gray-900 border-b-2 border-transparent">₹{inventory.price}</span>
             </div>
             <div className="text-right">
                <span className="text-xs text-[#007185] font-medium hover:text-amazon-orange cursor-pointer block transition-colors">
                   Details
                </span>
                <span className="text-xs font-semibold text-gray-600 flex items-center mt-0.5">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> Ships Today
                </span>
             </div>
          </div>
          
          <button 
            onClick={() => onAddToCart(inventory)}
            className="w-full bg-amazon-orange hover:bg-orange-500 text-amazon-dark active:scale-[0.98] py-2.5 rounded-xl border border-[#FCD200] flex items-center justify-center font-bold shadow-sm transition-all shadow-[#D5D9D9]"
          >
             <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
          </button>
      </div>
    </div>
  );
};

export default DealerCard;
