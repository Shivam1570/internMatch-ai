import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M14.5 10.5c-1.12 0-2.24.3-3.24.9-1.42.85-2.76 2.1-3.26 3.6" />
      <path d="M9.5 14.5c1.12 0 2.24-.3 3.24-.9 1.42-.85 2.76-2.1 3.26-3.6" />
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v.01" />
    </svg>
  );
}
