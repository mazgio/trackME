import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// Next App Router: per leggere FormData (multipart) va bene così.
// Nota: userId hardcoded per MVP (poi mettiamo auth vera).
export async function POST(req: Request) {
  const form = await req.formData()
  const file = form.get("file")

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Missing "file"' }, { status: 400 })
  }

  const gpxText = await file.text()

  // Parsing GPX super semplice (MVP): leggiamo i punti <trkpt lat=".." lon="..">
  const trackPointRegex =
    /<trkpt[^>]*lat="([^"]+)"[^>]*lon="([^"]+)"[^>]*>([\s\S]*?)<\/trkpt>/g
  const eleRegex = /<ele>([^<]+)<\/ele>/
  const timeRegex = /<time>([^<]+)<\/time>/

  const points: Array<{ lat: number; lon: number; ele?: number; time?: number }> = []
  const timestamps: number[] = []
  let match: RegExpExecArray | null

  while ((match = trackPointRegex.exec(gpxText)) !== null) {
    const lat = Number(match[1])
    const lon = Number(match[2])
    const inner = match[3] ?? ""
    const eleMatch = eleRegex.exec(inner)
    const ele = eleMatch ? Number(eleMatch[1]) : undefined
    const timeMatch = timeRegex.exec(inner)

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      let time: number | undefined
      if (timeMatch) {
        const t = Date.parse(timeMatch[1])
        if (!Number.isNaN(t)) {
          time = t
          timestamps.push(t)
        }
      }
      points.push({ lat, lon, ele: Number.isFinite(ele) ? ele : undefined, time })
    }
  }

  if (points.length < 2) {
    return NextResponse.json(
      { error: "GPX has too few track points" },
      { status: 400 },
    )
  }

  // Haversine distance (metri)
  const R = 6371000
  const toRad = (d: number) => (d * Math.PI) / 180

  let distanceM = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    const dLat = toRad(b.lat - a.lat)
    const dLon = toRad(b.lon - a.lon)
    const lat1 = toRad(a.lat)
    const lat2 = toRad(b.lat)

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2

    distanceM += 2 * R * Math.asin(Math.sqrt(h))
  }

  const { auth } = await import("@/app/auth")
  const session = await auth()

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { email: session.user.email } })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const durationS =
    timestamps.length >= 2
      ? Math.round((timestamps[timestamps.length - 1] - timestamps[0]) / 1000)
      : null

  const activity = await prisma.activity.create({
    data: {
      userId: user.id,
      sportType: "run",
      title: file.name.replace(/\.(gpx)$/i, "") || "Imported activity",
      distanceM: Math.round(distanceM),
      durationS,
      trackJson: JSON.stringify(points),
      createdAt: timestamps.length > 0 ? new Date(timestamps[0]) : undefined,
    },
  })

  return NextResponse.json({
    activityId: activity.id,
    points: points.length,
    distanceM: activity.distanceM,
  })
}
