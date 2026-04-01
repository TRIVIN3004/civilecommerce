import React from 'react';
import { MapPin, Phone, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DealerCard = ({ dealer, productId }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(255,153,0,0.15)] hover:border-amazon-orange transition-all duration-300 flex flex-col mb-3 last:mb-0 group/dealer">
      <div className="flex justify-between items-start mb-2">
        <div className="min-w-0 pr-2">
          <h4 className="font-bold text-gray-900 text-sm leading-tight truncate group-hover/dealer:text-amazon-orange transition-colors" title={dealer.name}>
            {dealer.name}
          </h4>
          <p className="text-[11px] text-gray-500 flex items-center mt-1 truncate" title={dealer.location}>
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0 text-gray-400" />
            <span className="truncate">{dealer.location} ({dealer.distance} km)</span>
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="font-black text-amazon-dark text-sm block">₹{dealer.price}</span>
          <span className={`inline-block mt-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${dealer.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
            {dealer.stock > 0 ? `${dealer.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 mt-1 pt-2 border-t border-gray-50">
        <button 
          className="flex-1 bg-amazon-orange hover:bg-[#e68a00] text-amazon-dark font-bold text-xs py-2 rounded-md transition-all shadow-sm active:scale-95 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            if (productId) {
               navigate(`/order/${productId}/${dealer.id}`);
            } else {
               console.log(`Ordering from ${dealer.name}`);
            }
          }}
        >
          <ShoppingCart className="w-3.5 h-3.5 mr-1.5" /> Order
        </button>
        <button 
          className="flex-1 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-bold text-xs py-2 rounded-md transition-all active:scale-95 flex items-center justify-center"
          onClick={(e) => {
            e.preventDefault();
            console.log(`Contacting ${dealer.name}`);
          }}
        >
          <Phone className="w-3.5 h-3.5 mr-1.5 text-gray-500" /> Contact
        </button>
      </div>
    </div>
  );
};

export default DealerCard;
