import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API from '../api/axios';
import { MapPin } from 'lucide-react';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const defaultCenter = [20.5937, 78.9629]; // Center of India

const MapPage = () => {
  const [dealers, setDealers] = useState([]);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [loading, setLoading] = useState(true);
  const [radius, setRadius] = useState(20);

  useEffect(() => {
    // Attempt to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          fetchDealers(position.coords.latitude, position.coords.longitude, radius);
        },
        (error) => {
          console.error("Error getting location", error);
          fetchDealers(defaultCenter[0], defaultCenter[1], radius);
        }
      );
    } else {
      fetchDealers(defaultCenter[0], defaultCenter[1], radius);
    }
  }, [radius]);

  const fetchDealers = async (lat, lng, rad) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/dealers/nearby?lat=${lat}&lng=${lng}&radius=${rad}`);
      setDealers(data);
    } catch (error) {
      console.error('Failed to fetch dealers', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] -mx-4 -mb-8">
      <div className="bg-white p-4 shadow-sm z-10 flex gap-4 items-center relative">
        <MapPin className="text-orange-500" />
        <h2 className="text-lg font-bold">Nearby Dealers</h2>
        <div className="ml-auto flex items-center gap-2">
           <label className="text-sm font-medium">Search Radius (km):</label>
           <select className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 rounded-md shadow-sm" value={radius} onChange={e => setRadius(e.target.value)}>
              <option value="5">5 km</option>
              <option value="10">10 km</option>
              <option value="20">20 km</option>
              <option value="50">50 km</option>
           </select>
        </div>
      </div>
      
      <div className="flex-1 relative z-0">
         <MapContainer center={userLocation} zoom={11} className="w-full h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <Marker position={userLocation}>
             <Popup>You are here</Popup>
          </Marker>

          {dealers.map(dealer => (
            <Marker key={dealer._id} position={[dealer.location.coordinates[1], dealer.location.coordinates[0]]}>
              <Popup>
                 <div className="font-bold text-gray-900">{dealer.storeName}</div>
                 <div className="text-sm text-gray-600 mt-1">{dealer.address}</div>
                 <div className="text-sm font-medium mt-2 p-1 bg-gray-100 rounded">Phone: {dealer.contactPhone}</div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapPage;
