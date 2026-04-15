import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Package } from 'lucide-react';
import { dealers } from '../data/dealers';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Center of Coimbatore
const defaultCenter = [11.0168, 76.9558]; 

const MapPage = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -mx-4 -mb-8">
      <div className="bg-white p-4 shadow-sm z-10 flex gap-3 items-center relative border-b border-gray-200">
        <div className="bg-orange-100 p-2 rounded-full">
           <MapPin className="text-amazon-orange w-5 h-5" />
        </div>
        <h2 className="text-xl font-bold font-poppins text-amazon-dark">Authorized Dealers in Coimbatore</h2>
      </div>
      
      <div className="flex-1 relative z-0">
         <MapContainer center={defaultCenter} zoom={12} className="w-full h-full z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {dealers.map(dealer => (
            <Marker key={dealer.id} position={[dealer.latitude, dealer.longitude]}>
              <Popup className="custom-popup">
                 <div className="min-w-[200px]">
                   <h3 className="font-extrabold text-lg text-gray-900 border-b border-gray-200 mb-1 pb-1">
                     {dealer.name}
                   </h3>
                   <div className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                     <MapPin className="w-3 h-3 mr-1" />
                     {dealer.location}
                   </div>
                   
                   <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 shadow-inner">
                     <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center">
                       <Package className="w-3 h-3 mr-1" />
                       Inventory Stock Info
                     </div>
                     <div className="space-y-1.5">
                       {dealer.products.map((p, i) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                            <span className="text-gray-600">Variant {i+1}</span>
                            <span className="font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded text-xs">{p.stock} units</span>
                          </div>
                       ))}
                     </div>
                   </div>
                 </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
