import React from "react";
import { Lock, User as UserIcon, Sparkles } from "lucide-react";

export default function Header({
  currentView,
  onChangeView,
  alertCount,
  currentUser,
}) {
  const isFchv = currentUser && currentUser.role === "fchv";

  return (
    <header className="header">
      <button
        type="button"
        className="header-brand"
        onClick={() => onChangeView("home")}
        aria-label="Go to home page"
      >
        <svg width="34" height="34" viewBox="0 0 40 40" aria-hidden="true">
          <path
            d="M2 30 L14 12 L20 21 L26 10 L38 30 Z"
            fill="var(--color-brand)"
          />
          <circle cx="26.5" cy="9" r="3.4" fill="var(--color-accent)" />
        </svg>
        <div>
          <p className="header-title">Sathi</p>
          <p className="header-subtitle">Maternal Health Companion · MHDSS</p>
        </div>
      </button>

      <div className="view-toggle" role="tablist" aria-label="Choose view">
        {/* Rule 1: Home is universally visible */}
        <button
          type="button"
          role="tab"
          aria-selected={currentView === "home"}
          className={`view-toggle-btn ${currentView === "home" ? "is-active" : ""}`}
          onClick={() => onChangeView("home")}
        >
          Home
        </button>

        {/* Rule 2: Without logging in, NO ONE sees tabs other than Home and Login */}
        {currentUser ? (
          <>
            <button
              type="button"
              role="tab"
              aria-selected={currentView === "patient"}
              className={`view-toggle-btn ${currentView === "patient" ? "is-active" : ""}`}
              onClick={() => onChangeView("patient")}
            >
              Patient Assessment
            </button>

            {/* Rule 3: FCHV Dashboard is strictly gated to the 'fchv' role */}
            {isFchv && (
              <button
                type="button"
                role="tab"
                aria-selected={currentView === "fchv"}
                className={`view-toggle-btn ${currentView === "fchv" ? "is-active" : ""}`}
                onClick={() => onChangeView("fchv")}
              >
                FCHV Dashboard
                {alertCount > 0 && (
                  <span className="view-toggle-badge">{alertCount}</span>
                )}
              </button>
            )}

            <button
              type="button"
              role="tab"
              aria-selected={currentView === "ai-explain"}
              className={`view-toggle-btn ${currentView === "ai-explain" ? "is-active" : ""}`}
              onClick={() => onChangeView("ai-explain")}
              style={{ display: "flex", alignItems: "center", gap: "6px" }}
            >
              <Sparkles size={14} /> AI Explainer
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={currentView === "profile"}
              className={`view-toggle-btn ${currentView === "profile" ? "is-active" : ""}`}
              onClick={() => onChangeView("profile")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontWeight: "bold",
              }}
            >
              <UserIcon size={14} /> {currentUser.name.split(" ")[0]}
            </button>
          </>
        ) : (
          <button
            type="button"
            role="tab"
            aria-selected={currentView === "login"}
            className={`view-toggle-btn ${currentView === "login" ? "is-active" : ""}`}
            onClick={() => onChangeView("login")}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            <Lock size={14} /> Sign In
          </button>
        )}
      </div>
    </header>
  );
}
