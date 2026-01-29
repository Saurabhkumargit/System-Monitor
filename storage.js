const WINDOWS = {
  "1m": 60,
  "5m": 300,
  "1h": 3600,
};

const history = {
  "1m": [],
  "5m": [],
  "1h": [],
};

export function storeMetric(metric) {
  Object.keys(WINDOWS).forEach((key) => {
    const windowSize = WINDOWS[key];
    const buffer = history[key];

    buffer.push(metric);

    if (buffer.length > windowSize) {
      buffer.shift();
    }
  });
}

export function getHistory(windowKey) {
  return history[windowKey] || [];
}
