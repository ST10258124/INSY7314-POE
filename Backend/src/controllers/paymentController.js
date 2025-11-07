// backend/controllers/PaymentController.js

let payments = []; // in-memory array to store all payments

// Helper to check admin
const isAdmin = (req) => req.user?.role === "admin";

// Create payment (any logged-in user)
exports.createPayment = (req, res) => {
  const { nameOnCard, cardNumber, expiry, cvv, billingAddress, city, postalCode } = req.body;

  // Create new payment record
  const newPayment = {
    id: Date.now(),
    nameOnCard,
    cardNumber,
    expiry,
    cvv,
    billingAddress,
    city,
    postalCode,
    status: "Pending",
    createdAt: new Date().toISOString(),
  };

  // Add to array
  payments.push(newPayment);

  // ✅ Log the entire array so you can see it in console
  console.log("🧾 Payments array updated:", payments);

  // Respond to frontend
  res.status(201).json({
    message: "Payment submitted successfully",
    payment: newPayment,
  });
};

// Get all payments (admin only)
exports.getPayments = (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden: admin only" });
  res.status(200).json(payments);
};

// Approve payment (admin only)
exports.approvePayment = (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden: admin only" });

  const { id } = req.params;
  payments = payments.map((p) => (p.id == id ? { ...p, status: "Approved" } : p));

  console.log(`✅ Payment ${id} approved.`);
  console.log("🧾 Updated payments:", payments);

  res.json({ message: "Payment approved", payments });
};

// Reject payment (admin only)
exports.rejectPayment = (req, res) => {
  if (!isAdmin(req)) return res.status(403).json({ message: "Forbidden: admin only" });

  const { id } = req.params;
  payments = payments.map((p) => (p.id == id ? { ...p, status: "Rejected" } : p));

  console.log(`❌ Payment ${id} rejected.`);
  console.log("🧾 Updated payments:", payments);

  res.json({ message: "Payment rejected", payments });
};
