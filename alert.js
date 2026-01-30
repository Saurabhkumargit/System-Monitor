let highCpuSeconds = 0;
let alertTriggered = false;

export function checkCpuAlert(cpuUsage) {
    if (cpuUsage > 80) {
        highCpuSeconds++;
    } else {
        highCpuSeconds = 0;
        alertTriggered = false;
    }

    if (highCpuSeconds >= 60 && !alertTriggered) {
        alertTriggered = true;
        triggerAlert(cpuUsage);
    }
}

function triggerAlert(cpuUsage) {
  console.log("🚨 ALERT: High CPU Usage Detected!");
  console.log(`CPU has been above 80% for 60 seconds.`);
  console.log(`Current CPU: ${cpuUsage.toFixed(2)}%`);
}