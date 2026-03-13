import { ELLIPSIS } from "@/lib/constants"
import type { ActivityRaw, ActivityViewModel } from "@/types"

export function toActivityViewModel(activity: ActivityRaw): ActivityViewModel {
  const title = activity.title ?? "Untitled"
  const distance = activity.distanceM != null ? `${(activity.distanceM / 1000).toFixed(1)} km` : ELLIPSIS
  const duration = activity.durationS != null ? formatDuration(activity.durationS) : ELLIPSIS
  const date = new Date(activity.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return {
    id: activity.id,
    title,
    sportType: activity.sportType,
    distance,
    duration,
    date,
    points: parsePoints(activity.trackJson),
  }
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${s}s`
}

function parsePoints(trackJson: string | null): Array<{ lat: number; lon: number }> {
  if (!trackJson) return []
  try {
    const parsed: unknown = JSON.parse(trackJson)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (p): p is { lat: number; lon: number } =>
        typeof p === "object" && p !== null && typeof p.lat === "number" && typeof p.lon === "number",
    )
  } catch {
    return []
  }
}
