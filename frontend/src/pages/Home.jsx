import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import SidebarFilter from '../components/SidebarFilter';
import { Truck, ShieldCheck, MapPin, TrendingUp } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keywordQuery = searchParams.get('keyword') || '';
  const categoryQuery = searchParams.get('category') || '';

  const [filters, setFilters] = useState({
     category: categoryQuery,
     radius: 20,
     inStockOnly: false
  });

  useEffect(() => {
    setFilters(prev => ({
       ...prev,
       category: categoryQuery || prev.category
    }));
  }, [categoryQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products${keywordQuery ? `?keyword=${keywordQuery}` : ''}`);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keywordQuery]);

  const filteredProducts = products.filter(p => {
     if(filters.category && filters.category !== 'All' && p.category !== filters.category) return false;
     return true;
  });

  return (
    <div className="pb-12 bg-gray-50 max-w-[1600px] mx-auto -mt-4 pt-4">
      
      {/* Hero Section */}
      {!keywordQuery && (
        <div className="relative bg-amazon-dark text-white rounded-2xl mx-4 mb-8 overflow-hidden shadow-2xl flex items-center min-h-[400px]">
           <div className="absolute inset-0 opacity-40 mix-blend-overlay">
              <img src="https://images.unsplash.com/photo-1541888086225-eb4d57c5a082?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Construction background" className="w-full h-full object-cover" />
           </div>
           
           <div className="absolute inset-0 bg-gradient-to-r from-amazon-dark via-amazon-dark/80 to-transparent"></div>

           <div className="relative z-10 p-10 md:p-16 md:w-2/3 lg:w-1/2">
              <span className="inline-block py-1.5 px-4 rounded-full bg-amazon-orange text-amazon-dark font-black text-xs uppercase tracking-widest mb-4 shadow-sm">Fastest Delivery</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight text-white drop-shadow-lg font-poppins tracking-tight">
                Construction Materials <br/>
                <span className="text-amazon-orange text-transparent bg-clip-text bg-gradient-to-r from-amazon-orange to-yellow-400">At Your Doorstep</span>
              </h1>
              <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed font-medium">
                Connect with local dealers for real-time stock, best pricing, and immediate delivery of high-quality civil materials.
              </p>
              <div className="flex gap-4">
                 <button className="bg-amazon-orange hover:bg-orange-500 text-amazon-dark font-black py-3.5 px-8 rounded-full shadow-[0_0_15px_rgba(255,153,0,0.4)] transition-all hover:scale-105 active:scale-95 text-lg">
                   Explore Products
                 </button>
                 <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-bold py-3.5 px-6 rounded-full transition-all flex items-center">
                   <MapPin className="mr-2 h-5 w-5" /> Find Dealers
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row gap-8 px-4">
         
         {/* Sidebar */}
         <div className="w-full md:w-64 lg:w-72 flex-shrink-0 z-10">
            <SidebarFilter filters={filters} setFilters={setFilters} />
         </div>

         {/* Product Grid Area */}
         <div className="flex-1 min-w-0">
            
            {/* Features Bar */}
            {!keywordQuery && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:border-amazon-orange hover:shadow-md transition-all">
                    <div className="bg-orange-50 p-4 rounded-xl text-amazon-orange mr-4 group-hover:scale-110 transition-transform"><Truck className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 text-lg">Local Delivery</h4><p className="text-sm text-gray-500">Fast shipping from nearby</p></div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:border-amazon-orange hover:shadow-md transition-all">
                    <div className="bg-orange-50 p-4 rounded-xl text-amazon-orange mr-4 group-hover:scale-110 transition-transform"><ShieldCheck className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 text-lg">Verified Dealers</h4><p className="text-sm text-gray-500">Quality products assured</p></div>
                 </div>
                 <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center group hover:border-amazon-orange hover:shadow-md transition-all">
                    <div className="bg-orange-50 p-4 rounded-xl text-amazon-orange mr-4 group-hover:scale-110 transition-transform"><TrendingUp className="w-6 h-6" /></div>
                    <div><h4 className="font-bold text-gray-900 text-lg">Best Prices</h4><p className="text-sm text-gray-500">Compare local inventory</p></div>
                 </div>
              </div>
            )}

            {/* "Available Near You" Section */}
            {!keywordQuery && !filters.category && (
               <div className="mb-12">
                  <h2 className="text-3xl font-black text-gray-900 mb-6 flex items-center font-poppins">
                     <span className="bg-amazon-orange text-amazon-dark p-2 rounded-xl mr-3 shadow-md border border-[#FCD200] transform -rotate-6">⚡</span>
                     Available Near You
                     <span className="ml-4 text-xs font-black uppercase tracking-wider text-amazon-dark bg-[#FCD200] px-3 py-1 rounded-full flex items-center shadow-sm">
                        <MapPin className="w-3 h-3 mr-1"/> Detecting your area...
                     </span>
                  </h2>
                  
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                       {[...Array(4)].map((_, i) => (
                           <div key={i} className="animate-pulse bg-white rounded-2xl h-[420px] border border-gray-100 shadow-sm"></div>
                       ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                       {filteredProducts.slice(0, 4).map((product) => (
                          <div key={product._id} className="relative">
                             <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 flex items-center rounded z-10 shadow-md">
                                Hot in your area
                             </div>
                             <ProductCard product={product} />
                          </div>
                       ))}
                    </div>
                  )}
               </div>
            )}

            {/* Regular Grid */}
            <div className="flex items-end justify-between mb-6 pb-2 border-b border-gray-200">
               <h2 className="text-3xl font-black text-gray-900 font-poppins leading-none">
                  {keywordQuery ? `Search Results for "${keywordQuery}"` : filters.category ? `${filters.category} Products` : 'All Materials'}
               </h2>
               <span className="text-sm font-bold text-gray-500">{filteredProducts.length} results</span>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                 {[...Array(8)].map((_, i) => (
                     <div key={i} className="animate-pulse bg-white rounded-2xl h-[420px] border border-gray-100 shadow-sm"></div>
                 ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="text-2xl font-black text-gray-800 mb-3 font-poppins">No products found</h3>
                 <p className="text-gray-500 font-medium">Try adjusting your filters or search query.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Home;
