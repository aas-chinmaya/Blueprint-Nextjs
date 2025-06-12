

"use client"

import { useRouter, usePathname } from "next/navigation"
import clsx from "clsx"

export function NavMain({ items }) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="space-y-2 px-2">
      {items.map((item) => {
        const isActive = pathname === item.url

        return (
          <div
            key={item.title}
            onClick={() => router.push(item.url)}
            title={item.title}
            // className={clsx(
            //   "flex items-center gap-3 hover:bg-white hover:text-black  rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
            //   {
            //     "bg-white text-black": isActive, // Active item
                
            //   }
            // )}
             className={clsx(
                  "cursor-pointer group flex gap-2 items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-green-500/30 text-white shadow-md"
                    : "text-green-200 hover:bg-green-500/30 hover:text-white",
                  // collapsed ? "justify-center" : "justify-start"
                )}
          >
            {item.icon && <item.icon className="h-7 w-7" />}
            <span>{item.title}</span>
          </div>
        )
      })}
    </div>
  )
}
