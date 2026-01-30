import express from "express";
import { collectMetrics } from "./metric.js";
import { storeMetric, getHistory } from "./storage.js";

const app = express();
const PORT = 4000;

setInterval(() => {
  const metric = collectMetrics();
  if (!metric) return;

  storeMetric(metric);
}, 1000);

app.get("/api/current", (req, res) => {
  const history = getHistory("1m");
  const latest = history[history.length - 1];
  res.json(latest || {});
});

app.get("/api/history/:window", (req, res) => {
  const { window } = req.params;
  const data = getHistory(window);

  if (!data) {
    return res.status(400).json({ error: "Invalid window" });
  }
  res.json(data);
});

app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
