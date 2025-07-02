
"use client";

import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux"; // ⬅️ for accessing Redux state

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconPhoneCall,
  IconCalendarEvent,
  IconUser,
  IconFolder,
  IconChecklist,
  IconUsers,
  IconBug,
  IconReportAnalytics,
} from "@tabler/icons-react";

// Full nav config
const fullNavData = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Contact",
    url: "/contact",
    icon: IconPhoneCall,
  },
  {
    title: "Meeting",
    url: "#",
    icon: IconCalendarEvent,
    subItems: [
      {
        title: "All Meetings",
        url: "/meetings/all",
      },
      {
        title: "Calendar",
        url: "/meetings/calendar",
      },
      {
        title: "Scheduled",
        url: "/meetings/scheduled",
      },
      {
        title: "Mom Cause",
        url: "/meetings/cause",
      },
    ],
  },
  {
    title: "Master",
    url: "#",
    icon: IconCalendarEvent,
    subItems: [
      {
        title: "Service",
        url: "/master/services",
      },
      {
        title: "Industry",
        url: "/master/industry",
      },
      {
        title: "Meeting Slots",
        url: "/master/slots",
      },
    ],
  },
  {
    title: "Quotation",
    url: "/quotation",
    icon: IconBug,
  },
  {
    title: "Client",
    url: "/client",
    icon: IconUser,
  },
  {
    title: "Project",
    url: "/project",
    icon: IconFolder,
  },
  {
    title: "Task",
    url: "/task",
    icon: IconChecklist,
  },
  {
    title: "Team",
    url: "/team",
    icon: IconUsers,
  },
  // Optional future sections:
  // {
  //   title: "Report",
  //   url: "/report",
  //   icon: IconReportAnalytics,
  // },
];

export function AppSidebar(props) {
  const { employeeData } = useSelector((state) => state.user) || {};
  const userRole = employeeData?.designation;

  // Role-based filtering
  const navdata =
    userRole === "cpc"
      ? fullNavData
      : fullNavData.filter((item) =>
          ["Dashboard", "Project", "Task", "Team"].includes(item.title)
        );

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex items-center space-x-2">
            <Image
              src="/logo.png"
              alt="AAS BluePrint Logo"
              width={60}
              height={60}
              className="rounded-sm"
              priority
              quality={100}
            />
            <span className="text-base font-semibold">BluePrint</span>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navdata} />
      </SidebarContent>
    </Sidebar>
  );
}
