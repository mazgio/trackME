"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import dynamic from "next/dynamic"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import { useActivity } from "@/hooks/useActivity"
import { toActivityDetailViewModel } from "./viewModel"
import EditableTitle from "@/components/EditableTitle"
import routing from "@/lib/routing"
import styles from "./index.module.css"

const ActivityMap = dynamic(() => import("@/components/ActivityMap"), { ssr: false })

export default function ActivityDetailPage() {
  const { activityId } = useParams<{ activityId: string }>()
  const state = useActivity(activityId)

  if (state.status === "loading") return <div className={styles.loading}>Loading...</div>
  if (state.status === "error") return <div className={styles.error}>{state.message}</div>

  const activity = toActivityDetailViewModel(state.data)

  return (
    <div className={styles.container}>
      <Link href={routing.defaultRoute()} className={styles.back}>
        <ArrowBackIcon fontSize="small" />
        Activities
      </Link>
      <div className={styles.header}>
        <span className={styles.sportType}>{activity.sportType.toUpperCase()}</span>
        <span className={styles.date}>{activity.date}</span>
      </div>
      <EditableTitle activityId={activityId} initialTitle={activity.title} className={styles.title} />

      <div className={styles.stats}>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Distance</p>
          <p className={styles.statValue}>{activity.distance}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Duration</p>
          <p className={styles.statValue}>{activity.duration}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Pace</p>
          <p className={styles.statValue}>{activity.pace}</p>
        </div>
        <div className={styles.stat}>
          <p className={styles.statLabel}>Elevation</p>
          <p className={styles.statValue}>{activity.elevationGain}</p>
        </div>
      </div>

      <ActivityMap points={activity.points} />
    </div>
  )
}
