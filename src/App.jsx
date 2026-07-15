import React, { useState } from "react";
import Header from "./components/Layout/Header";
import HomePage from "./components/Home/HomePage";
import FormWizard from "./components/PatientForm/FormWizard";
import DashboardMain from "./components/FchvDashboard/DashboardMain";
import LoginPage from "./components/Auth/LoginPage";
import ProfilePage from "./components/Profile/ProfilePage";
import AiExplainerPage from "./components/AiExplainer/AiExplainerPage";
import "./index.css";

export default function App() {
  const [currentView, setCurrentView] = useState("home");
  const [globalAlerts, setGlobalAlerts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleAlertTriggered = (alert) =>
    setGlobalAlerts((prev) => [alert, ...prev]);

  const handleResolveAlert = (id) =>
    setGlobalAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a)),
    );

  // Utility to seed useful dummy data on login for testing
  const seedDemoData = (userId) => {
    const existing = JSON.parse(
      localStorage.getItem("sathi_assessments") || "[]",
    );
    const hasData = existing.some((item) => item.userId === userId);

    if (!hasData && userId === "usr_pat_01") {
      // Seed two highly realistic past checkups for Gita Rai to demonstrate persistent history[cite: 5]
      const seededRecords = [
        {
          id: 1000000000001,
          userId: "usr_pat_01",
          timestamp: "Jun 12, 2026 10:30 AM",
          weeksPregnant: 16,
          ancVisits: "1",
          symptoms: ["Mild swelling"],
          riskLevel: "LOW RISK",
          action: "Continue Routine ANC Monitoring.",
          reason:
            "Physiological parameters and symptom checks fall within normal expected bounds.",
          color: "#10b981",
        },
        {
          id: 1000000000002,
          userId: "usr_pat_01",
          timestamp: "May 14, 2026 09:15 AM",
          weeksPregnant: 12,
          ancVisits: "0",
          symptoms: [],
          riskLevel: "LOW RISK",
          action: "Continue Routine ANC Monitoring.",
          reason: "Current parameters fall within baseline expected paths.",
          color: "#10b981",
        },
      ];
      localStorage.setItem(
        "sathi_assessments",
        JSON.stringify([...seededRecords, ...existing]),
      );
    }
  };

  const handleLoginSuccess = (userObject) => {
    setCurrentUser(userObject);
    seedDemoData(userObject.id);
    setCurrentView(userObject.role === "fchv" ? "fchv" : "patient");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("home");
  };

  const renderProtectedView = () => {
    if (!currentUser && currentView !== "home" && currentView !== "login") {
      return <LoginPage onLogin={handleLoginSuccess} />;
    }

    switch (currentView) {
      case "home":
        return (
          <HomePage
            onNavigate={(view) => {
              if (!currentUser && view !== "home") {
                setCurrentView("login");
              } else {
                setCurrentView(view);
              }
            }}
          />
        );
      case "login":
        return <LoginPage onLogin={handleLoginSuccess} />;
      case "profile":
        return <ProfilePage user={currentUser} onLogout={handleLogout} />;
      case "ai-explain":
        return <AiExplainerPage currentUser={currentUser} />;
      case "patient":
        return (
          <FormWizard
            onAlertTriggered={handleAlertTriggered}
            currentUser={currentUser}
          />
        );
      case "fchv":
        return currentUser?.role === "fchv" ? (
          <DashboardMain
            alerts={globalAlerts}
            onResolveAlert={handleResolveAlert}
          />
        ) : (
          <div
            className="wizard-card"
            style={{
              textAlign: "center",
              padding: "40px",
              margin: "40px auto",
              maxWidth: "500px",
            }}
          >
            <h3 style={{ color: "var(--color-emergency)" }}>
              Access Restricted
            </h3>
            <p>
              Your account ({currentUser?.name}) does not have FCHV monitoring
              permissions.
            </p>
          </div>
        );
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="app-shell">
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        alertCount={globalAlerts.filter((a) => !a.resolved).length}
        currentUser={currentUser}
      />
      <main
        className={`app-main ${currentView === "home" ? "app-main--home" : ""}`}
      >
        {renderProtectedView()}
      </main>
      <footer className="app-footer">
        Sathi is a decision-support prototype. It does not replace assessment,
        diagnosis, or treatment by a qualified health worker. In an emergency,
        seek immediate care.
      </footer>
    </div>
  );
}
