import { useState } from "react";
import {
  isValidCardNumber,
  isValidExpiry,
  isValidCVV,
  isValidPostalCode,
  isValidName,
} from "../utils/validator";

export default function PaymentForm() {
  const [form, setForm] = useState({
    nameOnCard: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
    billingAddress: "",
    city: "",
    postalCode: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" }); // clear field error when editing
  };

  const validateFields = () => {
    const newErrors = {};
    if (!isValidName(form.nameOnCard)) newErrors.nameOnCard = "Enter a valid name.";
    if (!isValidCardNumber(form.cardNumber)) newErrors.cardNumber = "Visa card number (13–16 digits) required.";
    if (!isValidExpiry(form.expiry)) newErrors.expiry = "Enter a valid expiry (MM/YY).";
    if (!isValidCVV(form.cvv)) newErrors.cvv = "CVV must be 3 digits.";
    if (!form.billingAddress) newErrors.billingAddress = "Billing address required.";
    if (!form.city) newErrors.city = "City required.";
    if (!isValidPostalCode(form.postalCode)) newErrors.postalCode = "Invalid postal code.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    console.log("Payment submitted:", form);
    alert("Payment submitted successfully! (Mock)");
  };

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "50px auto",
        padding: 24,
        borderRadius: 10,
        background: "#fafafa",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20 }}>Payment Information</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Name on Card */}
        <div>
          <label>Name on Card:</label>
          <input
            name="nameOnCard"
            value={form.nameOnCard}
            onChange={handleChange}
            className="input"
          />
          {errors.nameOnCard && <p style={{ color: "red", fontSize: 13 }}>{errors.nameOnCard}</p>}
        </div>

        {/* Card Number */}
        <div>
          <label>Card Number:</label>
          <input
            name="cardNumber"
            value={form.cardNumber}
            onChange={handleChange}
            maxLength={16}
            className="input"
          />
          {errors.cardNumber && <p style={{ color: "red", fontSize: 13 }}>{errors.cardNumber}</p>}
        </div>

        {/* Expiry + CVV side by side */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Expiry (MM/YY):</label>
            <input
              name="expiry"
              value={form.expiry}
              onChange={handleChange}
              placeholder="MM/YY"
              className="input"
            />
            {errors.expiry && <p style={{ color: "red", fontSize: 13 }}>{errors.expiry}</p>}
          </div>

          <div style={{ width: "48%" }}>
            <label>CVV:</label>
            <input
              name="cvv"
              value={form.cvv}
              onChange={handleChange}
              maxLength={3}
              className="input"
            />
            {errors.cvv && <p style={{ color: "red", fontSize: 13 }}>{errors.cvv}</p>}
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <label>Billing Address:</label>
          <input
            name="billingAddress"
            value={form.billingAddress}
            onChange={handleChange}
            className="input"
          />
          {errors.billingAddress && (
            <p style={{ color: "red", fontSize: 13 }}>{errors.billingAddress}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label>City:</label>
          <input name="city" value={form.city} onChange={handleChange} className="input" />
          {errors.city && <p style={{ color: "red", fontSize: 13 }}>{errors.city}</p>}
        </div>

        {/* Postal Code */}
        <div>
          <label>Postal Code:</label>
          <input
            name="postalCode"
            value={form.postalCode}
            onChange={handleChange}
            className="input"
          />
          {errors.postalCode && (
            <p style={{ color: "red", fontSize: 13 }}>{errors.postalCode}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            marginTop: 16,
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
}
