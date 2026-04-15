import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { MapPin, ChevronRight, Tag, Info } from 'lucide-react';
import DealerCard from '../components/DealerCard';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [dealers, setDealers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductAndDealers = async () => {
      try {
        const prodRes = await API.get(`/products/${id}`);
        setProduct(prodRes.data);

        // Try getting location for dealers
        if (navigator.geolocation) {
           navigator.geolocation.getCurrentPosition(
             async (pos) => {
               const { latitude, longitude } = pos.coords;
               const dealRes = await API.get(`/dealers/product/${id}/nearby?lat=${latitude}&lng=${longitude}&radius=50`);
               setDealers(dealRes.data);
               setLoading(false);
             },
             async () => {
               // default fallback
               const dealRes = await API.get(`/dealers/product/${id}/nearby?lat=21.1458&lng=79.0882&radius=1000`);
               setDealers(dealRes.data);
               setLoading(false);
             }
           );
        } else {
             const dealRes = await API.get(`/dealers/product/${id}/nearby?lat=21.1458&lng=79.0882&radius=1000`);
             setDealers(dealRes.data);
             setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchProductAndDealers();
  }, [id]);

  const handleAddToCart = (inventory) => {
    if (!user) {
       navigate('/login');
       return;
    }
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIdx = cart.findIndex(item => item.inventory === inventory._id);
    if(itemIdx > -1) {
       cart[itemIdx].quantity += 1;
    } else {
       cart.push({
         inventory: inventory._id,
         product: product,
         dealer: inventory.dealer,
         price: inventory.price,
         quantity: 1,
         maxQuantity: inventory.quantity
       });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    navigate('/cart');
  };

  if (loading) return (
     <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-amazon-orange"></div>
     </div>
  );
  if (!product) return <div className="p-10 text-center text-xl font-bold">Product Not Found</div>;

  return (
    <div className="max-w-[1400px] mx-auto pb-12">
       
       {/* Breadcrumbs */}
       <div className="text-xs text-gray-500 mb-6 flex items-center font-medium bg-white p-3 rounded-lg shadow-sm border border-gray-100">
          <span className="hover:underline hover:text-amazon-orange cursor-pointer">Home</span> <ChevronRight className="w-3 h-3 mx-1" />
          <span className="hover:underline hover:text-amazon-orange cursor-pointer">Products</span> <ChevronRight className="w-3 h-3 mx-1" />
          <span className="hover:underline hover:text-amazon-orange cursor-pointer">{product.category}</span> <ChevronRight className="w-3 h-3 mx-1" />
          <span className="text-gray-900 font-bold">{product.name}</span>
       </div>

       <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-12 flex flex-col md:flex-row gap-12 mb-12 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl -z-0 -mr-20 -mt-20 opacity-60"></div>

          <div className="md:w-5/12 bg-white rounded-2xl flex items-center justify-center p-8 border border-gray-200 shadow-[inset_0_0_20px_rgba(0,0,0,0.02)] group relative z-10">
             <div className="absolute top-4 left-4 bg-[#CC0C39] text-white text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md shadow-md flex items-center">
                 <Tag className="w-3 h-3 mr-1" /> Best Seller
             </div>
             {product.images && product.images[0] ? (
                 <img src={product.images[0]} alt={product.name} className="max-h-96 w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500 drop-shadow-xl" />
             ) : (
                 <span className="text-gray-400 font-bold text-lg">No Image</span>
             )}
          </div>
          
          <div className="md:w-7/12 flex flex-col justify-center z-10">
             <span className="text-[#007185] font-bold tracking-wider uppercase text-sm mb-2 block hover:underline cursor-pointer">Category: {product.category}</span>
             <h1 className="text-3xl lg:text-4xl font-poppins font-black text-gray-900 mb-4 leading-tight tracking-tight">{product.name}</h1>
             
             <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center text-amazon-orange text-lg">
                   {'★★★★'.split('').map((s,i)=><span key={i}>{s}</span>)}
                   <span className="text-gray-300">★</span> 
                   <span className="text-[#007185] text-sm ml-3 hover:underline cursor-pointer font-medium mt-1">2,140 ratings | 100+ answered questions</span>
                </div>
             </div>

             <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-xl border border-gray-200 mb-6 relative shadow-sm">
                 <Info className="absolute top-4 right-4 text-amazon-dark w-5 h-5 opacity-20" />
                 <h4 className="font-bold text-gray-900 mb-3 text-lg">About this item</h4>
                 <ul className="text-gray-700 leading-relaxed text-sm space-y-2 list-disc pl-5 font-medium">
                    <li>{product.description}</li>
                    <li>Premium construction quality standard.</li>
                    <li>Sourced directly from authorized distributors.</li>
                 </ul>
             </div>
             
             <div className="mt-auto pt-4 flex gap-4">
                <div className="flex-1 bg-[#F0F2F2] rounded-xl p-4 border border-[#D5D9D9] text-center">
                   <p className="font-bold text-amazon-dark">Secure Transaction</p>
                   <p className="text-xs text-gray-500 mt-1">SSL Encrypted</p>
                </div>
                <div className="flex-1 bg-[#F0F2F2] rounded-xl p-4 border border-[#D5D9D9] text-center">
                   <p className="font-bold text-amazon-dark">SiteMate Assured</p>
                   <p className="text-xs text-gray-500 mt-1">Quality Guaranteed</p>
                </div>
             </div>
          </div>
       </div>

       <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-3">
          <h2 className="text-2xl lg:text-3xl font-black text-gray-900 flex items-center font-poppins">
            <span className="bg-[#131921] p-2.5 rounded-xl mr-4 shadow-md"><MapPin className="text-amazon-orange w-6 h-6" /></span>
             Dealers with Stock Near You
          </h2>
          <span className="text-sm font-bold text-[#007185] hover:text-amazon-orange underline cursor-pointer transition-colors">Change Location</span>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dealers.length === 0 ? (
             <div className="col-span-full py-20 text-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-600">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200 shadow-inner">
                   <MapPin className="text-gray-400 w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-gray-900 mb-3 font-poppins">No local stock found</h3>
                <p className="font-medium text-gray-500">No nearby dealers have this product in stock right now. Try expanding your search location radius.</p>
             </div>
          ) : (
             dealers.map(inv => (
                <DealerCard key={inv._id} inventory={inv} onAddToCart={handleAddToCart} />
             ))
          )}
       </div>
    </div>
  );
};

export default ProductDetail;
