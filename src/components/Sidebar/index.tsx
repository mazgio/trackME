"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun"
import PersonIcon from "@mui/icons-material/Person"
import MenuOpenIcon from "@mui/icons-material/MenuOpen"
import MenuIcon from "@mui/icons-material/Menu"
import classNames from "classnames"
import routing from "@/lib/routing"
import { useSidebar } from "@/providers/SidebarProvider"
import SignOutButton from "@/components/SignOutButton"
import styles from "./index.module.css"

const links = [
  { href: routing.defaultRoute(), label: "Activities", icon: <DirectionsRunIcon fontSize="small" /> },
  { href: routing.profileRoute(), label: "Profile", icon: <PersonIcon fontSize="small" /> },
]

type Props = {
  onSignOut: () => void
}

export default function Sidebar({ onSignOut }: Props) {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()

  return (
    <aside className={classNames(styles.sidebar, { [styles.collapsed]: isCollapsed })}>
      <div className={classNames(styles.header, { [styles.headerCollapsed]: isCollapsed })}>
        {!isCollapsed && <span className={styles.logo}>TrackME</span>}
        <button className={styles.toggleButton} onClick={toggle}>
          {isCollapsed ? <MenuIcon fontSize="small" /> : <MenuOpenIcon fontSize="small" />}
        </button>
      </div>
      <nav className={styles.nav}>
        {links.map(({ href, label, icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={classNames(styles.link, {
                [styles.linkActive]: isActive,
                [styles.linkCollapsed]: isCollapsed,
              })}
            >
              {icon}
              {!isCollapsed && label}
            </Link>
          )
        })}
      </nav>
      <div className={styles.footer}>
        <SignOutButton isCollapsed={isCollapsed} onSignOut={onSignOut} />
      </div>
    </aside>
  )
}
