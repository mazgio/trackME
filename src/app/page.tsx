import { redirect } from "next/navigation"
import { auth } from "@/app/auth"
import routing from "@/lib/routing"

export default async function IndexPage() {
  const session = await auth()
  if (session) {
    redirect(routing.defaultRoute())
  } else {
    redirect(routing.loginRoute())
  }
}
