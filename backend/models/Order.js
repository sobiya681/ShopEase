const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, default: "pending" },
    shippingAddress: { type: String, default: "" },
    stripeSessionId: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
