import React, { useMemo } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';

const OrderSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;
  const orderId = useMemo(() => `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`, []);

  if (!orderDetails) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-center p-10">
      <div className="flex justify-center mb-6">
        <CheckCircle className="w-20 h-20 text-green-500" />
      </div>
      <h1 className="text-3xl font-black text-amazon-dark mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Thank you for your order. We've received it and will start processing it shortly.
      </p>
      
      <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-100">
        <h2 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Order Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID:</span>
            <span className="font-bold text-gray-900 font-mono">{orderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Product:</span>
            <span className="font-bold text-gray-900">{orderDetails.product.name} ({orderDetails.quantity} {orderDetails.product.unit})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Supplier:</span>
            <span className="font-bold text-gray-900">{orderDetails.dealer.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method:</span>
            <span className="font-bold text-gray-900">{orderDetails.paymentMethod}</span>
          </div>
          {orderDetails.address && (
          <div className="flex justify-between border-t border-gray-100 pt-3 mt-1">
            <span className="text-gray-500">Delivery Address:</span>
            <span className="font-medium text-gray-900 text-right max-w-[60%]">
              {orderDetails.address.fullName}<br/>
              {orderDetails.address.addressLine}<br/>
              {orderDetails.address.city}, {orderDetails.address.pincode}<br/>
              Phone: {orderDetails.address.phone}
            </span>
          </div>
          )}
          <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
            <span className="font-bold text-gray-700">Total Paid:</span>
            <span className="font-black text-xl text-amazon-dark">₹{orderDetails.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate(`/track-order/${orderId}`, { state: { orderDetails } })}
          className="inline-flex items-center justify-center px-8 py-3 bg-white border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-bold rounded-xl transition-all shadow-sm"
        >
          <Package className="w-5 h-5 mr-2" />
          Track Order
        </button>
        <button 
          onClick={() => navigate('/')}
          className="inline-flex items-center justify-center px-8 py-3 bg-amazon-orange hover:bg-[#e68a00] text-amazon-dark font-bold rounded-xl transition-all shadow-sm"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
