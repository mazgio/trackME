import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST() {
  const u = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: { email: "test@example.com", name: "Test" },
  })

  return NextResponse.json(u)
}
