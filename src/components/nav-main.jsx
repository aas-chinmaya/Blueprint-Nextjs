

// "use client"

// import { useRouter, usePathname } from "next/navigation"
// import clsx from "clsx"

// export function NavMain({ items }) {
//   const router = useRouter()
//   const pathname = usePathname()

//   return (
//     <div className="space-y-2 px-2">
//       {items.map((item) => {
//         const isActive = pathname === item.url

//         return (
//           <div
//             key={item.title}
//             onClick={() => router.push(item.url)}
//             title={item.title}
//             // className={clsx(
//             //   "flex items-center gap-3 hover:bg-white hover:text-black  rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer",
//             //   {
//             //     "bg-white text-black": isActive, // Active item
                
//             //   }
//             // )}
//              className={clsx(
//                   "cursor-pointer group flex gap-2 items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
//                   isActive
//                     ? "bg-green-500/30 text-white shadow-md"
//                     : "text-green-200 hover:bg-green-500/30 hover:text-white",
//                   // collapsed ? "justify-center" : "justify-start"
//                 )}
//           >
//             {item.icon && <item.icon className="h-7 w-7" />}
//             <span>{item.title}</span>
//           </div>
//         )
//       })}
//     </div>
//   )
// }






"use client";

import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";
import React, { useState } from "react";
import { IconChevronDown } from "@tabler/icons-react";

export function NavMain({ items }) {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSubItems = (title) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="space-y-2 px-2">
      {items.map((item) => {
        const isActive = pathname === item.url;
        const isExpanded = expandedItems[item.title];

        return (
          <div key={item.title}>
            {/* Top-level navigation item */}
            <div
              className={clsx(
                "cursor-pointer group flex gap-2 items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                isActive
                  ? "bg-green-500/30 text-white shadow-md"
                  : "text-green-200 hover:bg-green-500/30 hover:text-white"
              )}
            >
              <div
                className="flex items-center gap-2 flex-1"
                onClick={() => router.push(item.url)}
                title={item.title}
              >
                {item.icon && <item.icon className="h-7 w-7" />}
                <span>{item.title}</span>
              </div>
              {item.subItems && (
                <IconChevronDown
                  className={clsx(
                    "h-5 w-5 transition-transform duration-200",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )}
                  onClick={() => toggleSubItems(item.title)}
                />
              )}
            </div>
            {/* Sub-navigation items */}
            {item.subItems && isExpanded && (
              <div className="ml-6 mt-1 space-y-1">
                {item.subItems.map((subItem) => {
                  const isSubActive = pathname === subItem.url;
                  return (
                    <div
                      key={subItem.title}
                      onClick={() => router.push(subItem.url)}
                      title={subItem.title}
                      className={clsx(
                        "cursor-pointer flex gap-2 items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                        isSubActive
                          ? "bg-green-500/20 text-white"
                          : "text-green-300 hover:bg-green-500/20 hover:text-white"
                      )}
                    >
                      <span>{subItem.title}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}