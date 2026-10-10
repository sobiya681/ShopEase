const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

// GET /api/orders/mine
router.get("/mine", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/orders/cod 
router.post("/cod", protect, async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;
    if (!items || !items.length)
      return res.status(400).json({ message: "Cart is empty" });

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.quantity)
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}`,
        });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });
      total += product.price * item.quantity;
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      paymentStatus: "cod-pending",
      shippingAddress: shippingAddress || "",
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    res.status(201).json({ message: "Order placed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/cancel
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your order" });

    if (order.paymentStatus === "cancelled")
      return res.status(400).json({ message: "Already cancelled" });

    if (order.paymentStatus === "paid")
      return res
        .status(400)
        .json({ message: "Paid orders cannot be cancelled" });

    
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.paymentStatus = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/orders/:id/track
router.put("/:id/track", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not your order" });

    const placedAt = new Date(order.createdAt);

    const isPaid = order.paymentStatus === "paid";
    const isCancelled = order.paymentStatus === "cancelled";
    const isCod = order.paymentStatus === "cod-pending";

    const timeline = [
      { step: "Order Placed", done: true, date: placedAt },
      {
        step: "Payment Confirmed",
        done: isPaid,
        date: isPaid ? new Date(placedAt.getTime() + 5 * 60000) : null,
      },
      {
        step: isCod ? "Awaiting Delivery" : "Packed",
        done: isPaid || isCod,
        date:
          isPaid || isCod ? new Date(placedAt.getTime() + 60 * 60000) : null,
      },
      { step: "Out for Delivery", done: false, date: null },
      { step: "Delivered", done: false, date: null },
    ];

    if (isCancelled) {
      return res.json({
        order,
        timeline: [
          { step: "Order Placed", done: true, date: placedAt },
          { step: "Cancelled", done: true, date: order.updatedAt },
        ],
      });
    }

    res.json({ order, timeline });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// DELETE /api/orders/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your order" });
    }

    // Paid orders cannot be removed
    if (order.paymentStatus === "paid") {
      return res.status(400).json({
        message: "Paid orders cannot be removed. Request a refund first.",
      });
    }

    // Restock only if not already cancelled 
    if (
      order.paymentStatus !== "cancelled" &&
      order.paymentStatus !== "refunded"
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({ message: "Order removed", _id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
