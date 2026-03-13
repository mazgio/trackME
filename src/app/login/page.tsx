import { signIn } from "@/app/auth"
import routing from "@/lib/routing"
import styles from "./index.module.css"

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>TrackME</h1>
        <p className={styles.subtitle}>Track your activities</p>

        <div className={styles.actions}>
          <form
            action={async () => {
              "use server"
              await signIn("google", { redirectTo: routing.defaultRoute() })
            }}
          >
            <button className={styles.oauthButton} type="submit">
              Continue with Google
            </button>
          </form>

          <form
            action={async () => {
              "use server"
              await signIn("github", { redirectTo: routing.defaultRoute() })
            }}
          >
            <button className={styles.oauthButton} type="submit">
              Continue with GitHub
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
