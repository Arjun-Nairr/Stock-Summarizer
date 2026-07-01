import { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const STAGES = [
  { pct: 0,  label: "Fetching latest news from\nET & Moneycontrol…" },
  { pct: 30, label: "Summarising articles\nwith AI…"                },
  { pct: 70, label: "Updating stock\nprices…"                       },
  { pct: 90, label: "Wrapping up…"                                  },
];

export default function RefreshOverlay({ onDone, companyCount = 1 }) {
  const [progress, setProgress] = useState(0);
  const [label, setLabel]       = useState(STAGES[0].label);
  const [done, setDone]         = useState(false);
  const pctRef                  = useRef(0);
  const finishingRef            = useRef(false);
  const intervalRef             = useRef(null);

  const estimatedMs = Math.min((12 + companyCount * 8) * 1000, 60000);

  // Tick up to 89, then hold
  useEffect(() => {
    const tick       = 200;
    const totalTicks = estimatedMs / tick;

    intervalRef.current = setInterval(() => {
      if (finishingRef.current) return;
      const cur  = pctRef.current;
      const step = Math.max(0.2, (89 - cur) / (totalTicks * 0.4));
      const next = Math.min(cur + step, 89);
      pctRef.current = next;

      const rounded = Math.round(next);
      setProgress(rounded);
      const stage = [...STAGES].reverse().find((s) => rounded >= s.pct);
      if (stage) setLabel(stage.label);
    }, tick);

    return () => clearInterval(intervalRef.current);
  }, [estimatedMs]);

  // When parent signals done, animate smoothly from current to 100 then close
  useEffect(() => {
    if (!onDone || finishingRef.current) return;
    finishingRef.current = true;
    clearInterval(intervalRef.current);

    setLabel("All done!");

    let pct = pctRef.current;
    const finish = setInterval(() => {
      pct = Math.min(pct + 3, 100);
      pctRef.current = pct;
      setProgress(Math.round(pct));
      if (pct >= 100) {
        clearInterval(finish);
        setDone(true);
        setTimeout(onDone, 800); // pause at 100% so user sees it
      }
    }, 30);

    return () => clearInterval(finish);
  }, [onDone]);

  return (
    <div className="overlay-backdrop">
      <div className="overlay-card">
        <div className="overlay-icon-wrap">
          {done
            ? <span className="overlay-check">✓</span>
            : <RefreshCw size={26} strokeWidth={1.8} className="spin-icon" />
          }
        </div>
        <p className="overlay-label">{label}</p>
        <div className="overlay-bar-track">
          <div className="overlay-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="overlay-pct">{Math.round(progress)}%</p>
      </div>
    </div>
  );
}
