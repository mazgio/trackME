import { ELLIPSIS } from "@/lib/constants"
import type { ActivityViewModel } from "@/types"

export type ActivityDetailRaw = {
  id: string
  title: string | null
  sportType: string
  distanceM: number | null
  durationS: number | null
  createdAt: string
  trackJson: string | null
}

export type ActivityDetailViewModel = ActivityViewModel & {
  pace: string
  elevationGain: string
  points: Array<{ lat: number; lon: number; ele?: number }>
}

export function toActivityDetailViewModel(activity: ActivityDetailRaw): ActivityDetailViewModel {
  const title = activity.title ?? "Untitled"
  const distance = activity.distanceM != null ? `${(activity.distanceM / 1000).toFixed(1)} km` : ELLIPSIS
  const duration = activity.durationS != null ? formatDuration(activity.durationS) : ELLIPSIS
  const date = new Date(activity.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
  const points = parsePoints(activity.trackJson)
  const pace = activity.distanceM && activity.durationS ? formatPace(activity.durationS, activity.distanceM) : ELLIPSIS
  const elevationGain = points.length > 0 ? `${calcElevationGain(points)} m` : ELLIPSIS

  return { id: activity.id, title, sportType: activity.sportType, distance, duration, date, pace, elevationGain, points }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${s}s`
}

function formatPace(durationS: number, distanceM: number): string {
  const paceSecPerKm = (durationS / distanceM) * 1000
  const m = Math.floor(paceSecPerKm / 60)
  const s = Math.round(paceSecPerKm % 60)
  return `${m}:${s.toString().padStart(2, "0")} /km`
}

function calcElevationGain(points: Array<{ ele?: number }>): number {
  let gain = 0
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1].ele
    const curr = points[i].ele
    if (prev != null && curr != null && curr > prev) {
      gain += curr - prev
    }
  }
  return Math.round(gain)
}

function parsePoints(trackJson: string | null): Array<{ lat: number; lon: number; ele?: number }> {
  if (!trackJson) return []
  try {
    const parsed: unknown = JSON.parse(trackJson)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is { lat: number; lon: number; ele?: number } =>
        typeof p === "object" && p !== null && typeof p.lat === "number" && typeof p.lon === "number"
    )
  } catch {
    return []
  }
}
