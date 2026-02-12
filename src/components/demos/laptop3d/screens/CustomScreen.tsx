'use client';
import { useState } from 'react';

export function CustomScreen() {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '12px',
        boxSizing: 'border-box',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}
    >
      {/* Header with tabs */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '12px',
          borderBottom: '1px solid rgba(255,255,255,0.2)',
          paddingBottom: '8px',
        }}
      >
        {['dashboard', 'analytics', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: 'none',
              background: activeTab === tab ? 'rgba(255,255,255,0.2)' : 'transparent',
              color: 'white',
              fontSize: '11px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          marginBottom: '12px',
        }}
      >
        <StatCard title="Users" value="12,345" trend="+12%" />
        <StatCard title="Revenue" value="$45.6K" trend="+8%" />
        <StatCard title="Orders" value="892" trend="+24%" />
        <StatCard title="Growth" value="+24%" trend="+3%" />
      </div>

      {/* Interactive Counter */}
      <div
        style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontSize: '10px', opacity: 0.8, marginBottom: '4px' }}>
          Interactive Counter
        </div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
          {count}
        </div>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => setCount((c) => c - 1)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            -
          </button>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={{
              background: 'white',
              color: '#764ba2',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            +
          </button>
          <button
            onClick={() => setCount(0)}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '6px 16px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  trend,
}: {
  title: string;
  value: string;
  trend: string;
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.15)',
        borderRadius: '6px',
        padding: '8px',
      }}
    >
      <div style={{ fontSize: '9px', opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{value}</div>
      <div style={{ fontSize: '9px', color: '#90EE90' }}>{trend}</div>
    </div>
  );
}
