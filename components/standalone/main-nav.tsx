"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export default function MainNav({ className }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const params = useParams()

  const storeId = params.storeId.toString()
  const routeLabels = [
    "Billboards",
    "Categories",
    "Sizes",
    "Colours",
    "Products",
    "Orders",
    "Settings",
  ]

  const routes = [
    {
      href: `/${storeId}`,
      label: "Overview",
      active: pathname === `/${storeId}`,
    },
  ]

  routes.push(
    ...routeLabels.map((label) => ({
      label,
      href: `/${storeId}/${label.toLowerCase()}`,
      active: pathname.startsWith(`/${storeId}/${label.toLowerCase()}`),
    }))
  )

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map((r) => (
        <Link
          key={r.href}
          href={r.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            r.active ? "text-black dark:text-white" : "text-muted-foreground"
          )}
        >
          {r.label}
        </Link>
      ))}
    </nav>
  )
}
