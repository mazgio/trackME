"use client"

import { useRef } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import { haversine } from "@/lib/geo"
import styles from "./index.module.css"

type Point = { lat: number; lon: number; ele?: number }

type ChartDatum = { dist: number; ele: number; lat: number; lon: number }

function buildChartData(points: Point[]): ChartDatum[] {
  const data: ChartDatum[] = []
  let accumulated = 0
  for (let i = 0; i < points.length; i++) {
    if (i > 0) accumulated += haversine(points[i - 1], points[i])
    const ele = points[i].ele
    if (ele == null) continue
    data.push({
      dist: Math.round(accumulated) / 1000,
      ele: Math.round(ele),
      lat: points[i].lat,
      lon: points[i].lon,
    })
  }
  if (data.length > 500) {
    const step = Math.ceil(data.length / 500)
    return data.filter((_, i) => i % step === 0)
  }
  return data
}

// YAxis width=38, margin left=0, margin right=8
const YAXIS_W = 38
const MARGIN_RIGHT = 8

type Props = {
  points: Point[]
  activeDist?: number | null
  onHoverPoint?: (pt: { lat: number; lon: number } | null) => void
}

export default function ElevationChart({ points, activeDist, onHoverPoint }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const data = buildChartData(points)
  if (data.length === 0) return null

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!onHoverPoint || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const chartWidth = rect.width - YAXIS_W - MARGIN_RIGHT
    const x = e.clientX - rect.left - YAXIS_W
    const fraction = Math.max(0, Math.min(1, x / chartWidth))
    const idx = Math.min(Math.floor(fraction * data.length), data.length - 1)
    onHoverPoint({ lat: data[idx].lat, lon: data[idx].lon })
  }

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => onHoverPoint?.(null)}
    >
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={data} margin={{ top: 4, right: MARGIN_RIGHT, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="eleGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={"var(--color-accent)"} stopOpacity={0.35} />
              <stop offset="95%" stopColor={"var(--color-accent)"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="dist"
            tickFormatter={(v: number) => `${v.toFixed(1)} km`}
            tick={{ fontSize: 10 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fontSize: 10 }} width={YAXIS_W} tickFormatter={(v: number) => `${v}m`} />
          <Tooltip
            formatter={(v) => [`${v} m`, "Elevation"]}
            labelFormatter={(l) => `${Number(l).toFixed(2)} km`}
          />
          <Area
            type="monotone"
            dataKey="ele"
            stroke={"var(--color-accent)"}
            strokeWidth={1.5}
            fill="url(#eleGrad)"
            dot={false}
          />
          {activeDist != null && (
            <ReferenceLine x={activeDist} stroke={"var(--color-chart-ref)"} strokeWidth={1.5} strokeDasharray="4 2" />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
