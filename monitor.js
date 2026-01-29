import os from "os";
import { collectMetrics } from "./metric.js";

console.log("Monitor script started");

// ---- Helper: aggregate CPU times ----
function getCpuTimes() {
  const cpus = os.cpus();

  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    const times = cpu.times;
    totalIdle += times.idle;
    totalTick += times.user + times.nice + times.sys + times.idle + times.irq;
  });

  return { totalIdle, totalTick };
}

let prevCpuTimes = getCpuTimes();

setInterval(() => {
  const data = collectMetrics();
  if (!data) return;

  console.log(
    `CPU: ${data.cpu.toFixed(2)}% | MEM: ${data.memory.toFixed(
      2,
    )}% | Load: ${data.load.toFixed(2)}`,
  );

  const currentCpuTimes = getCpuTimes();

  const idleDelta = currentCpuTimes.totalIdle - prevCpuTimes.totalIdle;
  const totalDelta = currentCpuTimes.totalTick - prevCpuTimes.totalTick;

  const cpuUsage =
    totalDelta === 0 ? 0 : ((totalDelta - idleDelta) / totalDelta) * 100;

  prevCpuTimes = currentCpuTimes;

  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const memoryUsage = ((totalMem - freeMem) / totalMem) * 100;

  const [load1] = os.loadavg();

  console.log(
    `CPU: ${cpuUsage.toFixed(2)}% | MEM: ${memoryUsage.toFixed(
      2,
    )}% | Load: ${load1.toFixed(2)}`,
  );
}, 1000);
