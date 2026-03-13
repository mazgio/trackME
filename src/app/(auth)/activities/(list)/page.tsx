import { fetchActivities } from "@/lib/fetchActivities"
import { toActivityViewModel } from "./viewModel"
import ActivityList from "@/components/ActivityList"
import UploadGpxButton from "@/components/UploadGpxButton"
import styles from "./index.module.css"

export default async function ActivitiesPage() {
  const raw = await fetchActivities()
  const activities = raw.map(toActivityViewModel)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Activities</h1>
        <UploadGpxButton />
      </div>
      <ActivityList activities={activities} />
    </div>
  )
}
