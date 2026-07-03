import "dotenv/config";
import express from "express";
import cors from "cors";
import watchlistRoutes  from "./routes/watchlist.js";
import companiesRoutes  from "./routes/companies.js";
import { startScheduler, runPipeline } from "./services/scheduler.js";
import { runFundamentalsPipeline } from "./services/fundamentalsScraper.js";

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
  runPipeline(true).catch(err => console.error("[startup] Pipeline error:", err));
  runFundamentalsPipeline().catch(err => console.error("[startup] Fundamentals error:", err));
});
