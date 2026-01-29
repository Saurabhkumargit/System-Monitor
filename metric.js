import { timeStamp } from "console";
import os from "os";

let prevCpuTimes = null;

function getCpuTimes() {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((cpu) => {
    const t = cpu.times;
    idle += t.idle;
    total += t.user + t.nice + t.sys + t.idle + t.irq;
  });
  return { idle, total };
}

export function collectMetrics() {
  if (!prevCpuTimes) {
    prevCpuTimes = getCpuTimes();
    return null;
  }

  const current = getCpuTimes();

  const idleDelta = current.idle - prevCpuTimes.idle;
  const totalDelta = current.total - prevCpuTimes.total;

  const cpu =
    totalDelta === 0 ? 0 : ((totalDelta - idleDelta) / totalDelta) * 100;

  prevCpuTimes = current;

  const memory = ((os.totalmem() - os.freemem()) / os.totalmem()) * 100;

  const load = os.loadavg()[0];

  return {
    timeStamp: Date.now(),
    cpu,
    memory,
    load,
  };
}
