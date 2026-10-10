const router = require("express").Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createCheckoutSession,
  confirmOrder,
} = require("../controllers/checkoutController");

router.post("/create-session", protect, createCheckoutSession);
router.post("/confirm/:sessionId", protect, confirmOrder);

module.exports = router;
