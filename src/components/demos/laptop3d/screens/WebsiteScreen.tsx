'use client';

export function WebsiteScreen() {
  return (
    <iframe
      src="https://www.youtube.com/@SuperhumanFlow"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        background: '#0f0f0f',
      }}
      title="SuperhumanFlow YouTube Channel"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    />
  );
}

// Fallback if iframe is blocked
export function WebsiteScreenFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        padding: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>
        @SuperhumanFlow
      </div>
      <div style={{ fontSize: '12px', opacity: 0.7 }}>
        YouTube Channel Preview
      </div>
    </div>
  );
}
