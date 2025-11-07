// src/routes/authRoutes.js
const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");
const { registerLimiter, loginLimiter } = require("../middleware/rateLimiter");
const { protect } = require("../middleware/authMiddleware");

// Import controller functions
const {
  register,
  login,
  // you can add adminCreateUser later if you reintroduce roles
} = require("../controllers/authController");

// --- Validators ---
const emailValidator = body("email")
  .isEmail()
  .withMessage("Valid email required")
  .normalizeEmail();

const passwordValidator = body("password")
  .isLength({ min: 8 })
  .withMessage("Password must be at least 8 characters")
  .trim();

// Centralized validation result handler
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// 🔍 Debug helper: remove after everything’s green
const assertFn = (fn, name) => {
  if (typeof fn !== "function") throw new TypeError(`${name} is ${typeof fn}`);
  return fn;
};

// --- Routes ---

// Public: register a normal user
router.post(
  "/register-user",
  assertFn(registerLimiter, "registerLimiter"),
  assertFn(emailValidator, "emailValidator"),
  assertFn(passwordValidator, "passwordValidator"),
  assertFn(handleValidation, "handleValidation"),
  assertFn(register, "register") // controller.register
);

// Public: login
router.post(
  "/login",
  assertFn(loginLimiter, "loginLimiter"),
  assertFn(emailValidator, "emailValidator"),
  assertFn(
    body("password").notEmpty().withMessage("Password required").trim(),
    "passwordNotEmpty"
  ),
  assertFn(handleValidation, "handleValidation"),
  assertFn(login, "login") // controller.login
);

// (Optional) Debug route to view users in memory
router.get("/debug/users", (req, res) => {
  const { _users } = require("../controllers/authController");
  res.json(_users);
});

router.get("/whoami", assertFn(protect, "protect"), (req, res) => {
  res.json({ id: req.user.id, role: req.user.role, at: new Date() });
});

console.log(
  "[authRoutes] stack size:",
  Array.isArray(router.stack) ? router.stack.length : "no stack"
);
router.stack
  ?.filter(l => l.route)
  ?.forEach(l =>
    console.log("[authRoutes] route:", Object.keys(l.route.methods), l.route.path)
  );


  
module.exports = router;
