import React, { useEffect, useState } from 'react';
import './ReservoirCard.css';

const getStatus = (pct) => {
  if (pct >= 100) return { label: '滿庫', cls: 'status-full', barCls: 'full-bar', pctCls: 'full-pct' };
  if (pct >= 95) return { label: '高蓄水', cls: 'status-high', barCls: '', pctCls: '' };
  return { label: '正常', cls: 'status-normal', barCls: '', pctCls: '' };
};

const ReservoirCard = ({ name, storage, pct, isHovered, onMouseEnter, onMouseLeave }) => {
  const [width, setWidth] = useState(0);
  const status = getStatus(pct);
  const isFull = pct >= 100;

  useEffect(() => {
    // Animate progress bar after mount
    const timer = setTimeout(() => {
      setWidth(Math.min(pct, 100));
    }, 200);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <div 
      className={`reservoir-card ${isFull ? 'full' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="card-header">
        <div className="reservoir-name">{name}</div>
        <div className={`status-chip ${status.cls}`}>{status.label}</div>
      </div>
      <div className="progress-wrap">
        <div 
          className={`progress-bar ${status.barCls}`} 
          style={{ width: `${width}%` }} 
        />
      </div>
      <div className="stats-row">
        <div>
          <div className="storage-amount">{storage}</div>
          <div className="storage-unit">萬立方公尺</div>
        </div>
        <div className={`pct-badge ${status.pctCls}`}>{pct.toFixed(2)}%</div>
      </div>
      <svg className="wave-bg" viewBox="0 0 300 50" preserveAspectRatio="none">
        <path d="M0,25 C50,5 100,45 150,25 S250,5 300,25 L300,50 L0,50Z" fill="var(--cyan)"/>
      </svg>
    </div>
  );
};

export default ReservoirCard;
