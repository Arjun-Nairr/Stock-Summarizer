import { TrendingUp, TrendingDown, Minus, Clock, Trash2, ExternalLink } from "lucide-react";
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
  Bullish: { icon: TrendingUp,   tooltip: "Bullish — Positive outlook. News suggests the stock price may rise."  },
  Bearish: { icon: TrendingDown, tooltip: "Bearish — Negative outlook. News suggests the stock price may fall."  },
  Neutral: { icon: Minus,        tooltip: "Neutral — Mixed signals. No strong direction either way."              },
};

const VERDICT_DOT = { Bullish: "dot-bullish", Bearish: "dot-bearish", Neutral: "dot-neutral" };

export default function CompanyCard({ company, onRemove }) {
  const {
    id, name, ticker,
    summary, verdict, verdict_reason, news_last_updated,
    article_links = [], verdict_history = [],
    current_price, day_change, day_change_pct,
    roce, roe, sales_growth,
  } = company;

  const changeUp    = day_change != null && day_change >= 0;
  const changeSign  = day_change != null ? (changeUp ? "+" : "") : "";
  const meta        = verdict ? VERDICT_META[verdict] : null;
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
          {verdict_reason && <p className="verdict-reason">{verdict_reason}</p>}

          {/* Source links */}
          {article_links.length > 0 && (
            <div className="source-links">
              <span className="source-label">Sources</span>
              {article_links.map((a, i) => (
                <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className="source-link">
                  <ExternalLink size={11} />
                  <span>{a.title?.slice(0, 60)}{a.title?.length > 60 ? "…" : ""}</span>
                </a>
              ))}
            </div>
          )}

          {news_last_updated && (
            <span className="news-updated">
              <Clock size={11} />
              AI summary · {formatDate(news_last_updated)}
            </span>
          )}
        </div>
      ) : (
        <p className="no-summary">
          {summary === null
            ? "No recent news found for this company."
            : "Hit Refresh to fetch the latest news."}
        </p>
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
