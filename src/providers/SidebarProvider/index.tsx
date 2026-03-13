"use client"

import { createContext, useContext, useState } from "react"

type SidebarContextType = {
  isCollapsed: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggle = () => setIsCollapsed((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextType {
  const sidebarContext = useContext(SidebarContext)
  if (!sidebarContext) throw new Error("useSidebar must be used inside SidebarProvider")
  return sidebarContext
}
