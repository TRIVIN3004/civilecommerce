import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
       navigate('/login');
       return;
    }
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    if (savedCart.length === 0) {
       navigate('/cart');
    }
    setCart(savedCart);
  }, [user, navigate]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    setLoading(true);
    setError('');
    
    // Group orders by dealer
    const ordersByDealer = {};
    cart.forEach(item => {
      if (!ordersByDealer[item.dealer._id]) {
         ordersByDealer[item.dealer._id] = {
            dealerId: item.dealer._id,
            totalAmount: 0,
            orderItems: []
         };
      }
      ordersByDealer[item.dealer._id].orderItems.push({
         inventory: item.inventory,
         quantity: item.quantity,
         price: item.price
      });
      ordersByDealer[item.dealer._id].totalAmount += (item.price * item.quantity);
    });

    try {
      // Place request for each dealer
      for (const dealerId in ordersByDealer) {
         await API.post('/orders', ordersByDealer[dealerId]);
      }
      
      // Clear cart
      localStorage.removeItem('cart');
      setCart([]);
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-xl shadow-sm border border-gray-100 text-center">
         <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
         <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h2>
         <p className="text-gray-600 mb-8">Your order has been successfully sent to the dealers. They will process it shortly.</p>
         <button onClick={() => navigate('/dashboard')} className="bg-slate-900 hover:bg-orange-500 text-white font-medium w-full py-3 rounded-lg shadow-md transition">
            Go to Dashboard
         </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>
      
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
         <h3 className="font-bold text-xl mb-6 border-b border-gray-200 pb-4">Confirm Your Details</h3>
         
         <div className="mb-6">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Name</p>
            <p className="text-lg text-gray-900 font-medium">{user?.name}</p>
         </div>
         
         <div className="mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold mb-1">Email</p>
            <p className="text-lg text-gray-900 font-medium">{user?.email}</p>
         </div>

         <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 shadow-sm">
            <h4 className="font-bold text-lg mb-4 text-gray-900 mt-2">Order Total: <span className="text-orange-600 text-3xl ml-2 font-black">₹{totalAmount}</span></h4>
            <p className="text-sm text-gray-600 font-medium">You are checking out {cart.length} items from {new Set(cart.map(i => i.dealer._id)).size} different dealer(s).</p>
         </div>

         <button 
           onClick={placeOrder} 
           disabled={loading}
           className="w-full bg-slate-900 hover:bg-orange-500 disabled:bg-gray-400 text-white font-bold py-4 rounded-lg shadow-md transition text-lg"
         >
           {loading ? 'Processing Order...' : 'Confirm & Place Order'}
         </button>
      </div>
    </div>
  );
};

export default Checkout;
