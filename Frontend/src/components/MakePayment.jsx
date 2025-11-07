import { useState } from "react";
import api from "../services/api"; //import your backend connection
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
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

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateFields()) return;

  try {
    setLoading(true);
    const res = await api.post("/payments", form);
    console.log("✅ Payment submitted:", res.data.payment); // 👈 shows what backend saved
    alert("Payment submitted successfully! Awaiting admin approval.");
    setForm({
      nameOnCard: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
      billingAddress: "",
      city: "",
      postalCode: "",
    });
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to submit payment.");
  } finally {
    setLoading(false);
  }
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
        <div>
          <label>Name on Card:</label>
          <input name="nameOnCard" value={form.nameOnCard} onChange={handleChange} className="input" />
          {errors.nameOnCard && <p style={{ color: "red", fontSize: 13 }}>{errors.nameOnCard}</p>}
        </div>

        <div>
          <label>Card Number:</label>
          <input name="cardNumber" value={form.cardNumber} onChange={handleChange} maxLength={16} className="input" />
          {errors.cardNumber && <p style={{ color: "red", fontSize: 13 }}>{errors.cardNumber}</p>}
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label>Expiry (MM/YY):</label>
            <input name="expiry" value={form.expiry} onChange={handleChange} placeholder="MM/YY" className="input" />
            {errors.expiry && <p style={{ color: "red", fontSize: 13 }}>{errors.expiry}</p>}
          </div>

          <div style={{ width: "48%" }}>
            <label>CVV:</label>
            <input name="cvv" value={form.cvv} onChange={handleChange} maxLength={3} className="input" />
            {errors.cvv && <p style={{ color: "red", fontSize: 13 }}>{errors.cvv}</p>}
          </div>
        </div>

        <div>
          <label>Billing Address:</label>
          <input name="billingAddress" value={form.billingAddress} onChange={handleChange} className="input" />
          {errors.billingAddress && <p style={{ color: "red", fontSize: 13 }}>{errors.billingAddress}</p>}
        </div>

        <div>
          <label>City:</label>
          <input name="city" value={form.city} onChange={handleChange} className="input" />
          {errors.city && <p style={{ color: "red", fontSize: 13 }}>{errors.city}</p>}
        </div>

        <div>
          <label>Postal Code:</label>
          <input name="postalCode" value={form.postalCode} onChange={handleChange} className="input" />
          {errors.postalCode && <p style={{ color: "red", fontSize: 13 }}>{errors.postalCode}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          {loading ? "Submitting..." : "Submit Payment"}
        </button>
      </form>
    </div>
  );
}