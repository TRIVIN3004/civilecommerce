import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { getDealersForProduct } from '../data/dealers';
import { ArrowLeft, ShoppingBag } from 'lucide-react';

const OrderPage = () => {
  const { productId, dealerId } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [dealer, setDealer] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find product using local static data
    const foundProduct = products.find(p => String(p.id) === String(productId));
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Find dealer associated with this product
      const dealers = getDealersForProduct(foundProduct.id);
      const foundDealer = dealers.find(d => String(d.id) === String(dealerId));
      if (foundDealer) {
        setDealer(foundDealer);
      }
    }
  }, [productId, dealerId]);

  if (!product || !dealer) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amazon-orange border-t-transparent"></div>
      </div>
    );
  }

  const handleConfirmOrder = () => {
    alert(`Order Confirmed!\n${quantity}x ${product.name} from ${dealer.name}\nTotal: ₹${(dealer.price * quantity).toLocaleString()}`);
    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mt-8">
      <div className="bg-gradient-to-r from-amazon-dark to-gray-900 p-6 text-white flex items-center">
        <button onClick={() => navigate(-1)} className="mr-4 hover:text-amazon-orange transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-black font-poppins flex items-center">
          <ShoppingBag className="w-6 h-6 mr-3 text-amazon-orange" />
          Complete Your Order
        </h1>
      </div>
      
      <div className="p-8">
        <div className="flex flex-col md:flex-row gap-6 mb-8 border-b border-gray-100 pb-8">
           {product.image && (
             <div className="w-full md:w-1/3 bg-gray-50 rounded-xl p-4 flex items-center justify-center">
               <img 
                 src={product.image} 
                 alt={product.name} 
                 onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/e2e8f0/475569?text=Product+Image' }}
                 className="max-h-32 object-contain mix-blend-multiply" 
               />
             </div>
           )}
           <div className="flex-1">
             <h2 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h2>
             <p className="text-sm text-gray-500 mb-4">{product.description || `High-quality ${product.category.toLowerCase()} material.`}</p>
             
             <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <h3 className="text-xs uppercase tracking-wider font-bold text-gray-500 mb-1">Supplied By</h3>
                <p className="font-bold text-amazon-dark">{dealer.name}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="font-bold">₹{dealer.price.toLocaleString()} <span className="font-medium text-gray-500">/ {product.unit}</span></span>
                  <span className="text-gray-400">|</span>
                  <span className={dealer.stock > 0 ? "text-green-600 font-bold" : "text-red-500 font-bold"}>{dealer.stock} Available</span>
                </div>
             </div>
           </div>
        </div>
        
        <div className="mb-8">
          <label className="block text-sm font-bold text-gray-700 mb-3">Select Quantity</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
               <button 
                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
                 className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
               >-</button>
               <input 
                 type="number" 
                 value={quantity}
                 onChange={(e) => setQuantity(Math.max(1, Math.min(dealer.stock, parseInt(e.target.value) || 1)))}
                 className="w-16 text-center py-3 font-bold text-gray-900 focus:outline-none"
                 min="1"
                 max={dealer.stock}
               />
               <button 
                 onClick={() => setQuantity(Math.min(dealer.stock, quantity + 1))}
                 className="px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold transition-colors"
               >+</button>
            </div>
            <span className="text-gray-500 text-sm font-medium">x {product.unit}</span>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-xl p-5 mb-8 flex justify-between items-center border border-gray-100">
           <span className="text-gray-600 font-bold">Total Amount</span>
           <span className="text-3xl font-black text-amazon-dark">₹{(dealer.price * quantity).toLocaleString()}</span>
        </div>
        
        <button 
          onClick={handleConfirmOrder}
          disabled={dealer.stock === 0}
          className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-md flex items-center justify-center ${dealer.stock > 0 ? 'bg-amazon-orange hover:bg-[#e68a00] text-amazon-dark hover:shadow-lg active:scale-[0.98]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {dealer.stock > 0 ? 'Confirm Order' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default OrderPage;
