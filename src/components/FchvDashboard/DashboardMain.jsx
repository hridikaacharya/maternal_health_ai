import React, { useState } from 'react';
import { Inbox } from 'lucide-react';
import AlertRow from './AlertRow';

export default function DashboardMain({ alerts, onResolveAlert }) {
  const [filter, setFilter] = useState('all');

  const filtered = alerts.filter((a) => {
    if (filter === 'all') return true;
    if (filter === 'active') return !a.resolved;
    return a.riskLevel === filter;
  });

  const activeCount = alerts.filter((a) => !a.resolved).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Monitoring Log</h2>
          <p className="dashboard-subtitle">
            {activeCount} active case{activeCount === 1 ? '' : 's'} needing follow-up
          </p>
        </div>
        <div className="filter-group">
          {['all', 'active', 'EMERGENCY', 'URGENT'].map((f) => (
            <button key={f} type="button" className={`filter-btn ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dashboard-empty">
          <Inbox size={30} />
          <p>No alerts here yet.</p>
          <span>Urgent and emergency assessments from the patient form will appear automatically.</span>
        </div>
      ) : (
        <div className="alert-list">
          {filtered.map((alert) => (
            <AlertRow key={alert.id} alert={alert} onResolve={() => onResolveAlert(alert.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
