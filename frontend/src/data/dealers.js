export const dealers = [
  {
    id: 1,
    name: "Coimbatore Construction Supply",
    location: "Gandhipuram",
    latitude: 11.0183,
    longitude: 76.9660,
    products: [
      { productId: "645c72e293a9fa1b54a40001", stock: 500, price: 380 }, 
      { productId: "645c72e293a9fa1b54a40003", stock: 25, price: 68500 },
      { productId: "645c72e293a9fa1b54a40005", stock: 20000, price: 9.5 }
    ]
  },
  {
    id: 2,
    name: "Peelamedu Cements & Steels",
    location: "Peelamedu",
    latitude: 11.0261,
    longitude: 77.0026,
    products: [
      { productId: "645c72e293a9fa1b54a40002", stock: 800, price: 365 },
      { productId: "645c72e293a9fa1b54a40004", stock: 40, price: 65000 },
      { productId: "645c72e293a9fa1b54a40006", stock: 10000, price: 7.2 }
    ]
  },
  {
    id: 3,
    name: "RS Puram BuildMart",
    location: "RS Puram",
    latitude: 11.0084,
    longitude: 76.9498,
    products: [
      { productId: "645c72e293a9fa1b54a40001", stock: 300, price: 395 },
      { productId: "645c72e293a9fa1b54a40002", stock: 400, price: 375 },
      { productId: "645c72e293a9fa1b54a40005", stock: 15000, price: 8.0 }
    ]
  },
  {
    id: 4,
    name: "Singanallur Hardwares",
    location: "Singanallur",
    latitude: 11.0003,
    longitude: 77.0270,
    products: [
      { productId: "645c72e293a9fa1b54a40003", stock: 30, price: 69000 },
      { productId: "645c72e293a9fa1b54a40005", stock: 12000, price: 9.0 },
      { productId: "645c72e293a9fa1b54a40008", stock: 15, price: 12000 }
    ]
  },
  {
    id: 5,
    name: "Saibaba Colony Materials",
    location: "Saibaba Colony",
    latitude: 11.0232,
    longitude: 76.9407,
    products: [
      { productId: "645c72e293a9fa1b54a40001", stock: 1000, price: 400 },
      { productId: "645c72e293a9fa1b54a40004", stock: 60, price: 66000 },
      { productId: "645c72e293a9fa1b54a40007", stock: 10, price: 18500 }
    ]
  }
];

export const getDealersForProduct = (productId) => {
  return dealers
    .filter(dealer => dealer.products.some(p => p.productId === productId))
    .map(dealer => {
      const productData = dealer.products.find(p => p.productId === productId);
      return {
        id: dealer.id,
        name: dealer.name,
        location: dealer.location,
        latitude: dealer.latitude,
        longitude: dealer.longitude,
        stock: productData.stock,
        price: productData.price
      };
    })
    .sort((a, b) => a.price - b.price); // Sorted by lowest price initially
};
