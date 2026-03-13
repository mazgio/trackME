"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

type State = "idle" | "uploading" | "error"

export function useUploadGpx() {
  const [state, setState] = useState<State>("idle")
  const router = useRouter()

  async function upload(file: File) {
    setState("uploading")
    const form = new FormData()
    form.append("file", file)

    const res = await fetch("/api/activities/import-gpx", { method: "POST", body: form })

    if (!res.ok) {
      setState("error")
      return
    }

    setState("idle")
    router.refresh()
  }

  return { upload, isUploading: state === "uploading", isError: state === "error" }
}
