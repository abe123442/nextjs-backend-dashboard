import { UserButton, auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import prismadb from "@/lib/prismadb"

import MainNav from "@/components/standalone/main-nav"
import StoreSwitcher from "@/components/standalone/store-switcher"
import { ModeToggle } from "@/components/standalone/theme-switcher"

const Navbar = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect("/login")
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  })

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <StoreSwitcher items={stores} />

        <MainNav className="mx-6" />

        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}

export default Navbar
