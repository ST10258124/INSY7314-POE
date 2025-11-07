// src/pages/Payments.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

function maskCard(cardNumber = "") {
  const s = String(cardNumber).replace(/\s+/g, "");
  if (!s) return "";
  if (s.length <= 4) return s;
  return "**** **** **** " + s.slice(-4);
}

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // id of row being acted on
  const [error, setError] = useState("");

  const fetchPayments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/payments");
      // backend might respond with an array or an object containing payments
      const data = Array.isArray(res.data) ? res.data : res.data.payments ?? res.data;
      setPayments(data);
    } catch (err) {
      console.error("Failed to fetch payments:", err);
      setError(err.response?.data?.message || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const updateLocalPayment = (updated) => {
    // updated can be a single payment object OR an array of payments
    if (Array.isArray(updated)) {
      setPayments(updated);
      return;
    }
    setPayments((prev) => prev.map((p) => (String(p.id) === String(updated.id) ? updated : p)));
  };

  const handleApprove = async (id) => {
    if (!window.confirm("Approve this payment?")) return;
    setActionLoading(id);
    try {
      const res = await api.put(`/payments/${id}/approve`);
      // backend might return { payment } or { payments }
      if (res.data.payment) updateLocalPayment(res.data.payment);
      else if (res.data.payments) updateLocalPayment(res.data.payments);
      else if (res.data.payment === undefined && Array.isArray(res.data)) updateLocalPayment(res.data);
      else {
        // fallback: fetch all again
        await fetchPayments();
      }
    } catch (err) {
      console.error("Approve failed:", err);
      alert(err.response?.data?.message || "Approve failed");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Reject this payment?")) return;
    setActionLoading(id);
    try {
      const res = await api.put(`/payments/${id}/reject`);
      if (res.data.payment) updateLocalPayment(res.data.payment);
      else if (res.data.payments) updateLocalPayment(res.data.payments);
      else if (res.data.payment === undefined && Array.isArray(res.data)) updateLocalPayment(res.data);
      else {
        await fetchPayments();
      }
    } catch (err) {
      console.error("Reject failed:", err);
      alert(err.response?.data?.message || "Reject failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Payments Dashboard</h2>
        <p>Loading payments…</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Payments Dashboard</h2>
      <p>Welcome, Admin! Manage submitted payments below.</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {payments.length === 0 ? (
        <p>No payments yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f4f6f8", textAlign: "left" }}>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>ID</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Name on Card</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Card</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Expiry</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Billing Address</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>City</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Postal Code</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Created</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Status</th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((p) => (
                <tr key={p.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>{String(p.id)}</td>
                  <td style={{ padding: 8 }}>{p.nameOnCard}</td>
                  <td style={{ padding: 8 }}>{maskCard(p.cardNumber)}</td>
                  <td style={{ padding: 8 }}>{p.expiry}</td>
                  <td style={{ padding: 8 }}>{p.billingAddress}</td>
                  <td style={{ padding: 8 }}>{p.city}</td>
                  <td style={{ padding: 8 }}>{p.postalCode}</td>
                  <td style={{ padding: 8 }}>{p.createdAt ?? p.createdAt}</td>
                  <td style={{ padding: 8 }}>
                    <strong>{p.status}</strong>
                  </td>
                  <td style={{ padding: 8 }}>
                    {p.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleApprove(p.id)}
                          disabled={actionLoading === p.id}
                          style={{
                            padding: "6px 10px",
                            marginRight: 8,
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: actionLoading === p.id ? "not-allowed" : "pointer",
                          }}
                        >
                          {actionLoading === p.id ? "Working…" : "Approve"}
                        </button>

                        <button
                          onClick={() => handleReject(p.id)}
                          disabled={actionLoading === p.id}
                          style={{
                            padding: "6px 10px",
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: actionLoading === p.id ? "not-allowed" : "pointer",
                          }}
                        >
                          {actionLoading === p.id ? "Working…" : "Reject"}
                        </button>
                      </>
                    ) : (
                      <span style={{ color: p.status === "Approved" ? "#28a745" : "#dc3545" }}>{p.status}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
