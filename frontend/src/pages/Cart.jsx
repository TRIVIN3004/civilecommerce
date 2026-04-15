import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cartItems: cart, updateQuantity, removeFromCart: removeItem } = useContext(CartContext);
  const navigate = useNavigate();

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto py-8 lg:px-6">
      
      {cart.length === 0 ? (
        <div className="bg-white p-12 lg:p-20 rounded-2xl shadow-sm border border-gray-200 text-center max-w-3xl mx-auto mt-10">
           <div className="w-48 h-48 mx-auto mb-8 bg-gray-50 rounded-full flex items-center justify-center border-4 border-gray-100 shadow-inner">
              <ShoppingBag className="w-24 h-24 text-gray-300" />
           </div>
           <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-6 font-poppins tracking-tight">Your ConstructMart Cart is empty</h2>
           <p className="text-lg text-gray-600 mb-10 max-w-lg mx-auto font-medium">Shop today's deals and discover the perfect materials for your next construction project.</p>
           <Link to="/" className="inline-block bg-[#FCD200] hover:bg-[#f2c200] text-amazon-dark border border-[#FCD200] font-black px-10 py-4 rounded-xl shadow-md transition-all active:scale-[0.98] text-lg">
             Sign in to your account
           </Link>
           <div className="mt-8">
              <Link to="/register" className="text-[#007185] hover:text-amazon-orange hover:underline font-bold">Sign up now</Link>
           </div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          <div className="lg:w-3/4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            <div className="border-b border-gray-200 pb-4 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
               <h1 className="text-3xl md:text-4xl font-poppins font-black text-gray-900 tracking-tight">Shopping Cart</h1>
               <span className="text-sm text-gray-500 font-bold hidden sm:block">Price</span>
            </div>

            <div className="space-y-8">
              {cart.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-full sm:w-48 h-48 bg-white rounded-xl flex items-center justify-center p-4 relative group cursor-pointer border border-transparent hover:border-gray-200 transition shadow-[inset_0_0_15px_rgba(0,0,0,0.03)] focus-within:ring-2">
                     {item.product.images && item.product.images[0] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="max-h-full mix-blend-multiply group-hover:scale-105 transition duration-500" />
                     ) : (
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">No Image</span>
                     )}
                  </div>
                  
                  <div className="flex-grow flex flex-col">
                     <div>
                        <div className="flex justify-between items-start gap-4">
                           <h3 className="font-bold text-xl text-gray-900 line-clamp-2 hover:text-[#007185] cursor-pointer leading-snug mb-2 font-poppins">
                             {item.product.name}
                           </h3>
                           <div className="text-right sm:hidden block mb-2">
                              <span className="text-xl font-black text-gray-900">₹{item.price}</span>
                           </div>
                        </div>
                        <p className="text-[#007600] text-sm font-bold mb-1">In Stock</p>
                        <p className="text-sm text-gray-600 mb-2 font-medium">Sold by: <span className="text-[#007185] cursor-pointer hover:underline">{item.dealer.storeName}</span></p>
                        <label className="text-sm text-gray-700 font-medium flex items-center mb-6 cursor-pointer hover:text-amazon-orange transition w-max">
                          <input type="checkbox" className="mr-2 accent-amazon-orange rounded w-4 h-4" /> This will be a gift
                        </label>
                     </div>

                     <div className="flex items-center gap-6 mt-auto">
                        <div className="flex items-center bg-[#F0F2F2] border border-[#D5D9D9] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
                           <button 
                             className="px-4 py-2 hover:bg-[#E3E6E6] text-gray-800 transition font-black border-r border-[#D5D9D9] text-lg active:bg-gray-300"
                             onClick={() => updateQuantity(index, item.quantity - 1)}>-</button>
                           <span className="px-6 py-2 font-black bg-white text-amazon-dark">{item.quantity}</span>
                           <button 
                             className="px-4 py-2 hover:bg-[#E3E6E6] text-gray-800 transition font-black border-l border-[#D5D9D9] text-lg active:bg-gray-300"
                             onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                        </div>
                        
                        <div className="h-6 w-[2px] bg-gray-200"></div>

                        <button 
                          onClick={() => removeItem(index)}
                          className="text-[#007185] hover:text-[#C40000] hover:underline transition text-sm font-bold flex items-center group"
                        >
                          <Trash2 className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform" /> Delete
                        </button>
                     </div>
                  </div>

                  <div className="text-right sm:w-32 flex-shrink-0 hidden sm:block">
                     <span className="text-2xl font-black text-gray-900">₹{item.price}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-8 pt-6 text-right">
                <span className="text-xl text-gray-900 font-medium whitespace-nowrap">Subtotal ({cart.length} items): <span className="font-black text-3xl ml-2 tracking-tight">₹{totalAmount}</span></span>
            </div>
          </div>
          
          {/* Checkout Sidebar */}
          <div className="lg:w-1/4 w-full">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 block sticky top-28">
                <div className="flex items-start text-xs text-[#007600] mb-5 font-bold leading-tight">
                  <ShieldCheck className="w-5 h-5 mr-1.5 flex-shrink-0" />
                  <span>Your order qualifies for FREE Delivery. Choose this option at checkout.</span>
                </div>

                <div className="text-xl text-gray-900 mb-6 font-medium leading-tight">
                  Subtotal ({cart.length} items): <span className="font-black block text-2xl mt-1 tracking-tight">₹{totalAmount}</span>
                </div>
                
                <label className="mb-6 flex items-center text-sm font-medium cursor-pointer hover:text-amazon-orange">
                   <input type="checkbox" className="mr-3 accent-amazon-orange rounded w-4 h-4" />
                   This order contains a gift
                </label>

                <button 
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-[#FCD200] hover:bg-[#f2c200] text-amazon-dark font-black py-3.5 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.15)] border border-[#FCD200] transition active:scale-[0.97] mb-5 text-lg"
                >
                  Proceed to Checkout
                </button>

                <div className="text-xs text-center text-gray-500 font-medium">
                   Secure transaction powered by ConstructMart
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
