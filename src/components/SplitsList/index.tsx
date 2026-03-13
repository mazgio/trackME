import type { KmSplit } from "@/app/(auth)/activities/[activityId]/viewModel"
import styles from "./index.module.css"

type Props = { splits: KmSplit[] }

export default function SplitsList({ splits }: Props) {
  if (splits.length === 0) return null

  return (
    <div className={styles.scroll}>
      {splits.map(({ km, pace }) => (
        <div key={km} className={styles.card}>
          <span className={styles.km}>{km} km</span>
          <span className={styles.pace}>{pace}</span>
        </div>
      ))}
    </div>
  )
}
