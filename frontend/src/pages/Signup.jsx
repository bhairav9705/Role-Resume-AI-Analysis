import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { signup as signupApi } from "../api/auth";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }

    setLoading(true);

    try {
      await signupApi(email, password);
      // Log the user in right after signup
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const GOOGLE_AUTH_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/google`;

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "0 16px" }}>
      <h2 style={{ marginBottom: "4px" }}>Create Account</h2>
      <p style={{ color: "#6b7280", marginBottom: "24px", marginTop: 0 }}>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#4f46e5" }}>
          Sign in
        </Link>
      </p>

      {error && (
        <p
          style={{
            color: "#dc2626",
            background: "#fee2e2",
            padding: "8px 12px",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "12px" }}
      >
        <div>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Password</label>
          <input
            type="password"
            placeholder="Min. 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Confirm Password</label>
          <input
            type="password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </div>

        <button type="submit" disabled={loading} style={btnPrimary}>
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "20px 0" }}>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e5e7eb" }} />
        <span style={{ color: "#9ca3af", fontSize: "13px" }}>or</span>
        <hr style={{ flex: 1, border: "none", borderTop: "1px solid #e5e7eb" }} />
      </div>

      <a href={GOOGLE_AUTH_URL} style={btnGoogle}>
        Sign up with Google
      </a>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: "#374151",
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const btnPrimary = {
  padding: "11px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
  marginTop: "4px",
};

const btnGoogle = {
  display: "block",
  textAlign: "center",
  padding: "11px",
  border: "1px solid #d1d5db",
  borderRadius: "6px",
  textDecoration: "none",
  color: "#374151",
  fontSize: "14px",
  fontWeight: "500",
};
