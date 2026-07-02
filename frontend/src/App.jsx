import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart2, Sun, Moon } from "lucide-react";
import SearchBar     from "./components/SearchBar.jsx";
import CompanyCard   from "./components/CompanyCard.jsx";
import SkeletonCard  from "./components/SkeletonCard.jsx";
import Toolbar       from "./components/Toolbar.jsx";
import RefreshOverlay from "./components/RefreshOverlay.jsx";

const BUILD = 12;

function sortAndFilter(list, sort, filter) {
  let out = filter === "all" ? [...list] : list.filter(c => c.verdict === filter);
  const VERDICT_ORDER = { Bearish: 0, Neutral: 1, Bullish: 2, null: 3, undefined: 3 };
  switch (sort) {
    case "bearish": out.sort((a, b) => (VERDICT_ORDER[a.verdict] ?? 3) - (VERDICT_ORDER[b.verdict] ?? 3)); break;
    case "bullish": out.sort((a, b) => (VERDICT_ORDER[b.verdict] ?? 3) - (VERDICT_ORDER[a.verdict] ?? 3)); break;
    case "drop":    out.sort((a, b) => (a.day_change_pct ?? 0) - (b.day_change_pct ?? 0)); break;
    case "gain":    out.sort((a, b) => (b.day_change_pct ?? 0) - (a.day_change_pct ?? 0)); break;
    case "alpha":   out.sort((a, b) => a.name.localeCompare(b.name)); break;
    default: break; // "added" = original DB order
  }
  return out;
}

export default function App() {
  const [watchlist, setWatchlist]     = useState([]);
  const [loading, setLoading]         = useState(true);
  const [refreshing, setRefreshing]   = useState(false);
  const [overlayDone, setOverlayDone] = useState(false);
  const [toast, setToast]             = useState(null);
  const [sort, setSort]               = useState("added");
  const [filter, setFilter]           = useState("all");
  const [darkMode, setDarkMode]       = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const pollRef                       = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  const fetchSuggestions = useCallback(async () => {
    try {
      const res  = await fetch("/api/companies/suggestions");
      const data = await res.json();
      setSuggestions(data);
    } catch { /* silent */ }
  }, []);

  const fetchWatchlist = useCallback(async () => {
    try {
      const res  = await fetch("/api/watchlist");
      const data = await res.json();
      setWatchlist(data);
      return data;
    } catch {
      showToast("Could not reach backend. Is the server running?");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWatchlist();
    fetchSuggestions();
    const id = setInterval(fetchWatchlist, 60_000);
    return () => { clearInterval(id); clearInterval(pollRef.current); };
  }, [fetchWatchlist, fetchSuggestions]);

  async function handleAdd(company) {
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(company),
      });
      if (res.status === 409) { showToast("Already in watchlist"); return; }
      if (!res.ok) throw new Error();
      await fetchWatchlist();
      fetchSuggestions();
      showToast(`${company.name} added`);
    } catch {
      showToast("Failed to add company");
    }
  }

  async function handleRemove(id) {
    try {
      await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      setWatchlist(prev => prev.filter(c => c.id !== id));
      fetchSuggestions();
    } catch {
      showToast("Failed to remove");
    }
  }

  async function handleRefresh() {
    setOverlayDone(false);
    setRefreshing(true);
    try {
      await fetch("/api/watchlist/refresh", { method: "POST" });
    } catch {
      showToast("Refresh failed");
      setRefreshing(false);
      return;
    }
    let polls = 0;
    const prevTime = watchlist[0]?.news_last_updated ?? null;
    pollRef.current = setInterval(async () => {
      polls++;
      const data = await fetchWatchlist();
      const newTime = data?.[0]?.news_last_updated ?? null;
      if ((newTime && newTime !== prevTime) || polls >= 10) {
        clearInterval(pollRef.current);
        setOverlayDone(true);
      }
    }, 8000);
  }

  function handleOverlayDone() {
    setRefreshing(false);
    setOverlayDone(false);
  }

  const watchlistTickers = new Set(watchlist.map(c => c.ticker));
  const displayed = sortAndFilter(watchlist, sort, filter);

  return (
    <div className="app">
      {refreshing && (
        <RefreshOverlay
          onDone={overlayDone ? handleOverlayDone : null}
          companyCount={watchlist.length}
        />
      )}

      <div className="header">
        <div className="header-title">
          <BarChart2 size={28} strokeWidth={1.8} />
          <div>
            <h1>My Stock News <span className="build-badge">v{BUILD}</span></h1>
            <p>AI-summarised news for your Indian stocks, updated every hour.</p>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(d => !d)}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={17} strokeWidth={2} /> : <Moon size={17} strokeWidth={2} />}
        </button>
      </div>

      <SearchBar onAdd={handleAdd} watchlistTickers={watchlistTickers} />

      {suggestions.length > 0 && (
        <div className="suggestions-bar">
          <div className="suggestions-label">Quick add</div>
          <div className="suggestions-scroll">
            {suggestions.map(s => (
              <button
                key={s.ticker}
                className="suggestion-chip"
                onClick={() => handleAdd(s)}
                title={`Add ${s.name} to watchlist`}
              >
                + {s.name}
                <span className="suggestion-chip-ticker">{s.ticker.replace(".NS","")}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <Toolbar
        count={watchlist.length}
        sort={sort}
        filter={filter}
        onSort={setSort}
        onFilter={setFilter}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      {loading ? (
        <div className="cards-grid">
          {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
        </div>
      ) : watchlist.length === 0 ? (
        <div className="empty-state">
          <BarChart2 size={40} strokeWidth={1.2} />
          <h2>Your watchlist is empty</h2>
          <p>Search for a company above to get started.</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <h2>No {filter} stocks</h2>
          <p>None of your companies have a {filter} verdict right now.</p>
        </div>
      ) : (
        <div className="cards-grid">
          {displayed.map(company => (
            <CompanyCard key={company.id} company={company} onRemove={handleRemove} />
          ))}
        </div>
      )}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
