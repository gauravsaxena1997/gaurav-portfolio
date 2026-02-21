'use client';

interface BioToastProps {
  message: string;
  visible: boolean;
  loading?: boolean;
}

export function BioToast({ message, visible, loading }: BioToastProps) {
  if (!visible) return null;

  return (
    <div
      className={`bio-contact__snackbar ${loading ? 'bio-contact__snackbar--loading' : ''}`}
      role="status"
      aria-live="polite"
    >
      {loading ? 'Sending...' : message}
    </div>
  );
}
