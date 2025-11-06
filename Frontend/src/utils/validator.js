export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());

export const isStrongPassword = (password) =>
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?-]{8,}$/.test(String(password || ""));

export const isValidCardNumber = (cardNumber) => {
  const sanitized = String(cardNumber || "").replace(/\s+/g, "");
  return /^4\d{12}(\d{3})?$/.test(sanitized);
};

export const isValidExpiry = (expiry) => {
  const match = /^([0-1]\d)\/(\d{2})$/.exec(String(expiry || "").trim());
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt("20" + match[2], 10);
  if (month < 1 || month > 12) return false;

//check if expiry date is in future
  const now = new Date();
  const expiryDate = new Date(year, month - 1, 1);
  return expiryDate >= new Date(now.getFullYear(), now.getMonth(), 1);
};

export const isValidCVV = (cvv) => /^[0-9]{3,4}$/.test(String(cvv || "").trim());

export const isValidPostalCode = (postalCode) =>
  /^[A-Za-z0-9\s-]{3,10}$/.test(String(postalCode || "").trim());

export const isValidName = (name) =>
  /^[A-Za-z\s.'-]{2,50}$/.test(String(name || "").trim());