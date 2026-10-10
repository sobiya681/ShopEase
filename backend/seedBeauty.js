require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const beautyProducts = [
  {
    name: "Vitamin C Serum",
    price: 24.99,
    stock: 25,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1723951174326-2a97221d3b7f?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Hydrating Hyaluronic Cream",
    price: 32.5,
    stock: 18,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
  },
  {
    name: "Matte Lipstick",
    price: 14.99,
    stock: 40,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400&h=400&fit=crop",
  },
  {
    name: "Volumizing Mascara - Black",
    price: 19.99,
    stock: 22,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1631214540553-ff044a3ff1d4?w=400&h=400&fit=crop",
  },
  {
    name: "Eyeliner - Black",
    price: 16.99,
    stock: 30,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=400&h=400&fit=crop",
  },
  {
    name: "Rose Gold Eyeshadow Palette",
    price: 34.99,
    stock: 15,
    category: "Makeup",
    image:
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&h=400&fit=crop",
  },
  {
    name: "Hair Dryer - Professional",
    price: 21.99,
    stock: 20,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1522338140262-f46f5913618a?w=400&h=400&fit=crop",
  },
  {
    name: "Coconut Repair Shampoo",
    price: 12.99,
    stock: 35,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=400&h=400&fit=crop",
  },
  {
    name: "Deep Conditioner Mask",
    price: 18.5,
    stock: 28,
    category: "Haircare",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&h=400&fit=crop",
  },
  {
    name: "Rose Water Facial Toner",
    price: 15.99,
    stock: 40,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&h=400&fit=crop",
  },
  {
    name: "Gentle Foaming Cleanser",
    price: 17.5,
    stock: 32,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop",
  },
  {
    name: "Retinol Night Repair Cream",
    price: 42.99,
    stock: 12,
    category: "Skincare",
    image:
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=400&h=400&fit=crop",
  },
  {
    name: "Nourishing Body Butter - Shea",
    price: 16.5,
    stock: 26,
    category: "Body Care",
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=400&fit=crop",
  },
  {
    name: "Lavender Body Scrub",
    price: 13.99,
    stock: 30,
    category: "Body Care",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=400&h=400&fit=crop",
  },
  {
    name: "Nail Polish Set - Pastel (6 pcs)",
    price: 22.99,
    stock: 18,
    category: "Nails",
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=400&h=400&fit=crop",
  },
  {
    name: "Cuticle Oil Pen",
    price: 8.99,
    stock: 45,
    category: "Nails",
    image:
      "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop",
  },
  {
    name: "Luxury Perfume - Amber Noir",
    price: 89.99,
    stock: 10,
    category: "Fragrance",
    image:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop",
  },
  {
    name: "Rose Petal Eau de Parfum",
    price: 64.5,
    stock: 14,
    category: "Fragrance",
    image:
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop",
  },
  {
    name: "Jade Facial Roller",
    price: 19.99,
    stock: 22,
    category: "Tools",
    image:
      "https://plus.unsplash.com/premium_photo-1661583880955-7b21fe8f7f00?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Contact Powder Set (3 pcs)",
    price: 29.99,
    stock: 16,
    category: "Tools",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop",
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const deleted = await Product.deleteMany({});
    console.log("Cleared " + deleted.deletedCount + " existing products");

    const inserted = await Product.insertMany(beautyProducts);
    console.log("Inserted " + inserted.length + " beauty products");

    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
})();
