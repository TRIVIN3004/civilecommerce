import React from 'react';

const SidebarFilter = ({ filters, setFilters }) => {
  const categories = ["All", "Cement", "Steel", "Bricks", "Sand", "Aggregates"];

  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-28">
      <h3 className="font-bold text-lg mb-4 text-amazon-dark border-b pb-2">Filters</h3>
      
      <div className="mb-6 border-b border-gray-100 pb-6">
        <h4 className="font-semibold text-sm mb-3 text-gray-800">Category</h4>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center text-sm text-gray-600 hover:text-amazon-orange cursor-pointer transition-colors">
              <input 
                 type="radio" 
                 name="category" 
                 value={cat}
                 checked={filters.category === cat || (cat === 'All' && !filters.category)}
                 onChange={(e) => setFilters({ ...filters, category: e.target.value === 'All' ? '' : e.target.value })}
                 className="mr-3 text-amazon-orange focus:ring-amazon-orange h-4 w-4 bg-gray-50 border-gray-300"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6 border-b border-gray-100 pb-6">
        <h4 className="font-semibold text-sm mb-3 flex items-center justify-between text-gray-800">
          Max Distance 
          <span className="text-xs bg-orange-100 text-amazon-orange px-2 py-0.5 rounded-full font-bold">{filters.radius} km</span>
        </h4>
        <input 
          type="range" 
          min="1" 
          max="100" 
          step="1"
          value={filters.radius} 
          onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amazon-orange"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
           <span>1 km</span>
           <span>100 km</span>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3 text-gray-800">Availability</h4>
        <label className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-amazon-orange transition-colors">
           <input 
             type="checkbox" 
             checked={filters.inStockOnly}
             onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
             className="mr-3 rounded text-amazon-orange focus:ring-amazon-orange h-4 w-4 bg-gray-50 border-gray-300 transition-colors"
           />
           <span className="font-medium">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

export default SidebarFilter;
