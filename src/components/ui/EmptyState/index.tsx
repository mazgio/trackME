import styles from "./index.module.css"

type Props = {
  message: string
  icon?: React.ReactNode
}

export default function EmptyState({ message, icon }: Props) {
  return (
    <div className={styles.container}>
      {icon}
      <p className={styles.message}>{message}</p>
    </div>
  )
}
