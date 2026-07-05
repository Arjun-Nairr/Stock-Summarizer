import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { api } from "../api.js";

export default function SearchBar({ onAdd, watchlistTickers }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(null); // ticker being added
  const ref = useRef(null);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setOpen(false); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(api(`/api/companies/search?q=${encodeURIComponent(query)}`));
        const data = await res.json();
        setResults(data);
        setOpen(true);
      } catch { /* network error, ignore */ }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handleAdd(company) {
    if (watchlistTickers.has(company.ticker)) return;
    setAdding(company.ticker);
    await onAdd(company);
    setAdding(null);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="search-wrapper" ref={ref}>
      <Search size={16} className="search-icon" />
      <input
        className="search-input"
        type="text"
        placeholder="Search for a company (e.g. Reliance, TCS, HDFC…)"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
      />
      {open && (
        <div className="search-dropdown">
          {results.length === 0 ? (
            <div className="search-empty">No companies found</div>
          ) : (
            results.map((c) => {
              const inList = watchlistTickers.has(c.ticker);
              return (
                <button
                  key={c.ticker}
                  className="search-dropdown-item"
                  onClick={() => handleAdd(c)}
                  disabled={inList || adding === c.ticker}
                >
                  <span>
                    {c.name}
                    {inList && <span style={{ color: "var(--text-muted)", fontSize: "0.78rem", marginLeft: 8 }}>Already added</span>}
                  </span>
                  <span className="search-ticker">
                    {adding === c.ticker ? <span className="spinner" /> : c.ticker.replace(".NS", "")}
                  </span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
