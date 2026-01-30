import { collectMetrics } from "./metric.js";
import { storeMetric, getHistory } from "./storage.js";
import { checkCpuAlert } from "./alert.js";

console.log("Monitor script started");

setInterval(() => {
  const metric = collectMetrics();
  if (!metric) return;

  storeMetric(metric);
  checkCpuAlert(metric.cpu);

  const oneMinCount = getHistory("1m").length;

  console.log(
    `CPU: ${metric.cpu.toFixed(2)}% | MEM: ${metric.memory.toFixed(
      2
    )}% | Load: ${metric.load.toFixed(2)} | 1m samples: ${oneMinCount}`
  );
}, 1000);
