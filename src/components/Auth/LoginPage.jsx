import React, { useState } from "react";
import { ShieldCheck, UserCheck, Lock } from "lucide-react";

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 1. demo
  const mockAccounts = {
    sita_fchv: {
      password: "fchv123",
      user: {
        id: "usr_fchv_01",
        name: "Sita Sharma",
        role: "fchv",
        title: "Senior FCHV Coordinator",
        district: "Lamjung, Gandaki Province",
        phone: "+977 984-1234567",
        casesManaged: 42,
      },
    },
    gita_patient: {
      password: "patient123",
      user: {
        id: "usr_pat_01",
        name: "Gita Rai",
        role: "patient",
        title: "Expectant Mother (2nd Trimester)",
        district: "Tokha, Bagmati Province",
        phone: "+977 986-7654321",
        ancVisitsLogged: 2,
      },
    },
  };

  // 2. prefil
  const handleDemoFill = (role) => {
    setError("");
    if (role === "fchv") {
      setUsername("sita_fchv");
      setPassword("fchv123");
    } else {
      setUsername("gita_patient");
      setPassword("patient123");
    }
  };

  // 3. submit validation
  const handleCustomSubmit = (e) => {
    e.preventDefault();
    setError("");

    const cleanUsername = username.trim();
    const cleanPassword = password;

    if (!cleanUsername) {
      setError("Please enter your username.");
      return;
    }

    if (!cleanPassword) {
      setError("Password is required. Please type your password to continue.");
      return;
    }

    // Check credentials
    const matchedAccount = mockAccounts[cleanUsername];

    if (matchedAccount && matchedAccount.password === cleanPassword) {
      onLogin(matchedAccount.user);
    } else {
      setError("Access Denied. Invalid username or password combination.");
    }
  };

  return (
    <div
      className="wizard-card"
      style={{ maxWidth: "480px", margin: "40px auto", padding: "32px" }}
    >
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <Lock
          size={36}
          style={{ color: "var(--color-brand)", marginBottom: "12px" }}
        />
        <h2>Access Sathi Companion</h2>
        <p className="lead" style={{ fontSize: "14px" }}>
          Sign in to access your dashboard, clinical triage forms, and the AI
          Explainer.
        </p>
      </div>

      {/* Demo Selector (Safe helper for testing) */}
      <div
        style={{
          backgroundColor: "var(--color-brand-soft)",
          padding: "16px",
          borderRadius: "8px",
          marginBottom: "24px",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: "bold",
            color: "var(--color-ink)",
            marginBottom: "10px",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          ⚡ Select a demo role to pre-fill credentials:
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            className="btn btn-primary"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
            onClick={() => handleDemoFill("fchv")}
          >
            <ShieldCheck size={14} /> FCHV Account
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "12px",
              border: "1px solid var(--color-border-soft)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
            }}
            onClick={() => handleDemoFill("patient")}
          >
            <UserCheck size={14} /> Patient Account
          </button>
        </div>
      </div>

      {/* Login Form */}
      <form onSubmit={handleCustomSubmit}>
        <div className="field">
          <label className="field-label">Username</label>
          <input
            type="text"
            className="text-input"
            placeholder="e.g., gita_patient"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="field-label">Password</label>
          <input
            type="password"
            className="text-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <div
            style={{
              color: "#b91c1c",
              fontSize: "13px",
              marginBottom: "16px",
              backgroundColor: "#fef2f2",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid #fee2e2",
              fontWeight: "500",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          style={{ marginTop: "16px" }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
