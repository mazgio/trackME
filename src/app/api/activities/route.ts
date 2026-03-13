import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  const activities = await prisma.activity.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      sportType: true,
      distanceM: true,
      durationS: true,
      createdAt: true,
    },
  })

  return NextResponse.json(activities)
}
