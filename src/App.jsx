import React, { useState } from 'react';
import Header from './components/Layout/Header';
import HomePage from './components/Home/HomePage';
import FormWizard from './components/PatientForm/FormWizard';
import DashboardMain from './components/FchvDashboard/DashboardMain';
import './index.css';

export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [globalAlerts, setGlobalAlerts] = useState([]);

  const handleAlertTriggered = (alert) => setGlobalAlerts((prev) => [alert, ...prev]);

  const handleResolveAlert = (id) =>
    setGlobalAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: !a.resolved } : a)));

  return (
    <div className="app-shell">
      <Header
        currentView={currentView}
        onChangeView={setCurrentView}
        alertCount={globalAlerts.filter((a) => !a.resolved).length}
      />
      <main className={`app-main ${currentView === 'home' ? 'app-main--home' : ''}`}>
        {currentView === 'home' && <HomePage onNavigate={setCurrentView} />}
        {currentView === 'patient' && <FormWizard onAlertTriggered={handleAlertTriggered} />}
        {currentView === 'fchv' && <DashboardMain alerts={globalAlerts} onResolveAlert={handleResolveAlert} />}
      </main>
      <footer className="app-footer">
        Sathi is a decision-support prototype. It does not replace assessment, diagnosis, or treatment by a
        qualified health worker. In an emergency, seek immediate care.
      </footer>
    </div>
  );
}
