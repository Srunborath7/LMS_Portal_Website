import type { ReactNode } from 'react';

// Registration may block while its client form loads; it does not promise an instant transition.
export const instant = false;

export default function RegisterLayout({ children }: { children: ReactNode }) {
  return children;
}
