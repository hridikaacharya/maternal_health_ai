import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Calendar,
  Heart,
  Shield,
  LogOut,
  Trash2,
  FileText,
  CheckCircle,
} from "lucide-react";

export default function ProfilePage({ user, onLogout }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      // Pull and filter records specific to the logged-in user
      const stored = JSON.parse(
        localStorage.getItem("sathi_assessments") || "[]",
      );
      const userHistory = stored.filter((record) => record.userId === user.id);
      setHistory(userHistory);
    }
  }, [user]);

  const clearHistory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear your local assessment history? This will delete cached local data.",
      )
    ) {
      const stored = JSON.parse(
        localStorage.getItem("sathi_assessments") || "[]",
      );
      const remaining = stored.filter((record) => record.userId !== user.id);
      localStorage.setItem("sathi_assessments", JSON.stringify(remaining));
      setHistory([]);
    }
  };

  if (!user) return null;
  const isFchv = user.role === "fchv";

  // Compute simple clinical statistics for the patient from history
  const totalScreenings = history.length;
  const latestScreening = history[0];
  const highRiskCount = history.filter(
    (r) => r.riskLevel === "EMERGENCY" || r.riskLevel === "URGENT",
  ).length;

  return (
    <div
      className="wizard-card"
      style={{ maxWidth: "720px", margin: "40px auto", padding: "32px" }}
    >
      {/* Profile Info Block */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          borderBottom: "1px solid var(--color-border-soft)",
          paddingBottom: "24px",
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            backgroundColor: isFchv
              ? "var(--color-brand)"
              : "var(--color-accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <User size={32} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <h2 style={{ margin: 0 }}>{user.name}</h2>
            <span
              style={{
                backgroundColor: isFchv ? "#EFF6FF" : "#F0FDF4",
                color: isFchv ? "#1D4ED8" : "#15803D",
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "bold",
                border: `1px solid ${isFchv ? "#BFDBFE" : "#BBF7D0"}`,
              }}
            >
              {isFchv ? "FCHV WORKER" : "PATIENT"}
            </span>
          </div>
          <p
            style={{
              color: "var(--color-ink-faint)",
              margin: "4px 0 0 0",
              fontSize: "14px",
            }}
          >
            {user.title}
          </p>
        </div>
      </div>

      {/* Basic Demographics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          margin: "24px 0",
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--color-surface)",
            borderRadius: "8px",
            border: "1px solid var(--color-border-soft)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-ink-faint)",
              fontSize: "11px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            <MapPin size={12} /> REGIONAL HEALTH UNIT
          </div>
          <div style={{ fontWeight: "600", fontSize: "14px" }}>
            {user.district}
          </div>
        </div>

        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--color-surface)",
            borderRadius: "8px",
            border: "1px solid var(--color-border-soft)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--color-ink-faint)",
              fontSize: "11px",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            <Phone size={12} /> REGISTERED PHONE
          </div>
          <div style={{ fontWeight: "600", fontSize: "14px" }}>
            {user.phone}
          </div>
        </div>
      </div>

      {/* Dynamic Screening Analysis & Statistics */}
      {!isFchv && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              padding: "16px",
              backgroundColor: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "24px",
                fontWeight: "800",
                color: "#1E293B",
              }}
            >
              {totalScreenings}
            </span>
            <span
              style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}
            >
              Total Screenings
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "24px",
                fontWeight: "800",
                color: latestScreening ? latestScreening.color : "#64748B",
              }}
            >
              {latestScreening ? latestScreening.weeksPregnant : "--"}
            </span>
            <span
              style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}
            >
              Current Week Logged
            </span>
          </div>
          <div
            style={{
              padding: "16px",
              backgroundColor: "#F8FAFC",
              borderRadius: "8px",
              border: "1px solid #E2E8F0",
              textAlign: "center",
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "24px",
                fontWeight: "800",
                color: highRiskCount > 0 ? "#EF4444" : "#10B981",
              }}
            >
              {highRiskCount}
            </span>
            <span
              style={{ fontSize: "11px", color: "#64748B", fontWeight: "600" }}
            >
              High Risk Flags
            </span>
          </div>
        </div>
      )}

      {/* Timeline Section */}
      <div style={{ marginTop: "32px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "2px solid var(--color-border-soft)",
            paddingBottom: "10px",
            marginBottom: "20px",
          }}
        >
          <h3
            style={{
              margin: 0,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Calendar size={18} />{" "}
            {isFchv
              ? "Community Coordination Log"
              : "My Personal Screening Timeline"}
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              style={{
                background: "none",
                border: "none",
                color: "#EF4444",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "12px",
                fontWeight: "600",
              }}
            >
              <Trash2 size={12} /> Clear Logs
            </button>
          )}
        </div>

        {isFchv ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "var(--color-brand-soft)",
              borderRadius: "8px",
            }}
          >
            <h4 style={{ margin: "0 0 8px 0", color: "#1E3A8A" }}>
              📋 Assigned Sector Parameters
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                lineHeight: "1.5",
                color: "#334155",
              }}
            >
              You are assigned to the <strong>{user.district}</strong> maternal
              monitoring region. Standard screenings filled out by mothers in
              your district are escalated dynamically to your main dashboard if
              they trigger medical warnings. Use the{" "}
              <strong>FCHV Dashboard</strong> tab to view and sign off on active
              cases.
            </p>
          </div>
        ) : (
          <div>
            {history.length === 0 ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  color: "var(--color-ink-faint)",
                  backgroundColor: "#F8FAFC",
                  borderRadius: "8px",
                  border: "1px dashed #CBD5E1",
                }}
              >
                <FileText
                  size={32}
                  style={{ marginBottom: "8px", color: "#94A3B8" }}
                />
                <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
                  No local records logged yet
                </p>
                <span style={{ fontSize: "12px" }}>
                  Fill out the Patient Assessment wizard to begin persistent
                  tracking.
                </span>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {history.map((record) => (
                  <div
                    key={record.id}
                    style={{
                      padding: "16px",
                      backgroundColor: "white",
                      border: "1px solid var(--color-border-soft)",
                      borderRadius: "8px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--color-ink-faint)",
                            fontWeight: "bold",
                          }}
                        >
                          {record.timestamp}
                        </span>
                        <h4
                          style={{
                            margin: "2px 0 0 0",
                            color: "var(--color-ink)",
                          }}
                        >
                          Gestational Age: {record.weeksPregnant} Weeks
                        </h4>
                      </div>
                      <span
                        style={{
                          backgroundColor: record.color + "15",
                          color: record.color,
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "800",
                        }}
                      >
                        {record.riskLevel}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--color-ink-soft)",
                        marginBottom: "8px",
                      }}
                    >
                      <strong>Symptoms reported:</strong>{" "}
                      {record.symptoms && record.symptoms.length > 0
                        ? record.symptoms.join(", ")
                        : "None"}
                    </div>

                    <div
                      style={{
                        backgroundColor: "#F8FAFC",
                        padding: "10px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        borderLeft: `3px solid ${record.color}`,
                      }}
                    >
                      <strong>Required Action:</strong> {record.action}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Logout Action */}
      <button
        type="button"
        className="btn btn-ghost btn-block"
        style={{
          border: "1px solid #EF4444",
          color: "#EF4444",
          marginTop: "32px",
        }}
        onClick={onLogout}
      >
        <LogOut size={14} /> Sign Out of Companion
      </button>
    </div>
  );
}
