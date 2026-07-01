import "dotenv/config";
import express from "express";
import cors from "cors";
import watchlistRoutes  from "./routes/watchlist.js";
import companiesRoutes  from "./routes/companies.js";
import { startScheduler, runPipeline } from "./services/scheduler.js";

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/watchlist",  watchlistRoutes);
app.use("/api/companies",  companiesRoutes);
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
  startScheduler();
  // Always run a fresh pipeline on startup so cards are never stale after a restart
  runPipeline(true).catch(err => console.error("[startup] Pipeline error:", err));
});
