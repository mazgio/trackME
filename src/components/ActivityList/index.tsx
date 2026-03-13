import type { ActivityViewModel } from "@/types"
import ActivityCard from "@/components/ActivityCard"
import EmptyState from "@/components/ui/EmptyState"
import styles from "./index.module.css"

type Props = {
  activities: ActivityViewModel[]
}

export default function ActivityList({ activities }: Props) {
  if (activities.length === 0) {
    return <EmptyState message="No activities yet. Upload a GPX file to get started." />
  }

  return (
    <div className={styles.list}>
      {activities.map((activity) => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  )
}
