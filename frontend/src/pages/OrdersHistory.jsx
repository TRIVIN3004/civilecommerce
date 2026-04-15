import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    setOrders(savedOrders.reverse()); // newest first
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4">
      <h1 className="text-3xl font-black font-poppins text-amazon-dark mb-8 border-b border-gray-200 pb-4">
        Your Order History
      </h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
           <Package className="w-20 h-20 text-gray-200 mx-auto mb-4" />
           <h2 className="text-2xl font-bold text-gray-700 mb-2">No orders placed yet</h2>
           <p className="text-gray-500 mb-6 font-medium">When you place an order, it will securely appear here.</p>
           <Link to="/" className="bg-amazon-orange hover:bg-orange-500 text-amazon-dark font-bold py-3 px-8 rounded-xl shadow-sm transition">
             Start Shopping
           </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const orderId = `ORD-${(order.date ? new Date(order.date).getTime() : Date.now() + index).toString().slice(-8).toUpperCase()}`; 

            return (
              <div key={index} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="bg-gray-50 border-b border-gray-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-x-12 gap-y-4">
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Order Placed</span>
                      <span className="font-medium text-gray-900 text-sm">
                        {order.date ? new Date(order.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'}) : 'Recently'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Total</span>
                      <span className="font-black text-amazon-dark text-sm">₹{order.total?.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Payment Method</span>
                      <span className="font-medium text-gray-900 text-sm">{order.paymentMethod}</span>
                    </div>
                  </div>
                  <div className="md:text-right">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Order #</span>
                    <span className="font-mono text-amazon-dark bg-orange-100/50 border border-orange-200 px-2 py-0.5 rounded text-sm font-bold tracking-wider">{orderId}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between flex-col md:flex-row gap-6">
                    <div className="flex gap-5">
                      <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center p-2 shrink-0">
                        {order.product?.image || (order.product?.images && order.product?.images[0]) ? (
                          <img src={order.product.image || order.product.images[0]} className="max-h-full object-contain mix-blend-multiply hover:scale-105 transition-transform" />
                        ) : (
                          <Package className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                      <div className="pt-1">
                        <Link to={`/product/${order.product?.id || order.product?._id}`} className="font-bold text-lg text-gray-900 mb-1 leading-snug hover:text-amazon-orange transition-colors flex items-center group">
                            {order.product?.name} <ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <p className="text-sm text-gray-500 mb-3">Sold by: <span className="text-[#007185] font-medium hover:underline cursor-pointer">{order.dealer?.name}</span></p>
                        <div className="inline-block bg-gray-100 border border-gray-200 px-3 py-1 rounded-lg text-xs font-bold text-gray-700">
                          Qty: {order.quantity}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 md:pl-6 md:border-l border-gray-100">
                      <button 
                         onClick={() => navigate(`/track-order/${orderId}`, { state: { orderDetails: order } })}
                         className="w-full flex items-center justify-center border-[2px] border-amazon-orange text-amazon-dark hover:bg-orange-50 font-black py-2.5 px-6 rounded-xl transition"
                      >
                         <Truck className="w-4 h-4 mr-2" /> Track Package
                      </button>
                    </div>
                  </div>

                  {order.address && (
                    <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-2 bg-gray-50 p-4 rounded-xl">
                       <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                       <div className="text-sm text-gray-600">
                         <span className="font-bold text-gray-800">{order.address.fullName}</span> — {order.address.addressLine}, {order.address.city}, {order.address.pincode}
                       </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrdersHistory;
