"use client"

import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, Popup, useMap, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { haversine, buildCumDists } from "@/lib/geo"
import styles from "./index.module.css"

type Point = { lat: number; lon: number; ele?: number }

type Props = {
  points: Point[]
  onHoverDist?: (dist: number | null) => void
  hoverPoint?: { lat: number; lon: number } | null
}

function kmMarkers(points: Point[]): Array<{ point: Point; km: number }> {
  const markers: Array<{ point: Point; km: number }> = []
  let accumulated = 0
  let nextKm = 1

  for (let i = 1; i < points.length; i++) {
    accumulated += haversine(points[i - 1], points[i])
    if (accumulated >= nextKm * 1000) {
      markers.push({ point: points[i], km: nextKm })
      nextKm++
    }
  }

  return markers
}


function KmMarker({ point, km }: { point: Point; km: number }) {
  const [street, setStreet] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (street !== null) return
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${point.lat}&lon=${point.lon}&format=json`,
        { headers: { "Accept-Language": "it" } },
      )
      const data = await res.json() as { address?: { road?: string; suburb?: string; town?: string } }
      setStreet(data.address?.road ?? data.address?.suburb ?? data.address?.town ?? "Unknown")
    } catch {
      setStreet("Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <CircleMarker
      center={[point.lat, point.lon]}
      radius={8}
      pathOptions={{ color: "var(--color-white)", fillColor: "var(--color-accent)", fillOpacity: 1, weight: 2 }}
      eventHandlers={{ click: handleClick }}
    >
      <Tooltip permanent direction="top" offset={[0, -10]} className="km-label">
        {km} km
      </Tooltip>
      <Popup>
        <strong>{km} km</strong>
        <br />
        {loading ? "Loading..." : (street ?? "Click to load")}
      </Popup>
    </CircleMarker>
  )
}

function FitBounds({ points }: { points: Point[] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length < 2) return
    const lats = points.map((p) => p.lat)
    const lons = points.map((p) => p.lon)
    map.fitBounds(
      [
        [Math.min(...lats), Math.min(...lons)],
        [Math.max(...lats), Math.max(...lons)],
      ],
      { padding: [32, 32] },
    )
  }, [map, points])
  return null
}

function MapHoverTracker({
  points,
  cumDists,
  onHoverDist,
}: {
  points: Point[]
  cumDists: number[]
  onHoverDist: (dist: number | null) => void
}) {
  useMapEvents({
    mousemove(e) {
      const cursor = { lat: e.latlng.lat, lon: e.latlng.lng }
      let nearest = 0
      let minDist = Infinity
      for (let i = 0; i < points.length; i++) {
        const d = haversine(cursor, points[i])
        if (d < minDist) {
          minDist = d
          nearest = i
        }
      }
      onHoverDist(cumDists[nearest] / 1000)
    },
    mouseout() {
      onHoverDist(null)
    },
  })
  return null
}

export default function ActivityMap({ points, onHoverDist, hoverPoint }: Props) {
  const cumDists = useMemo(() => buildCumDists(points), [points])

  if (points.length === 0) {
    return <div className={styles.empty}>No track data</div>
  }

  const center: [number, number] = [points[0].lat, points[0].lon]
  const positions: [number, number][] = points.map((p) => [p.lat, p.lon])
  const markers = kmMarkers(points)

  return (
    <div className={styles.container}>
      <MapContainer center={center} zoom={13} className={styles.map} zoomControl={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Polyline positions={positions} color={"var(--color-accent)"} weight={3} />
        {markers.map(({ point, km }) => (
          <KmMarker key={km} point={point} km={km} />
        ))}
        <FitBounds points={points} />
        {onHoverDist && (
          <MapHoverTracker points={points} cumDists={cumDists} onHoverDist={onHoverDist} />
        )}
        {hoverPoint && (
          <CircleMarker
            center={[hoverPoint.lat, hoverPoint.lon]}
            radius={7}
            pathOptions={{ color: "var(--color-white)", fillColor: "var(--color-hover-dot)", fillOpacity: 1, weight: 2 }}
          />
        )}
      </MapContainer>
    </div>
  )
}
