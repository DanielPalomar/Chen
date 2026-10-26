import React from 'react';

interface ChenLogoProps {
  className?: string;
  showTagline?: boolean;
}

export const ChenLogo: React.FC<ChenLogoProps> = ({
  className = '',
  showTagline = false,
}) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Minimal rising arc of connected nodes (Dawn + Citations metaphor) */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-[var(--accent-teal)]"
        aria-hidden="true"
      >
        {/* Arc baseline */}
        <path
          d="M 4 21 Q 14 9 24 21"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="opacity-40"
        />
        {/* Rising knowledge nodes */}
        <circle cx="4" cy="21" r="2.25" fill="currentColor" />
        <circle cx="10" cy="13.5" r="2.25" fill="currentColor" />
        <circle cx="18" cy="13.5" r="2.25" fill="currentColor" />
        <circle cx="24" cy="21" r="2.25" fill="currentColor" />
        {/* Highest node (Dawn apex) */}
        <circle
          cx="14"
          cy="7"
          r="3"
          fill="var(--action-primary)"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <line
          x1="10"
          y1="13.5"
          x2="14"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.25"
          className="opacity-70"
        />
        <line
          x1="18"
          y1="13.5"
          x2="14"
          y2="7"
          stroke="currentColor"
          strokeWidth="1.25"
          className="opacity-70"
        />
      </svg>

      <div className="flex flex-col">
        <span className="font-serif text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-none">
          Chen
        </span>
        {showTagline && (
          <span className="text-[11px] text-[var(--text-tertiary)] font-sans tracking-normal mt-0.5">
            Conocimiento libre con argumentos
          </span>
        )}
      </div>
    </div>
  );
};
