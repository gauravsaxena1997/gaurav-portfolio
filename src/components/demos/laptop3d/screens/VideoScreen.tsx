'use client';

export function VideoScreen() {
  return (
    <iframe
      src="https://www.youtube.com/embed/YE7VzlLtp-4?autoplay=1&mute=1&loop=1&playlist=YE7VzlLtp-4&controls=1"
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        background: '#000',
      }}
      title="Video Preview"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  );
}

// Alternative: Local video file
export function VideoScreenLocal() {
  return (
    <video
      src="/videos/demo.mp4"
      autoPlay
      loop
      muted
      playsInline
      controls
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        background: '#000',
      }}
    />
  );
}
