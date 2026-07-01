import { RefreshCw } from "lucide-react";

const SORT_OPTIONS = [
  { value: "added",   label: "Date added"    },
  { value: "bearish", label: "Bearish first" },
  { value: "bullish", label: "Bullish first" },
  { value: "drop",    label: "Biggest drop"  },
  { value: "gain",    label: "Biggest gain"  },
  { value: "alpha",   label: "A → Z"         },
];

const FILTER_OPTIONS = [
  { value: "all",     label: "All"     },
  { value: "Bullish", label: "Bullish" },
  { value: "Bearish", label: "Bearish" },
  { value: "Neutral", label: "Neutral" },
];

// NSE market hours: Mon–Fri 9:15–15:30 IST (UTC+5:30)
function getMarketStatus() {
  const now = new Date();
  const ist = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
  const day  = ist.getDay(); // 0=Sun, 6=Sat
  const mins = ist.getHours() * 60 + ist.getMinutes();
  if (day === 0 || day === 6) return "closed";
  if (mins >= 9 * 60 + 15 && mins < 15 * 60 + 30) return "open";
  if (mins >= 9 * 60 && mins < 9 * 60 + 15) return "pre";
  return "closed";
}

export default function Toolbar({ count, sort, filter, onSort, onFilter, onRefresh, refreshing }) {
  const status = getMarketStatus();
  const statusLabel = { open: "NSE Open", closed: "NSE Closed", pre: "Pre-market" }[status];

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        {count > 0 && (
          <span className="toolbar-label">{count} compan{count === 1 ? "y" : "ies"} tracked</span>
        )}
        <span className={`market-badge market-${status}`}>{statusLabel}</span>
      </div>

      {count > 0 && (
        <div className="toolbar-right">
          <select className="sort-select" value={filter} onChange={e => onFilter(e.target.value)}>
            {FILTER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select className="sort-select" value={sort} onChange={e => onSort(e.target.value)}>
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={onRefresh} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? "spin-icon" : ""} />
            {refreshing ? "Refreshing…" : "Refresh now"}
          </button>
        </div>
      )}
    </div>
  );
}
