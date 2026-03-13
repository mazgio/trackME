export type ActivityRaw = {
  id: string
  title: string | null
  sportType: string
  distanceM: number | null
  durationS: number | null
  createdAt: string
  trackJson: string | null
}

export type ActivityViewModel = {
  id: string
  title: string
  sportType: string
  distance: string
  duration: string
  date: string
  points: Array<{ lat: number; lon: number }>
}
