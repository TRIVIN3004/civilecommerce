import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ArrowLeft, Clock } from 'lucide-react';

const TrackOrder = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const orderDetails = location.state?.orderDetails;

  const [currentStep, setCurrentStep] = useState(1);

  // Step definitions
  const steps = [
    { id: 1, label: 'Order Placed', icon: CheckCircle, description: 'We have received your order.' },
    { id: 2, label: 'Dealer Accepted', icon: Package, description: 'Dealer is preparing your items.' },
    { id: 3, label: 'Out for Delivery', icon: Truck, description: 'Your order is on the way.' },
    { id: 4, label: 'Delivered', icon: Home, description: 'Order delivered successfully.' }
  ];

  // Simulate tracking progression
  useEffect(() => {
    const t1 = setTimeout(() => setCurrentStep(2), 2000);
    const t2 = setTimeout(() => setCurrentStep(3), 5000);
    const t3 = setTimeout(() => setCurrentStep(4), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Calculate estimated delivery date
  const estDelivery = new Date();
  estDelivery.setDate(estDelivery.getDate() + 2);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amazon-dark to-gray-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => navigate(-1)} className="mr-4 hover:text-amazon-orange transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-black font-poppins flex items-center">
              Track Your Order
            </h1>
          </div>
          <span className="bg-white/10 px-3 py-1 rounded-full text-sm font-bold font-mono">
            {orderId}
          </span>
        </div>

        <div className="p-8">
          {/* Order Snapshot Summary */}
          <div className="flex flex-col md:flex-row gap-6 mb-10 bg-gray-50 rounded-xl p-5 border border-gray-100">
             <div className="flex-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Product Details</span>
                <span className="font-bold text-gray-900 text-lg">
                  {orderDetails?.product?.name || "Premium Material"}
                </span>
                {orderDetails?.quantity && (
                  <span className="text-gray-500 block text-sm font-medium mt-1">
                    Qty: {orderDetails.quantity} {orderDetails?.product?.unit || 'units'}
                  </span>
                )}
             </div>
             <div className="hidden border-l border-gray-200 md:block"></div>
             <div className="flex-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Supplier</span>
                <span className="font-bold text-gray-900 text-lg">
                  {orderDetails?.dealer?.name || "Certified Dealer"}
                </span>
             </div>
             <div className="hidden border-l border-gray-200 md:block"></div>
             <div className="flex-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Est. Delivery</span>
                <div className="flex items-center text-amazon-orange font-bold text-lg">
                  <Clock className="w-5 h-5 mr-1" />
                  {estDelivery.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </div>
             </div>
          </div>

          {/* Progress Timeline */}
          <div className="relative pl-2">
            {/* Background Line */}
            <div className="absolute left-[34px] top-[10%] bottom-[10%] w-[3px] bg-gray-100 rounded-full"></div>
            {/* Active Highlight Line */}
            <div 
              className="absolute left-[34px] top-[10%] w-[3px] bg-amazon-orange rounded-full transition-all duration-700 ease-in-out" 
              style={{ height: `${Math.min(100, ((currentStep - 1) / (steps.length - 1)) * 80)}%` }}
            ></div>

            <div className="space-y-10 relative">
              {steps.map((step, index) => {
                const isCompleted = currentStep >= step.id;
                const isCurrent = currentStep === step.id;
                const Icon = step.icon;

                return (
                  <div key={step.id} className={`flex items-start ${isCompleted ? 'opacity-100' : 'opacity-40 grayscale-[50%]'}`}>
                    <div className={`relative z-10 flex items-center justify-center w-14 h-14 rounded-full border-[3px] bg-white ${
                      isCompleted ? 'border-amazon-orange text-amazon-orange shadow-[0_0_15px_rgba(255,153,0,0.2)]' : 'border-gray-200 text-gray-400'
                    } transition-all duration-500`}>
                      <Icon className={`w-6 h-6 ${isCurrent ? 'animate-bounce' : ''}`} />
                    </div>
                    <div className="ml-6 pt-2">
                       <h3 className={`text-lg font-bold ${isCurrent ? 'text-amazon-orange' : 'text-gray-900'}`}>
                         {step.label}
                       </h3>
                       <p className="text-gray-500 text-sm mt-1">{step.description}</p>
                       {isCurrent && (
                          <div className="mt-2 text-[11px] font-bold text-amazon-dark uppercase tracking-wider bg-orange-100/50 inline-block px-2.5 py-1 rounded-md border border-orange-200">
                            Current Status
                          </div>
                       )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
