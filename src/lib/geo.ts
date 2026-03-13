export type GeoPoint = { lat: number; lon: number }

const EARTH_RADIUS = 6371000
const toRad = (d: number) => (d * Math.PI) / 180

export function haversine(a: GeoPoint, b: GeoPoint): number {
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h))
}

export function buildCumDists(points: GeoPoint[]): number[] {
  const dists = [0]
  for (let i = 1; i < points.length; i++) {
    dists.push(dists[i - 1] + haversine(points[i - 1], points[i]))
  }
  return dists
}
