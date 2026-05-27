/**
 * Small helpers to render tool output text the agent can read back to the user.
 */

export function pct(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)}%`;
}

export function tons(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)} tons`;
}

export function days(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits)} days`;
}

export function joinLines(lines: (string | null | undefined | false)[]): string {
  return lines.filter(Boolean).join('\n');
}
