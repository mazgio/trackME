import Link from "next/link"
import type { ActivityViewModel } from "@/types"
import routing from "@/lib/routing"
import TrackPreview from "@/components/TrackPreview"
import DeleteButton from "./DeleteButton"
import styles from "./index.module.css"

type Props = {
  activity: ActivityViewModel
}

export default function ActivityCard({ activity }: Props) {
  return (
    <Link href={routing.activityRoute(activity.id)} className={styles.card}>
      <div className={styles.body}>
        <div className={styles.header}>
          <span className={styles.sportType}>{activity.sportType}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.date}>{activity.date}</span>
        </div>
        <h2 className={styles.title}>{activity.title}</h2>
        <div className={styles.stats}>
          <div>
            <p className={styles.statLabel}>Distance</p>
            <p className={styles.statValue}>{activity.distance}</p>
          </div>
          <div>
            <p className={styles.statLabel}>Duration</p>
            <p className={styles.statValue}>{activity.duration}</p>
          </div>
        </div>
      </div>
      {activity.points.length >= 2 && (
        <TrackPreview points={activity.points} className={styles.preview} />
      )}
      <DeleteButton activityId={activity.id} />
    </Link>
  )
}
