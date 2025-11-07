const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// --- in-memory "database" ---
const users = []; // { id, email, password (hashed), role }

// --- seed admin user ---
(async () => {
  const bcrypt = require("bcrypt");

  const adminEmail = "admin@gmail.com";
  const adminPassword = "Admin12345!"; 

  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  users.push({
    id: 1,
    email: adminEmail,
    password: hashedPassword,
    role: "admin",
    createdAt: new Date(),
  });

  console.log(` Admin user seeded: ${adminEmail} / ${adminPassword}`);
})();



const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_key"; // fallback for dev
const JWT_EXPIRES = "2h"; // or "1d"

// --- helper ---
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

// --- REGISTER ---
exports.register = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const existingUser = users.find(u => u.email === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = {
      id: users.length + 1,
      email: normalizedEmail,
      password: hashedPassword,
      role: role && ["admin", "editor", "author", "reader"].includes(role)
        ? role
        : "reader",
      createdAt: new Date(),
    };

    users.push(newUser);

    // ✅ Real JWT now
    const token = generateToken(newUser);

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// --- LOGIN ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = String(email).toLowerCase().trim();
    const user = users.find(u => u.email === normalizedEmail);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    // ✅ Real JWT again
    const token = generateToken(user);

    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports._users = users;
