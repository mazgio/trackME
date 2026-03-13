"use client"

import classNames from "classnames"
import { useSidebar } from "@/providers/SidebarProvider"
import styles from "./index.module.css"

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <main className={classNames(styles.main, { [styles.collapsed]: isCollapsed })}>
      {children}
    </main>
  )
}
