import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id?: string }> },
) {
  const { id } = await context.params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const body: unknown = await req.json()
  if (typeof body !== "object" || body === null || typeof (body as Record<string, unknown>).title !== "string") {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 })
  }

  const title = ((body as Record<string, unknown>).title as string).trim()
  if (!title) return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 })

  const activity = await prisma.activity.update({ where: { id }, data: { title } })
  return NextResponse.json({ id: activity.id, title: activity.title })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id?: string }> },
) {
  const { id } = await context.params
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.activity.delete({ where: { id } })
  return new NextResponse(null, { status: 204 })
}

export async function GET(
  _req: Request,
  context: { params: Promise<{ id?: string }> },
) {
  const { id } = await context.params

  if (!id) {
    return NextResponse.json({ error: "Missing id param" }, { status: 400 })
  }

  const activity = await prisma.activity.findUnique({ where: { id } })

  if (!activity) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({
    id: activity.id,
    title: activity.title,
    sportType: activity.sportType,
    distanceM: activity.distanceM,
    durationS: activity.durationS,
    trackJson: activity.trackJson,
    createdAt: activity.createdAt.toISOString(),
  })
}
