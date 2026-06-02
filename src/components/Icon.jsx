export default function Icon({ name, size = 20, stroke = 1.8, style, className }) {
  const paths = {
    search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></>,
    leaf: <><path d="M11 20A7 7 0 0 1 4 13c0-4 3-8 9-9 1 7-2 12-7 13" /><path d="M4 20c4-1 6-3 8-6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 6" /><path d="M17.5 14.4A5.5 5.5 0 0 1 20.5 20" /></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 5.5V20.5" /></>,
    sliders: <><path d="M4 7h10" /><path d="M18 7h2" /><circle cx="16" cy="7" r="2" /><path d="M4 17h2" /><path d="M10 17h10" /><circle cx="8" cy="17" r="2" /></>,
    back: <><path d="M15 5l-7 7 7 7" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    check: <><path d="M5 12.5l4.5 4.5L19 7" /></>,
    x: <><path d="M6 6l12 12" /><path d="M18 6L6 18" /></>,
    flame: <><path d="M12 3c1 3 4 4.5 4 8a4 4 0 0 1-8 0c0-1.5.8-2.7 1.5-3.5C9 8 9 5.5 12 3z" /></>,
    basket: <><path d="M5 9h14l-1.2 9.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" /><path d="M9 9l3-5 3 5" /></>,
    spark: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" /></>,
    bowl: <><path d="M3 11h18a9 9 0 0 1-18 0z" /><path d="M8 7c0-1.5 1.5-2 2-3M13 7c0-1.5 1.5-2 2-3" /></>,
    arrow: <><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></>,
    heart: <><path d="M12 20s-7-4.5-9.2-8.7C1.3 8.4 2.6 5 6 5c2 0 3.2 1.3 4 2.5C10.8 6.3 12 5 14 5c3.4 0 4.7 3.4 3.2 6.3C19 15.5 12 20 12 20z" /></>,
    note: <><path d="M5 4h11l3 3v13H5z" /><path d="M15 4v4h4" /><path d="M8 12h7M8 16h5" /></>,
    list: <><path d="M8 6h13M8 12h13M8 18h13" /><path d="M3 6h.01M3 12h.01M3 18h.01" /></>,
    trash: <><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /></>,
    printer: <><path d="M6 9V4h12v5" /><rect x="6" y="14" width="12" height="7" rx="1" /><path d="M6 14H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}
