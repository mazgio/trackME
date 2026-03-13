"use client"

import LogoutIcon from "@mui/icons-material/Logout"
import classNames from "classnames"
import styles from "./index.module.css"

type Props = {
  isCollapsed: boolean
  onSignOut: () => void
}

export default function SignOutButton({ isCollapsed, onSignOut }: Props) {
  return (
    <button
      className={classNames(styles.button, { [styles.buttonCollapsed]: isCollapsed })}
      onClick={onSignOut}
    >
      <LogoutIcon fontSize="small" />
      {!isCollapsed && <span>Sign out</span>}
    </button>
  )
}
