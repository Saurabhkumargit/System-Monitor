"use client";

import { useEffect, useState } from "react";
import { Metric } from "./types/metric";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Home() {
  const [current, setCurrent] = useState<Metric | null>(null);
  const [history, setHistory] = useState<Metric[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const curr: Metric = await fetch(
        "http://localhost:4000/api/current",
      ).then((res) => res.json());

      const hist: Metric[] = await fetch(
        "http://localhost:4000/api/history/1m",
      ).then((res) => res.json());

      setCurrent(curr);
      setHistory(hist);
    };

    fetchData();
    const id = setInterval(fetchData, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "0 20px",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>System Health Dashboard</h1>

      <p style={{ color: "#aaa", marginBottom: "32px" }}>
        Real-time CPU, memory, and load monitoring (1s sampling)
      </p>

      {current && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#aaa" }}>CPU Usage</div>
            <div style={{ fontSize: "28px", marginTop: "8px" }}>
              {current.cpu.toFixed(2)}%
            </div>
          </div>

          <div
            style={{
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#aaa" }}>Memory Usage</div>
            <div style={{ fontSize: "28px", marginTop: "8px" }}>
              {current.memory.toFixed(2)}%
            </div>
          </div>

          <div
            style={{
              border: "1px solid #333",
              borderRadius: "6px",
              padding: "16px",
            }}
          >
            <div style={{ fontSize: "14px", color: "#aaa" }}>Load Average</div>
            <div style={{ fontSize: "28px", marginTop: "8px" }}>
              {current.load.toFixed(2)}
            </div>
          </div>
        </div>
      )}

      <h2 style={{ marginBottom: "12px" }}>CPU Usage (Last 1 Minute)</h2>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: "6px",
          padding: "16px",
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={history}>
            <XAxis dataKey="timestamp" hide />
            <YAxis domain={[0, 100]} stroke="#ccc" />
            <Tooltip />

            {/* faint grid for context */}
            <CartesianGrid stroke="#333" strokeDasharray="3 3" />

            <Line
              type="monotone"
              dataKey="cpu"
              stroke="#00e5ff" // high-contrast cyan
              strokeWidth={2} // thicker line
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
