import { ChipStacking } from '@/themes/creative/components/sections/stats/illustrations/ChipStacking';
import { GestureProvider } from '@/themes/creative/context/GestureContext';

export default function ChipTestPage() {
    return (
        <GestureProvider>
            <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#222' }}>
                <div style={{ width: '500px', height: '500px', border: '2px solid red', position: 'relative' }}>
                    <ChipStacking />
                </div>
            </div>
        </GestureProvider>
    );
}
