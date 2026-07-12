import React from 'react';
import { Siren, AlertTriangle, Check } from 'lucide-react';

export default function AlertRow({ alert, onResolve }) {
  const isEmergency = alert.riskLevel === 'EMERGENCY';
  const Icon = isEmergency ? Siren : AlertTriangle;

  return (
    <div className={`alert-row ${isEmergency ? 'is-emergency' : 'is-urgent'} ${alert.resolved ? 'is-resolved' : ''}`}>
      <div className="alert-row-icon">
        <Icon size={19} />
      </div>
      <div className="alert-row-body">
        <div className="alert-row-top">
          <span className="alert-row-tier">{alert.riskLevel}</span>
          <span className="alert-row-time">{alert.timestamp}</span>
        </div>
        <p className="alert-row-symptoms">{alert.symptoms}</p>
        <span className="alert-row-weeks">{alert.weeks} weeks gestation</span>
      </div>
      <button type="button" className="alert-row-action" onClick={onResolve}>
        <Check size={15} />
        {alert.resolved ? 'Reopen' : 'Mark reviewed'}
      </button>
    </div>
  );
}
