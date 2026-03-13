"use client"

import { useRouter } from "next/navigation"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import styles from "./index.module.css"

type Props = { activityId: string }

export default function DeleteButton({ activityId }: Props) {
  const router = useRouter()

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    await fetch(`/api/activities/${activityId}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <button className={styles.deleteButton} onClick={handleClick} aria-label="Delete activity">
      <DeleteOutlineIcon fontSize="small" />
    </button>
  )
}
