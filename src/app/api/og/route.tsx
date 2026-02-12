import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#0a0a0a',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    position: 'relative',
                }}
            >
                {/* Subtle Grid Background */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'radial-gradient(circle at 1px 1px, #222 1px, transparent 0)',
                        backgroundSize: '40px 40px',
                        opacity: 0.5,
                    }}
                />

                {/* Content Container */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        zIndex: 10,
                        padding: '60px',
                        border: '1px solid #333',
                        borderRadius: '20px',
                        backgroundColor: '#000',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                    }}
                >
                    <div style={{ fontSize: 72, fontWeight: 900, letterSpacing: '-0.05em', marginBottom: 20 }}>
                        GAURAV SAXENA
                    </div>

                    <div style={{ fontSize: 32, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        Creative Technologist
                    </div>

                    <div style={{ height: 2, width: 100, backgroundColor: '#333', margin: '30px 0' }} />

                    <div style={{ fontSize: 24, color: '#666', maxWidth: '600px', textAlign: 'center', lineHeight: 1.4 }}>
                        Building immersive, high-performance web platforms that drive growth.
                    </div>
                </div>
            </div>
        ),
        {
            width: 1200,
            height: 630,
        },
    );
}
