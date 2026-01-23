'use client';

export function ScrollableScreen() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#1a1a1a',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        overflow: 'auto',
        padding: '16px',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          position: 'sticky',
          top: '-16px',
          background: '#1a1a1a',
          padding: '16px 0',
          marginTop: '-16px',
          marginLeft: '-16px',
          marginRight: '-16px',
          paddingLeft: '16px',
          borderBottom: '1px solid #333',
          marginBottom: '16px',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '14px' }}>Scrollable Content Demo</h1>
        <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: 0.7 }}>
          Scroll inside to explore!
        </p>
      </div>

      {/* Content sections */}
      {Array.from({ length: 8 }, (_, i) => (
        <Section key={i} index={i + 1} />
      ))}

      {/* Footer */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 0',
          opacity: 0.5,
          fontSize: '10px',
        }}
      >
        End of content
      </div>
    </div>
  );
}

function Section({ index }: { index: number }) {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  ];

  return (
    <div
      style={{
        background: colors[(index - 1) % colors.length],
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
      }}
    >
      <h3 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#1a1a1a' }}>
        Section {index}
      </h3>
      <p style={{ margin: 0, fontSize: '10px', color: '#333', lineHeight: 1.4 }}>
        This is scrollable content section {index}. You can scroll inside the
        laptop screen to see more content. Try scrolling up and down!
      </p>
    </div>
  );
}
