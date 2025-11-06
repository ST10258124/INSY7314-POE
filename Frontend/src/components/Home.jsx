import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Home() {
  const [me, setMe] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await API.get("/auth/whoami");
        setMe(res.data);
        setErr("");
      } catch {
        setMe(null);
        setErr("Not logged in");
      }
    }
    fetchUser();
  }, []);

  const handleLogin = () => navigate("/login");
  const handleRegister = () => navigate("/register");
  const handlePayment = () => navigate("/payment");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eaf3fa", // soft blue background
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px 50px",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          maxWidth: "400px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h2 style={{ color: "#1a3c61", marginBottom: 20 }}>Welcome</h2>

        {err && <p style={{ color: "#b33a3a", marginBottom: 20 }}>{err}</p>}

        {me ? (
          <>
            <p style={{ color: "#2c3e50", marginBottom: 30 }}>
              Hello, <strong>{me.email || "User"}</strong> 👋
            </p>
            <button
              onClick={handlePayment}
              style={{
                backgroundColor: "#1a3c61",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "12px 24px",
                cursor: "pointer",
                fontSize: "16px",
                transition: "0.2s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#244f80")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#1a3c61")}
            >
              💳 Make Payment
            </button>
          </>
        ) : (
          <>
            <p style={{ color: "#2c3e50", marginBottom: 25 }}>
              Please log in or register to continue.
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button
                onClick={handleLogin}
                style={{
                  backgroundColor: "#1a3c61",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 18px",
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#244f80")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#1a3c61")}
              >
                Login
              </button>
              <button
                onClick={handleRegister}
                style={{
                  backgroundColor: "#4b7da8",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "10px 18px",
                  cursor: "pointer",
                  transition: "0.2s ease",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#5f8fb9")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#4b7da8")}
              >
                Register
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
