const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Product = require("../models/Product");
const Order = require("../models/Order");

// POST /api/checkout
exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const line_items = [];
    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (only ${product.stock} left)`,
        });
      }

      line_items.push({
        price_data: {
          currency: "usd",
          product_data: { name: product.name },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      });

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image, // ✅ ADD THIS
      });
      total += product.price * item.quantity;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId: req.user._id.toString() },
    });

    // Show order as pending
    await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount: total,
      paymentStatus: "pending",
      stripeSessionId: session.id,
      shippingAddress: shippingAddress || "",
    });

    res.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe session error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/checkout/confirm
exports.confirmOrder = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId,
    );

    if (session.payment_status !== "paid") {
      return res.status(400).json({ message: "Payment not completed" });
    }

    const order = await Order.findOne({ stripeSessionId: session.id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.paymentStatus === "paid") {
      return res.json({ message: "Already processed", order });
    }

  
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    order.paymentStatus = "paid";
    await order.save();

    res.json({ message: "Order confirmed", order });
  } catch (err) {
    console.error("Confirm error:", err);
    res.status(500).json({ message: err.message });
  }
};
