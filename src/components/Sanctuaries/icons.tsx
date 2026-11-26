import React from "react";

export type SanctuaryIconName =
  | "pin"
  | "area"
  | "hearth"
  | "transfer"
  | "bed"
  | "bath"
  | "craft"
  | "peaks"
  | "sauna"
  | "dining"
  | "stars"
  | "compass"
  | "pet"
  | "sun"
  | "shield";

interface IconProps {
  name: SanctuaryIconName;
  size?: number;
  className?: string;
}

export function SanctuaryIcon({ name, size = 16, className }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10Z" />
          <circle cx="12" cy="11" r="2.2" />
        </svg>
      );
    case "area":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5v4.5l3 2" />
        </svg>
      );
    case "hearth":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9 10h.01M15 10h.01" />
          <path d="M8.8 14.5a4.2 4.2 0 0 0 6.4 0" />
        </svg>
      );
    case "transfer":
      return (
        <svg {...common}>
          <path d="M5 14l1.6-4.5A2 2 0 0 1 8.5 8.2h7a2 2 0 0 1 1.9 1.3L19 14" />
          <rect x="3.5" y="14" width="17" height="4.5" rx="1.2" />
          <circle cx="7.5" cy="16.2" r="0.8" />
          <circle cx="16.5" cy="16.2" r="0.8" />
        </svg>
      );
    case "bed":
      return (
        <svg {...common}>
          <path d="M3.5 18V8.5a1.5 1.5 0 0 1 1.5-1.5h14a1.5 1.5 0 0 1 1.5 1.5V18" />
          <path d="M3.5 14h17" />
          <path d="M6.5 11.5h4v2.5h-4zM13.5 11.5h4v2.5h-4z" />
        </svg>
      );
    case "bath":
      return (
        <svg {...common}>
          <path d="M4 12h16v2.5a4.5 4.5 0 0 1-4.5 4.5h-7A4.5 4.5 0 0 1 4 14.5V12Z" />
          <path d="M6.5 12V7.5a2 2 0 0 1 3.7-1" />
          <path d="M7 19l-1 2M17 19l1 2" />
        </svg>
      );
    case "craft":
      return (
        <svg {...common}>
          <path d="M4 20h16" />
          <path d="M6 20V10l6-5.5L18 10v10" />
          <path d="M10 20v-5a2 2 0 1 1 4 0v5" />
        </svg>
      );
    case "peaks":
      return (
        <svg {...common}>
          <path d="M3 19l6.2-10.5L13.5 15l2.8-4 4.7 8H3Z" />
          <path d="M8.1 10.4L10 12l2-1.5" />
        </svg>
      );
    case "sauna":
      return (
        <svg {...common}>
          <path d="M5 15.5h14v2a3.5 3.5 0 0 1-3.5 3.5h-7A3.5 3.5 0 0 1 5 17.5v-2Z" />
          <path d="M8.5 11.5c0-1.4 1.2-1.8 1.2-3.2M12 11.5c0-1.4 1.2-1.8 1.2-3.2M15.5 11.5c0-1.4 1.2-1.8 1.2-3.2" />
        </svg>
      );
    case "dining":
      return (
        <svg {...common}>
          <path d="M4 15h16" />
          <path d="M6 15a6 6 0 0 1 12 0" />
          <path d="M12 7v2M9 18h6" />
        </svg>
      );
    case "stars":
      return (
        <svg {...common}>
          <path d="M12 3.5l1.9 4.6 4.6 1.9-4.6 1.9L12 16.5l-1.9-4.6-4.6-1.9 4.6-1.9L12 3.5Z" />
          <path d="M18.5 15.5l.8 1.8 1.8.8-1.8.8-.8 1.8-.8-1.8-1.8-.8 1.8-.8.8-1.8Z" />
        </svg>
      );
    case "compass":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <polygon points="15.2 8.8 13.4 13.4 8.8 15.2 10.6 10.6 15.2 8.8" />
        </svg>
      );
    case "pet":
      return (
        <svg {...common}>
          <path d="M12 20s-6.5-4.3-8.2-8.2A4.5 4.5 0 0 1 12 7.2a4.5 4.5 0 0 1 8.2 4.6C18.5 15.7 12 20 12 20Z" />
        </svg>
      );
    case "sun":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3.5l7 3v5.4c0 4.6-3 7.9-7 9.1-4-1.2-7-4.5-7-9.1V6.5l7-3Z" />
          <path d="M9.5 12.2l1.8 1.8 3.6-3.8" />
        </svg>
      );
  }
}
