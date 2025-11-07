const { protect, admin } = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");
const router = require("express").Router();

router.post("/", protect, paymentController.createPayment);
router.get("/", protect, admin, paymentController.getPayments);          // admin only
router.put("/:id/approve", protect, admin, paymentController.approvePayment);
router.put("/:id/reject", protect, admin, paymentController.rejectPayment);

module.exports = router;