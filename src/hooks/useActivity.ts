"use client"

import { useEffect, useState } from "react"
import type { ActivityDetailRaw } from "@/app/(auth)/activities/[id]/viewModel"

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: ActivityDetailRaw }

export function useActivity(id: string): State {
  const [state, setState] = useState<State>({ status: "loading" })

  useEffect(() => {
    setState({ status: "loading" })
    fetch(`/api/activities/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Activity not found")
        return res.json() as Promise<ActivityDetailRaw>
      })
      .then((data) => setState({ status: "success", data }))
      .catch((err: unknown) =>
        setState({ status: "error", message: err instanceof Error ? err.message : "Unknown error" })
      )
  }, [id])

  return state
}
