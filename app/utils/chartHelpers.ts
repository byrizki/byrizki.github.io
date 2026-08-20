/**
 * Utility functions for SVG chart geometry generation.
 */

export interface DonutSegment {
  name: string;
  percentage: number;
  color: string;
  dashArray: string;
  dashOffset: number;
}

/**
 * Generate a smooth SVG path definition for sparkline data.
 */
export function generateSparklinePath(
  data: number[],
  width: number = 80,
  height: number = 28,
  padding: number = 2
): string {
  if (!data || data.length === 0) return "";
  const firstVal = data[0];
  if (firstVal === undefined || data.length === 1) {
    return `M ${padding} ${height / 2} L ${width - padding} ${height / 2}`;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points: { x: number; y: number }[] = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((val - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const firstPoint = points[0];
  if (!firstPoint) return "";

  // Build curved cubic Bezier path
  let path = `M ${firstPoint.x.toFixed(1)} ${firstPoint.y.toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    if (!p0 || !p1) continue;
    const cx = (p0.x + p1.x) / 2;
    path += ` C ${cx.toFixed(1)} ${p0.y.toFixed(1)}, ${cx.toFixed(1)} ${p1.y.toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
  }

  return path;
}

/**
 * Calculate stroke-dasharray and stroke-dashoffset for SVG donut chart segments.
 */
export function calculateDonutSegments(
  languages: { name: string; percentage: number; color: string }[],
  radius: number = 42
): DonutSegment[] {
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return languages.map((lang) => {
    const segmentLength = (lang.percentage / 100) * circumference;
    const dashArray = `${segmentLength.toFixed(2)} ${(circumference - segmentLength).toFixed(2)}`;
    const dashOffset = -((accumulatedPercent / 100) * circumference);

    accumulatedPercent += lang.percentage;

    return {
      name: lang.name,
      percentage: lang.percentage,
      color: lang.color,
      dashArray,
      dashOffset,
    };
  });
}

/**
 * Format date string to display format (e.g. "Aug 20, 2026")
 */
export function formatDisplayDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
