export const dealers = [
  {
    id: 1,
    name: "Chennai South Construction Supply",
    location: "Guindy Industrial Estate, Chennai",
    distance: 4.5, // km
    products: [
      { productId: 1, stock: 500, price: 380 }, // UltraTech (Base price 390) - cheaper here
      { productId: 3, stock: 25, price: 68500 }, // Tata Tiscon
      { productId: 5, stock: 20000, price: 9.5 }, // Red Clay Bricks
      { productId: 8, stock: 15, price: 12000 } // Washed M-Sand
    ]
  },
  {
    id: 2,
    name: "Karthik Cements & Steels",
    location: "Ambattur Red Hills Rd, Chennai",
    distance: 12.3, // km
    products: [
      { productId: 2, stock: 800, price: 365 }, // Ambuja (Base 375)
      { productId: 4, stock: 40, price: 65000 }, // JSW Steel
      { productId: 6, stock: 10000, price: 7.2 }, // Fly Ash Bricks
      { productId: 8, stock: 20, price: 12500 } // Washed M-Sand
    ]
  },
  {
    id: 3,
    name: "Murugan Traders",
    location: "GST Road, Tambaram Sanatorium",
    distance: 8.7, // km
    products: [
      { productId: 1, stock: 300, price: 395 }, // UltraTech
      { productId: 2, stock: 400, price: 375 }, // Ambuja
      { productId: 5, stock: 15000, price: 8.0 }, // Red Clay Bricks
      { productId: 7, stock: 10, price: 18500 } // River Sand
    ]
  },
  {
    id: 4,
    name: "Balaji Hardwares & Steels",
    location: "Velachery Main Road, Chennai",
    distance: 3.2, // km
    products: [
      { productId: 3, stock: 30, price: 69000 }, // Tata Tiscon (Base 68000)
      { productId: 5, stock: 12000, price: 9.0 }, // Red Clay Bricks
      { productId: 6, stock: 18000, price: 6.8 }, // Fly Ash Bricks
      { productId: 7, stock: 8, price: 19000 } // River Sand
    ]
  },
  {
    id: 5,
    name: "Chennai BuildMart",
    location: "Rajiv Gandhi Salai, OMR, Perungudi",
    distance: 6.8, // km
    products: [
      { productId: 1, stock: 1000, price: 400 }, // UltraTech
      { productId: 4, stock: 60, price: 66000 }, // JSW Neo Steel
      { productId: 8, stock: 25, price: 12800 } // Washed M-Sand
    ]
  },
  {
    id: 6,
    name: "Sri Ram Building Materials",
    location: "Trunk Road, Poonamallee",
    distance: 15.1, // km
    products: [
      { productId: 2, stock: 600, price: 360 }, // Ambuja
      { productId: 5, stock: 30000, price: 7.5 }, // Red Clay Bricks
      { productId: 7, stock: 20, price: 17500 } // River Sand
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
        distance: dealer.distance,
        stock: productData.stock,
        price: productData.price
      };
    })
    .sort((a, b) => a.price - b.price); // Sorted by lowest price initially
};
