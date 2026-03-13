import styles from "./index.module.css"

type Props = {
  size?: number
}

export default function Spinner({ size = 16 }: Props) {
  return <span className={styles.spinner} style={{ width: size, height: size }} />
}
