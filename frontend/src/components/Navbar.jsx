import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, MapPin, Search, ChevronDown, User, LogOut, Truck } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Cart total items
  const cartItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if(searchQuery.trim()) {
       navigate(`/?keyword=${searchQuery}`);
    }
  };

  return (
    <nav className="bg-amazon-dark text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Top Navbar Row */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 pt-1 border border-transparent hover:border-white p-2 rounded transition-colors">
            <span className="text-2xl font-bold font-poppins text-white tracking-tight">
              Site<span className="text-amazon-orange">Mate</span>
            </span>
          </Link>

          {/* Location / Deliver to (Hidden on tiny screens) */}
          <Link to="/map" className="hidden lg:flex items-center flex-shrink-0 border border-transparent hover:border-white p-2 rounded transition-colors">
            <MapPin className="h-5 w-5 text-gray-300 mt-2" />
            <div className="ml-1 flex flex-col">
               <span className="text-[11px] text-gray-300 leading-3">Deliver to</span>
               <span className="text-sm font-bold leading-4">Your Location</span>
            </div>
          </Link>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 h-10 rounded-md overflow-hidden bg-white group focus-within:ring-2 focus-within:ring-amazon-orange shadow-sm ml-2 mr-4">
             <select className="bg-gray-100 text-gray-700 text-sm px-3 border-r border-gray-300 outline-none hover:bg-gray-200 cursor-pointer w-auto hidden lg:block">
                <option>All</option>
                <option>Cement</option>
                <option>Steel</option>
                <option>Bricks</option>
                <option>Sand</option>
             </select>
             <input 
               type="text" 
               placeholder="Search construction materials..."
               className="flex-1 px-4 text-gray-900 outline-none placeholder-gray-500 font-medium"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <button type="submit" className="bg-amazon-orange hover:bg-orange-500 text-amazon-dark px-5 flex items-center justify-center transition-colors">
               <Search className="h-5 w-5" />
             </button>
          </form>

          {/* Right Navigation */}
          <div className="flex items-center gap-2 flex-shrink-0">
             
             {/* Auth/Account */}
             <div className="border border-transparent hover:border-white p-2 rounded relative group cursor-pointer transition-colors">
                {user ? (
                   <Link to="/dashboard" className="flex flex-col">
                      <span className="text-[11px] text-gray-300 leading-3">Hello, {user.name.split(' ')[0]}</span>
                      <span className="text-sm font-bold leading-4 flex items-center">Account & Orders <ChevronDown className="h-4 w-4 ml-0.5 text-gray-400" /></span>
                   </Link>
                ) : (
                   <Link to="/login" className="flex flex-col">
                      <span className="text-[11px] text-gray-300 leading-3">Hello, sign in</span>
                      <span className="text-sm font-bold leading-4 flex items-center">Account & Lists <ChevronDown className="h-4 w-4 ml-0.5 text-gray-400" /></span>
                   </Link>
                )}

                {/* Dropdown Menu */}
                {user && (
                   <div className="absolute right-0 top-11 w-56 bg-white text-gray-900 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-3 border border-gray-200 origin-top mt-1">
                      <Link to="/dashboard" className="flex items-center px-3 py-2.5 hover:bg-gray-100 rounded-md font-medium text-sm transition-colors">
                        <User className="h-4 w-4 mr-3 text-gray-500" /> Dashboard & Orders
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center w-full text-left px-3 py-2.5 hover:bg-gray-100 rounded-md font-medium text-sm text-red-600 transition-colors">
                        <LogOut className="h-4 w-4 mr-3" /> Sign Out
                      </button>
                   </div>
                )}
             </div>

             {/* Track Order */}
             <Link to="/track-order/DEMO-ID" className="hidden lg:flex items-center gap-1.5 border border-transparent hover:border-white p-2 rounded transition-colors">
                <Truck className="h-6 w-6 text-white" />
                <div className="flex flex-col">
                   <span className="text-[11px] text-gray-300 leading-3">Track</span>
                   <span className="text-sm font-bold leading-4">Order</span>
                </div>
             </Link>

             {/* Returns & Orders */}
             <Link to="/orders" className="hidden lg:flex flex-col border border-transparent hover:border-white p-2 rounded transition-colors">
                <span className="text-[11px] text-gray-300 leading-3">Returns</span>
                <span className="text-sm font-bold leading-4">& Orders</span>
             </Link>

             {/* Cart */}
             <Link to="/cart" className="flex items-end border border-transparent hover:border-white p-2 rounded relative transition-colors">
                <div className="relative">
                   <ShoppingCart className="h-8 w-8 text-white relative z-10" />
                   <span className="absolute -top-1 left-3.5 bg-amazon-orange text-amazon-dark font-black text-xs rounded-full h-[22px] w-[22px] flex items-center justify-center z-20 shadow-sm border border-amazon-dark">
                     {cartItemsCount}
                   </span>
                </div>
                <span className="text-sm font-bold ml-0.5 hidden lg:block pb-1">Cart</span>
             </Link>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch} className="flex flex-1 h-11 rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amazon-orange shadow-sm">
             <input 
               type="text" 
               placeholder="Search materials..."
               className="flex-1 px-4 text-gray-900 outline-none placeholder-gray-500 font-medium text-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
             <button type="submit" className="bg-amazon-orange hover:bg-orange-500 text-amazon-dark px-5 flex items-center justify-center transition-colors">
               <Search className="h-5 w-5" />
             </button>
          </form>
        </div>
      </div>
      
      {/* Sub Navigation */}
      <div className="bg-amazon-light px-4 lg:px-6 h-10 flex items-center text-sm font-medium gap-5 overflow-x-auto whitespace-nowrap shadow-inner border-t border-gray-700 pointer-events-auto">
         <Link to="/map" className="flex items-center hover:border border-transparent hover:border-gray-400 px-1 py-1 rounded transition-colors">
           <MapPin className="h-4 w-4 mr-1" /> All Dealers
         </Link>
         <Link to="/?category=Cement" className="hover:border border-transparent hover:border-gray-400 px-1 py-1 rounded transition-colors">Cement</Link>
         <Link to="/?category=Steel" className="hover:border border-transparent hover:border-gray-400 px-1 py-1 rounded transition-colors">Iron & Steel</Link>
         <Link to="/?category=Bricks" className="hover:border border-transparent hover:border-gray-400 px-1 py-1 rounded transition-colors">Bricks & Blocks</Link>
         <Link to="/?category=Sand" className="hover:border border-transparent hover:border-gray-400 px-1 py-1 rounded transition-colors">Sand & Aggregates</Link>
      </div>
    </nav>
  );
};

export default Navbar;
