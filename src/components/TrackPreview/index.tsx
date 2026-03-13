type Point = { lat: number; lon: number }

type Props = {
  points: Point[]
  width?: number
  height?: number
  className?: string
}

export default function TrackPreview({ points, width = 120, height = 80, className }: Props) {
  if (points.length < 2) return null

  const lats = points.map((p) => p.lat)
  const lons = points.map((p) => p.lon)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLon = Math.min(...lons)
  const maxLon = Math.max(...lons)

  const pad = 6
  const rangeX = maxLon - minLon || 1
  const rangeY = maxLat - minLat || 1

  // Keep aspect ratio
  const scaleX = (width - pad * 2) / rangeX
  const scaleY = (height - pad * 2) / rangeY
  const scale = Math.min(scaleX, scaleY)

  const offsetX = pad + ((width - pad * 2) - rangeX * scale) / 2
  const offsetY = pad + ((height - pad * 2) - rangeY * scale) / 2

  const toX = (lon: number) => offsetX + (lon - minLon) * scale
  const toY = (lat: number) => offsetY + (maxLat - lat) * scale

  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.lon).toFixed(1)},${toY(p.lat).toFixed(1)}`)
    .join(" ")

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      aria-hidden
    >
      <path d={d} fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
