export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatTons(value: number): string {
  return `${value.toLocaleString()} t`;
}

export function formatLossTons(value: number): string {
  return `${value.toLocaleString()} t`;
}

export function formatMetricValue(value: number, unit: string): string {
  if (unit === '%') {
    return formatPercent(value);
  }
  return `${value.toLocaleString()} ${unit}`;
}

export function formatChartDate(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
