"use client"

import { useState, useRef, useEffect } from "react"
import EditIcon from "@mui/icons-material/Edit"
import styles from "./index.module.css"

type Props = {
  activityId: string
  initialTitle: string
  className?: string
}

export default function EditableTitle({ activityId, initialTitle, className }: Props) {
  const [title, setTitle] = useState(initialTitle)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(initialTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  async function save() {
    const trimmed = draft.trim()
    if (!trimmed || trimmed === title) {
      setDraft(title)
      setEditing(false)
      return
    }

    await fetch(`/api/activities/${activityId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: trimmed }),
    })

    setTitle(trimmed)
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") save()
    if (e.key === "Escape") {
      setDraft(title)
      setEditing(false)
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        className={`${styles.input} ${className ?? ""}`}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={handleKeyDown}
      />
    )
  }

  return (
    <button className={`${styles.titleButton} ${className ?? ""}`} onClick={() => setEditing(true)}>
      {title}
      <EditIcon className={styles.editIcon} fontSize="small" />
    </button>
  )
}
