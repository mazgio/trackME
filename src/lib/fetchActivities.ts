import { prisma } from "@/lib/prisma"
import type { ActivityRaw } from "@/types"

export async function fetchActivities(): Promise<ActivityRaw[]> {
  const raw = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      sportType: true,
      distanceM: true,
      durationS: true,
      createdAt: true,
      trackJson: true,
    },
  })

  return raw.map((activity) => ({
    ...activity,
    createdAt: activity.createdAt.toISOString(),
  }))
}
