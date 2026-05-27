export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatPercentOneDecimal(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? `${rounded}%` : `${rounded.toFixed(1)}%`;
}

export function formatDecimal(value: number, fractionDigits = 2): string {
  return value.toFixed(fractionDigits);
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

export function formatChartHour(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  return `${hours}:00`;
}
