/* ==========================================================================
   Coffee Impero  |  central product data
   Edit prices, colours and copy here. Every page reads from this file.
   Image paths are relative to the site root.
   ========================================================================== */

window.IMPERO = {
  currency: "QAR",

  // WhatsApp number in international format, digits only.
  whatsapp: "97451779171",
  whatsappDisplay: "+974 5177 9171",

  products: [
    {
      id: "001",
      name: "Coffee Impero 001",
      url: "impero-001.html",
      price: 239,
      tag: "",
      short: "The entry into the collection. Self heating, battery powered, built to travel light.",
      colors: [
        { name: "Black",  hex: "#1B1B1B", img: "assets/images/products/impero-001-black.jpg" },
        { name: "White",  hex: "#F2F2F0", img: "assets/images/products/impero-001-white.jpg" },
        { name: "Green",  hex: "#2F4A34", img: "assets/images/products/impero-001-green.jpg" }
      ]
    },
    {
      id: "011",
      name: "Coffee Impero 011",
      url: "impero-011.html",
      price: 279,
      tag: "3 in 1 + display",
      short: "3 in 1 brewing with a temperature display, in a slim travel body.",
      colors: [
        { name: "Black",  hex: "#1B1B1B", img: "assets/images/products/impero-011-black.jpg" },
        { name: "White",  hex: "#F2F2F0", img: "assets/images/products/impero-011-white.jpg" }
      ]
    },
    {
      id: "010",
      name: "Coffee Impero 010",
      url: "impero-010.html",
      price: 309,
      tag: "4 in 1 + display",
      short: "The full machine. 4 in 1 brewing with a temperature display.",
      colors: [
        { name: "Black",  hex: "#1B1B1B", img: "assets/images/products/impero-010-black.jpg" },
        { name: "White",  hex: "#F2F2F0", img: "assets/images/products/impero-010-white.jpg" }
      ]
    }
  ],

  // Shared, verified specifications
  specs: [
    { label: "Pressure",      value: "25 bar" },
    { label: "Water capacity", value: "100 ml" },
    { label: "Battery",       value: "9600 mAh" },
    { label: "Charging",      value: "USB-C" },
    { label: "Heating",       value: "Self heating" },
    { label: "Compatibility", value: "Nespresso® / Dolce Gusto® / ground coffee" },
    { label: "Material",      value: "Stainless steel" },
    { label: "Output",        value: "About 3 cups at 100 ml, depending on use" },
    { label: "Temperature",   value: "Temperature control" }
  ]
};

window.IMPERO.find = function (id) {
  return window.IMPERO.products.filter(function (p) { return p.id === id; })[0];
};
