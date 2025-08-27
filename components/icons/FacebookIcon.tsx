import React from 'react';

export const FacebookIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96s4.46 9.96 9.96 9.96c5.5 0 9.96-4.46 9.96-9.96S17.5 2.04 12 2.04zm2.6 10.34h-1.82v5.9h-2.34v-5.9H9.32V10.7h1.12V9.4c0-1.02.52-2.62 2.62-2.62h1.6v1.98h-1.18c-.12 0-.3.06-.3.32v1.62h1.48l-.2 1.64z"></path>
  </svg>
);
