import { useState, useRef, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus, Clock, Trash2, ExternalLink, Link2 } from "lucide-react";
import CompanyAvatar from "./CompanyAvatar.jsx";

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function fmtFundamental(val) {
  if (val == null) return "—";
  return Number(val).toFixed(1) + "%";
}

function formatPrice(val) {
  if (val == null) return "—";
  return "₹" + Number(val).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const VERDICT_META = {
  Bullish: { icon: TrendingUp,   tooltip: "Bullish — Positive outlook. News suggests the stock price may rise." },
  Bearish: { icon: TrendingDown, tooltip: "Bearish — Negative outlook. News suggests the stock price may fall." },
  Neutral: { icon: Minus,        tooltip: "Neutral — Mixed signals. No strong direction either way."             },
};

const VERDICT_DOT = { Bullish: "dot-bullish", Bearish: "dot-bearish", Neutral: "dot-neutral" };

export default function CompanyCard({ company, onRemove }) {
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const sourcesRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    if (!sourcesOpen) return;
    function handle(e) {
      if (sourcesRef.current && !sourcesRef.current.contains(e.target)) {
        setSourcesOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("touchstart", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("touchstart", handle);
    };
  }, [sourcesOpen]);

  const {
    id, name, ticker,
    summary, verdict, news_last_updated,
    article_links = [], verdict_history = [],
    current_price, day_change, day_change_pct,
    roce, roe, sales_growth,
  } = company;

  const changeUp   = day_change != null && day_change >= 0;
  const changeSign = day_change != null ? (changeUp ? "+" : "") : "";
  const meta       = verdict ? VERDICT_META[verdict] : null;
  const VerdictIcon = meta?.icon;

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header">
        <div className="card-header-left">
          <CompanyAvatar ticker={ticker} />
          <div>
            <div className="card-name">{name}</div>
            <div className="card-ticker">{ticker.replace(".NS", "")} · NSE</div>
          </div>
        </div>
        {verdict && meta && (
          <span className={`verdict-badge verdict-${verdict} verdict-tooltip-anchor`} title={meta.tooltip}>
            <VerdictIcon size={13} strokeWidth={2.5} />
            {verdict}
            <span className="verdict-hint">?</span>
          </span>
        )}
      </div>

      {/* Verdict history trail */}
      {verdict_history.length > 0 && (
        <div className="verdict-trail">
          <span className="trail-label">7-day trend</span>
          <div className="trail-dots">
            {verdict_history.map((v, i) => (
              <span key={i} className={`trail-dot ${VERDICT_DOT[v] ?? ""}`} title={v} />
            ))}
          </div>
        </div>
      )}

      {/* Stock price */}
      <div className="price-row">
        <span className="price-value">{formatPrice(current_price)}</span>
        {day_change != null && (
          <span className={`price-change ${changeUp ? "up" : "down"}`}>
            {changeSign}{Number(day_change).toFixed(2)} ({changeSign}{Number(day_change_pct).toFixed(2)}%)
          </span>
        )}
        {!current_price && <span className="price-loading">Price loading…</span>}
      </div>

      {/* Summary */}
      {summary ? (
        <div className="summary-block">
          <p className="summary-text">{summary}</p>

          <div className="summary-footer">
            {news_last_updated && (
              <span className="news-updated">
                <Clock size={11} />
                {formatDate(news_last_updated)}
              </span>
            )}

            {article_links.length > 0 && (
              <div className="sources-anchor" ref={sourcesRef}>
                <button
                  className="sources-toggle"
                  onClick={() => setSourcesOpen(o => !o)}
                >
                  <Link2 size={11} />
                  Sources ({article_links.length})
                </button>

                {sourcesOpen && (
                  <div className="sources-popup">
                    <div className="sources-popup-title">Sources</div>
                    {article_links.map((a, i) => (
                      <a
                        key={i}
                        href={a.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                        onClick={() => setSourcesOpen(false)}
                      >
                        <ExternalLink size={11} />
                        <span>{a.title?.slice(0, 80)}{a.title?.length > 80 ? "…" : ""}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="no-summary">No recent news found for this company.</p>
      )}

      {/* Fundamentals row */}
      {(roce != null || roe != null || sales_growth != null) && (
        <div className="fundamentals-row">
          <span className="fundamental-item">
            <span className="fundamental-label">ROCE</span>
            <span className="fundamental-value">{fmtFundamental(roce)}</span>
          </span>
          <span className="fundamental-sep">·</span>
          <span className="fundamental-item">
            <span className="fundamental-label">ROE</span>
            <span className="fundamental-value">{fmtFundamental(roe)}</span>
          </span>
          <span className="fundamental-sep">·</span>
          <span className="fundamental-item">
            <span className="fundamental-label">3yr Sales Growth</span>
            <span className="fundamental-value">{fmtFundamental(sales_growth)}</span>
          </span>
        </div>
      )}

      {/* Footer */}
      <div className="card-footer">
        <button className="btn-remove" onClick={() => onRemove(id)}>
          <Trash2 size={13} /> Remove
        </button>
      </div>
    </div>
  );
}
