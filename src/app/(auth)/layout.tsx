import Sidebar from "@/components/Sidebar"
import MainContent from "@/components/MainContent"
import { SidebarProvider } from "@/providers/SidebarProvider"
import { signOut } from "@/app/auth"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  async function handleSignOut() {
    "use server"
    await signOut({ redirectTo: "/login" })
  }

  return (
    <SidebarProvider>
      <div className="flex">
        <Sidebar onSignOut={handleSignOut} />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  )
}
