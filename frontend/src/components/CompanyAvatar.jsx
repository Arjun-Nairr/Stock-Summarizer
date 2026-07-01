const COLORS = [
  { bg: "rgba(91,141,238,0.18)",  color: "#5b8dee" },
  { bg: "rgba(34,197,94,0.15)",   color: "#22c55e" },
  { bg: "rgba(245,158,11,0.15)",  color: "#f59e0b" },
  { bg: "rgba(239,68,68,0.15)",   color: "#ef4444" },
  { bg: "rgba(168,85,247,0.15)",  color: "#a855f7" },
  { bg: "rgba(20,184,166,0.15)",  color: "#14b8a6" },
  { bg: "rgba(249,115,22,0.15)",  color: "#f97316" },
  { bg: "rgba(236,72,153,0.15)",  color: "#ec4899" },
];

function hashTicker(ticker) {
  let h = 0;
  for (const ch of ticker) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h % COLORS.length;
}

function initials(ticker) {
  // Strip .NS, take up to 2 chars
  const base = ticker.replace(".NS", "").replace(/[^A-Z]/g, "");
  return base.slice(0, 2);
}

export default function CompanyAvatar({ ticker, size = 42 }) {
  const { bg, color } = COLORS[hashTicker(ticker)];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.36,
        letterSpacing: "0.03em",
        flexShrink: 0,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {initials(ticker)}
    </div>
  );
}
