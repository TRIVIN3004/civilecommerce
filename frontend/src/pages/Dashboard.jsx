import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { io } from 'socket.io-client';
import { Package, ListOrdered, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New inventory form state
  const [newInvProductId, setNewInvProductId] = useState('');
  const [newInvPrice, setNewInvPrice] = useState('');
  const [newInvQuantity, setNewInvQuantity] = useState('');

  useEffect(() => {
    let socket;
    
    const fetchData = async () => {
      try {
        if (user.role === 'customer') {
          const { data } = await API.get('/orders/myorders');
          setOrders(data);
        } else if (user.role === 'dealer') {
          const [orderRes, invRes, prodRes] = await Promise.all([
             API.get('/orders/dealer'),
             API.get('/inventory/my'),
             API.get('/products') 
          ]);
          setOrders(orderRes.data.reverse()); // Show newest first
          setInventory(invRes.data);
          setProducts(prodRes.data);
          
          // Setup WebSocket for Dealer
          if (user.dealerId) {
             socket = io(import.meta.env.VITE_API_URL.replace('/api', ''));
             socket.on(`new_order_${user.dealerId}`, (newOrder) => {
                setOrders(prev => [newOrder, ...prev]);
                // Basic browser notification if permitted
                if (Notification.permission === 'granted') {
                   new Notification('New Order Received!', { body: `Order for ₹${newOrder.totalAmount}` });
                }
             });
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      if (Notification.permission === 'default') {
          Notification.requestPermission();
      }
      fetchData();
    }

    return () => {
       if (socket) socket.disconnect();
    };
  }, [user]);

  const updateOrderStatus = async (orderId, status) => {
     try {
        await API.put(`/orders/${orderId}/status`, { status });
        setOrders(orders.map(o => o._id === orderId ? { ...o, status } : o));
     } catch (error) {
        console.error('Failed to update status', error);
     }
  };

  const addInventory = async (e) => {
     e.preventDefault();
     try {
        await API.post('/inventory', {
           productId: newInvProductId,
           price: Number(newInvPrice),
           quantity: Number(newInvQuantity)
        });
        
        // Refresh inventory
        const invRes = await API.get('/inventory/my');
        setInventory(invRes.data);
        
        // Reset form
        setNewInvProductId('');
        setNewInvPrice('');
        setNewInvQuantity('');
     } catch(error) {
        alert(error.response?.data?.message || 'Error updating inventory');
     }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

  if (user?.role === 'customer') {
    return (
      <div className="max-w-4xl mx-auto py-8">
         <h1 className="text-3xl font-bold mb-8 text-gray-900 border-b border-gray-200 pb-4">My Orders</h1>
         {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
               <ListOrdered className="w-16 h-16 text-gray-300 mx-auto mb-4" />
               <p className="text-xl font-medium text-gray-500 mb-2">You haven't placed any orders yet.</p>
               <p className="text-gray-400">Find nearby dealers and place an order.</p>
            </div>
         ) : (
            <div className="space-y-6">
               {orders.map(order => (
                  <div key={order._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                     <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                        <div>
                           <p className="text-sm text-gray-500 font-medium">Order ID <span className="font-mono text-gray-900 bg-gray-50 px-2 py-0.5 rounded ml-1">{order._id}</span></p>
                           <p className="text-sm text-gray-500 mt-1">Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                           <span className={`px-3 py-1 rounded-full text-[10px] tracking-wider font-bold uppercase ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              order.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                           }`}>
                              {order.status}
                           </span>
                           <p className="font-black text-xl mt-2 block text-gray-900">₹{order.totalAmount}</p>
                        </div>
                     </div>
                     <div>
                        <h4 className="font-semibold text-sm mb-3 text-gray-700 uppercase tracking-wide">Items Purchased</h4>
                        <ul className="space-y-2 text-sm text-gray-600">
                           {order.items.map((item, idx) => (
                              <li key={idx} className="flex justify-between bg-gray-50 p-2 rounded border border-gray-100">
                                 <span className="font-medium">Qty: {item.quantity}</span>
                                 <span className="font-bold text-gray-900">₹{item.price * item.quantity}</span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
    );
  }

  if (user?.role === 'dealer') {
    return (
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Dealer Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Inventory Management */}
           <div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-24">
                 <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-200 pb-3">
                    <Package className="mr-2 text-orange-500" /> Manage Inventory
                 </h2>
                 <form onSubmit={addInventory} className="space-y-4 mb-8 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
                    <div>
                       <label className="block text-sm font-semibold mb-1 text-gray-700">Select Product</label>
                       <select required className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white" value={newInvProductId} onChange={e => setNewInvProductId(e.target.value)}>
                          <option value="">-- Choose Product defined by System --</option>
                          {products.map(p => (
                             <option key={p._id} value={p._id}>{p.name} - {p.category}</option>
                          ))}
                       </select>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex-1">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Price (₹)</label>
                          <input type="number" required min="1" placeholder="e.g. 500" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" value={newInvPrice} onChange={e => setNewInvPrice(e.target.value)} />
                       </div>
                       <div className="flex-1">
                          <label className="block text-sm font-semibold mb-1 text-gray-700">Stock Quantity</label>
                          <input type="number" required min="0" placeholder="e.g. 100" className="w-full p-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500" value={newInvQuantity} onChange={e => setNewInvQuantity(e.target.value)} />
                       </div>
                    </div>
                    <button type="submit" className="w-full mt-2 bg-slate-900 hover:bg-orange-600 text-white font-bold py-3 rounded-lg shadow-sm transition">
                       Update / Add to Stock
                    </button>
                 </form>

                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                    <h3 className="font-bold text-gray-800 mb-3 sticky top-0 bg-white py-2">Current Active Stock</h3>
                    {inventory.length === 0 ? <p className="text-sm text-gray-500 italic">No inventory added yet. Start by adding stock.</p> : null}
                    {inventory.map(inv => (
                       <div key={inv._id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:bg-orange-50 transition">
                          <div>
                             <p className="font-bold text-gray-900 line-clamp-1">{inv.product?.name || 'Unknown Product'}</p>
                             <p className="text-sm text-gray-500 font-medium">₹{inv.price}</p>
                          </div>
                          <div className="text-right">
                             <span className={`px-2 py-1 flex items-center justify-center rounded text-[11px] font-black uppercase ${inv.quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                Stock: {inv.quantity}
                             </span>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Orders Management */}
           <div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                 <h2 className="text-xl font-bold mb-6 flex items-center text-gray-900 border-b border-gray-200 pb-3">
                    <ListOrdered className="mr-2 text-orange-500" /> Incoming Orders
                 </h2>
                 
                 {orders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-xl bg-gray-50">
                       <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                       <p className="text-gray-500 font-medium">No orders received yet.</p>
                       <p className="text-sm text-gray-400">When customers place orders, they will appear here instantly.</p>
                    </div>
                 ) : (
                    <div className="space-y-4">
                       {orders.map(order => (
                          <div key={order._id} className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition">
                             <div className="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                                <div>
                                   <p className="font-bold text-gray-900">{order.customer?.name}</p>
                                   <p className="text-xs text-gray-500 font-medium">{order.customer?.email}</p>
                                </div>
                                <span className={`px-2.5 py-1 rounded text-[10px] tracking-wide font-black uppercase ${
                                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    order.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                 }`}>
                                    {order.status}
                                 </span>
                             </div>
                             
                             <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                                <p className="font-black text-2xl text-orange-600 mb-1">₹{order.totalAmount}</p>
                                <p className="text-xs text-gray-600 font-semibold uppercase">{order.items.length} items ordered</p>
                             </div>

                             {order.status === 'pending' && (
                                <div className="flex gap-3 mt-4">
                                   <button onClick={() => updateOrderStatus(order._id, 'accepted')} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center shadow-sm">
                                      <CheckCircle className="w-5 h-5 mr-1.5" /> Accept Order
                                   </button>
                                   <button onClick={() => updateOrderStatus(order._id, 'rejected')} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center shadow-sm">
                                      <XCircle className="w-5 h-5 mr-1.5" /> Reject
                                   </button>
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    );
  }

  return <div className="p-10 text-center">Admin dashboard omitted for brevity but API is ready.</div>;
};

export default Dashboard;
