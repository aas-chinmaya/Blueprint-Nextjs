
// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import { useIsMobile } from "@/hooks/use-mobile"
// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   ToggleGroup,
//   ToggleGroupItem,
// } from "@/components/ui/toggle-group"

// export const description = "An interactive area chart for project statistics"

// const chartData = [
//   { date: "2024-04-01", projects: 10, tasks: 25, teams: 5 },
//   { date: "2024-04-02", projects: 8, tasks: 20, teams: 4 },
//   { date: "2024-04-03", projects: 12, tasks: 30, teams: 6 },
//   { date: "2024-04-04", projects: 15, tasks: 35, teams: 7 },
//   { date: "2024-04-05", projects: 18, tasks: 40, teams: 8 },
//   { date: "2024-04-06", projects: 20, tasks: 45, teams: 9 },
//   { date: "2024-04-07", projects: 14, tasks: 30, teams: 6 },
//   { date: "2024-04-08", projects: 22, tasks: 50, teams: 10 },
//   { date: "2024-04-09", projects: 9, tasks: 15, teams: 4 },
//   { date: "2024-04-10", projects: 16, tasks: 35, teams: 7 },
//   { date: "2024-04-11", projects: 19, tasks: 40, teams: 8 },
//   { date: "2024-04-12", projects: 17, tasks: 38, teams: 7 },
//   { date: "2024-04-13", projects: 21, tasks: 45, teams: 9 },
//   { date: "2024-04-14", projects: 13, tasks: 25, teams: 5 },
//   { date: "2024-04-15", projects: 11, tasks: 20, teams: 4 },
//   { date: "2024-04-16", projects: 12, tasks: 22, teams: 5 },
//   { date: "2024-04-17", projects: 24, tasks: 55, teams: 11 },
//   { date: "2024-04-18", projects: 20, tasks: 48, teams: 10 },
//   { date: "2024-04-19", projects: 15, tasks: 30, teams: 6 },
//   { date: "2024-04-20", projects: 10, tasks: 18, teams: 4 },
//   { date: "2024-04-21", projects: 13, tasks: 25, teams: 5 },
//   { date: "2024-04-22", projects: 14, tasks: 28, teams: 6 },
//   { date: "2024-04-23", projects: 12, tasks: 26, teams: 5 },
//   { date: "2024-04-24", projects: 20, tasks: 45, teams: 9 },
//   { date: "2024-04-25", projects: 16, tasks: 35, teams: 7 },
//   { date: "2024-04-26", projects: 9, tasks: 15, teams: 3 },
//   { date: "2024-04-27", projects: 22, tasks: 50, teams: 10 },
//   { date: "2024-04-28", projects: 11, tasks: 20, teams: 4 },
//   { date: "2024-04-29", projects: 18, tasks: 40, teams: 8 },
//   { date: "2024-04-30", projects: 25, tasks: 55, teams: 11 },
//   { date: "2024-05-01", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-05-02", projects: 17, tasks: 38, teams: 8 },
//   { date: "2024-05-03", projects: 15, tasks: 30, teams: 6 },
//   { date: "2024-05-04", projects: 22, tasks: 50, teams: 10 },
//   { date: "2024-05-05", projects: 26, tasks: 60, teams: 12 },
//   { date: "2024-05-06", projects: 28, tasks: 65, teams: 13 },
//   { date: "2024-05-07", projects: 20, tasks: 45, teams: 9 },
//   { date: "2024-05-08", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-05-09", projects: 14, tasks: 30, teams: 6 },
//   { date: "2024-05-10", projects: 17, tasks: 38, teams: 8 },
//   { date: "2024-05-11", projects: 19, tasks: 42, teams: 9 },
//   { date: "2024-05-12", projects: 13, tasks: 28, teams: 6 },
//   { date: "2024-05-13", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-05-14", projects: 25, tasks: 55, teams: 11 },
//   { date: "2024-05-15", projects: 27, tasks: 60, teams: 12 },
//   { date: "2024-05-16", projects: 20, tasks: 45, teams: 9 },
//   { date: "2024-05-17", projects: 28, tasks: 65, teams: 13 },
//   { date: "2024-05-18", projects: 18, tasks: 40, teams: 8 },
//   { date: "2024-05-19", projects: 14, tasks: 30, teams: 6 },
//   { date: "2024-05-20", projects: 11, tasks: 25, teams: 5 },
//   { date: "2024-05-21", projects: 9, tasks: 15, teams: 3 },
//   { date: "2024-05-22", projects: 8, tasks: 12, teams: 2 },
//   { date: "2024-05-23", projects: 15, tasks: 35, teams: 7 },
//   { date: "2024-05-24", projects: 17, tasks: 38, teams: 8 },
//   { date: "2024-05-25", projects: 13, tasks: 30, teams: 6 },
//   { date: "2024-05-26", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-05-27", projects: 23, tasks: 50, teams: 10 },
//   { date: "2024-05-28", projects: 14, tasks: 30, teams: 6 },
//   { date: "2024-05-29", projects: 9, tasks: 15, teams: 3 },
//   { date: "2024-05-30", projects: 19, tasks: 40, teams: 8 },
//   { date: "2024-05-31", projects: 11, tasks: 25, teams: 5 },
//   { date: "2024-06-01", projects: 11, tasks: 25, teams: 5 },
//   { date: "2024-06-02", projects: 26, tasks: 60, teams: 12 },
//   { date: "2024-06-03", projects: 9, tasks: 15, teams: 3 },
//   { date: "2024-06-04", projects: 24, tasks: 55, teams: 11 },
//   { date: "2024-06-05", projects: 8, tasks: 12, teams: 2 },
//   { date: "2024-06-06", projects: 17, tasks: 38, teams: 8 },
//   { date: "2024-06-07", projects: 19, tasks: 42, teams: 9 },
//   { date: "2024-06-08", projects: 22, tasks: 50, teams: 10 },
//   { date: "2024-06-09", projects: 25, tasks: 55, teams: 11 },
//   { date: "2024-06-10", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-06-11", projects: 9, tasks: 15, teams: 3 },
//   { date: "2024-06-12", projects: 27, tasks: 60, teams: 12 },
//   { date: "2024-06-13", projects: 8, tasks: 12, teams: 2 },
//   { date: "2024-06-14", projects: 24, tasks: 55, teams: 11 },
//   { date: "2024-06-15", projects: 18, tasks: 40, teams: 8 },
//   { date: "2024-06-16", projects: 21, tasks: 45, teams: 9 },
//   { date: "2024-06-17", projects: 26, tasks: 60, teams: 12 },
//   { date: "2024-06-18", projects: 10, tasks: 20, teams: 4 },
//   { date: "2024-06-19", projects: 19, tasks: 40, teams: 8 },
//   { date: "2024-06-20", projects: 23, tasks: 50, teams: 10 },
//   { date: "2024-06-21", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-06-22", projects: 18, tasks: 40, teams: 8 },
//   { date: "2024-06-23", projects: 27, tasks: 60, teams: 12 },
//   { date: "2024-06-24", projects: 11, tasks: 20, teams: 4 },
//   { date: "2024-06-25", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-06-26", projects: 24, tasks: 55, teams: 11 },
//   { date: "2024-06-27", projects: 25, tasks: 55, teams: 11 },
//   { date: "2024-06-28", projects: 12, tasks: 25, teams: 5 },
//   { date: "2024-06-29", projects: 9, tasks: 15, teams: 3 },
//   { date: "2024-06-30", projects: 25, tasks: 55, teams: 11 },
// ]

// const chartConfig = {
//   metrics: {
//     label: "Metrics",
//   },
//   projects: {
//     label: "Projects",
//     color: "#16a34a", // Green-600
//   },
//   tasks: {
//     label: "Tasks",
//     color: "#22c55e", // Green-500
//   },
//   teams: {
//     label: "Teams",
//     color: "#4ade80", // Green-400
//   },
// }

// export function ChartAreaInteractive() {
//   const isMobile = useIsMobile()
//   const [timeRange, setTimeRange] = React.useState("90d")

//   React.useEffect(() => {
//     if (isMobile) {
//       setTimeRange("7d")
//     }
//   }, [isMobile])

//   const filteredData = chartData.filter((item) => {
//     const date = new Date(item.date)
//     const referenceDate = new Date("2024-06-30")
//     let daysToSubtract = 90
//     if (timeRange === "30d") {
//       daysToSubtract = 30
//     } else if (timeRange === "7d") {
//       daysToSubtract = 7
//     }
//     const startDate = new Date(referenceDate)
//     startDate.setDate(startDate.getDate() - daysToSubtract)
//     return date >= startDate
//   })

//   return (
//     <Card className="@container/card">
//       <CardHeader>
//         <CardTitle>Project Metrics</CardTitle>
//         <CardDescription>
//           <span className="hidden @[540px]/card:block">
//             Project, task, and team activity for the last 3 months
//           </span>
//           <span className="@[540px]/card:hidden">Last 3 months</span>
//         </CardDescription>
//         <CardAction>
//           <ToggleGroup
//             type="single"
//             value={timeRange}
//             onValueChange={setTimeRange}
//             variant="outline"
//             className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
//             <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
//             <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
//             <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
//           </ToggleGroup>
//           <Select value={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger
//               className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
//               size="sm"
//               aria-label="Select a value">
//               <SelectValue placeholder="Last 3 months" />
//             </SelectTrigger>
//             <SelectContent className="rounded-xl">
//               <SelectItem value="90d" className="rounded-lg">
//                 Last 3 months
//               </SelectItem>
//               <SelectItem value="30d" className="rounded-lg">
//                 Last 30 days
//               </SelectItem>
//               <SelectItem value="7d" className="rounded-lg">
//                 Last 7 days
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </CardAction>
//       </CardHeader>
//       <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
//         <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
//           <AreaChart data={filteredData}>
//             <defs>
//               <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#16a34a" stopOpacity={1.0} />
//                 <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
//               </linearGradient>
//               <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
//                 <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
//               </linearGradient>
//               <linearGradient id="fillTeams" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#4ade80" stopOpacity={0.6} />
//                 <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
//               </linearGradient>
//             </defs>
//             <CartesianGrid vertical={false} />
//             <XAxis
//               dataKey="date"
//               tickLine={false}
//               axisLine={false}
//               tickMargin={8}
//               minTickGap={32}
//               tickFormatter={(value) => {
//                 const date = new Date(value)
//                 return date.toLocaleDateString("en-US", {
//                   month: "short",
//                   day: "numeric",
//                 });
//               }} />
//             <ChartTooltip
//               cursor={false}
//               defaultIndex={isMobile ? -1 : 10}
//               content={
//                 <ChartTooltipContent
//                   labelFormatter={(value) => {
//                     return new Date(value).toLocaleDateString("en-US", {
//                       month: "short",
//                       day: "numeric",
//                     });
//                   }}
//                   indicator="dot" />
//               } />
//             <Area
//               dataKey="teams"
//               type="natural"
//               fill="url(#fillTeams)"
//               stroke="#4ade80"
//               stackId="a" />
//             <Area
//               dataKey="tasks"
//               type="natural"
//               fill="url(#fillTasks)"
//               stroke="#22c55e"
//               stackId="a" />
//             <Area
//               dataKey="projects"
//               type="natural"
//               fill="url(#fillProjects)"
//               stroke="#16a34a"
//               stackId="a" />
//           </AreaChart>
//         </ChartContainer>
//       </CardContent>
//     </Card>
//   );
// }










"use client"

import * as React from "react"
import { useDispatch, useSelector } from "react-redux"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart for project statistics"

const chartConfig = {
  metrics: {
    label: "Metrics",
  },
  projects: {
    label: "Projects",
    color: "#16a34a", // Green-600
  },
  tasks: {
    label: "Tasks",
    color: "#22c55e", // Green-500
  },
  teams: {
    label: "Teams",
    color: "#4ade80", // Green-400
  },
}

// Redux actions
import { fetchTasksByDeadline } from "@/store/features/dashboardSlice";
import { fetchAllProjects } from "@/store/features/fetchallProjectsSlice";
import { fetchAllTeams } from "@/store/features/teamSlice";
import { useEffect, useState } from "react";

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const dispatch = useDispatch();
  
  // Fetch data from Redux store
  const { data: tasksData, error: tasksError, status: tasksStatus } = useSelector(
    (state) => state.dashboard.deadlineTasks?.data || []
  )
  const { projects = [], status: projectStatus } = useSelector(
    (state) => state.fetchallProjects
  )
  const { allTeams, status: teamStatus } = useSelector((state) => state.team)
  
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTasksByDeadline());
    dispatch(fetchAllProjects());
    dispatch(fetchAllTeams());
  }, [dispatch]);

  console.log("Redux Data:", { tasksData, projects, allTeams });

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
  }

  // Helper function to get date range based on timeRange
  const getDateRange = (timeRange) => {
    const endDate = new Date(); // Today
    const startDate = new Date();
    
    switch(timeRange) {
      case "7d":
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(endDate.getDate() - 30);
        break;
      case "90d":
      default:
        startDate.setDate(endDate.getDate() - 90);
        break;
    }
    
    return { startDate, endDate };
  }

  // Process and combine data into chartData format
  const chartData = React.useMemo(() => {
    const { startDate, endDate } = getDateRange(timeRange);
    const dateMap = new Map();

    // Process tasks data
    if (Array.isArray(tasksData)) {
      tasksData.forEach((task) => {
        if (task.createdAt || task.created_at) { // Handle both naming conventions
          const createdAt = task.createdAt || task.created_at;
          const taskDate = new Date(createdAt);
          
          // Filter by date range
          if (taskDate >= startDate && taskDate <= endDate) {
            const formattedDate = formatDate(createdAt);
            const existing = dateMap.get(formattedDate) || { 
              date: formattedDate, 
              tasks: 0, 
              projects: 0, 
              teams: 0 
            };
            dateMap.set(formattedDate, { ...existing, tasks: existing.tasks + 1 });
          }
        }
      });
    }

    // Process projects data
    if (Array.isArray(projects)) {
      projects.forEach((project) => {
        if (project.createdAt || project.created_at) { // Handle both naming conventions
          const createdAt = project.createdAt || project.created_at;
          const projectDate = new Date(createdAt);
          
          // Filter by date range
          if (projectDate >= startDate && projectDate <= endDate) {
            const formattedDate = formatDate(createdAt);
            const existing = dateMap.get(formattedDate) || { 
              date: formattedDate, 
              tasks: 0, 
              projects: 0, 
              teams: 0 
            };
            dateMap.set(formattedDate, { ...existing, projects: existing.projects + 1 });
          }
        }
      });
    }

    // Process teams data
    if (Array.isArray(allTeams)) {
      allTeams.forEach((team) => {
        if (team.createdAt || team.created_at) { // Handle both naming conventions
          const createdAt = team.createdAt || team.created_at;
          const teamDate = new Date(createdAt);
          
          // Filter by date range
          if (teamDate >= startDate && teamDate <= endDate) {
            const formattedDate = formatDate(createdAt);
            const existing = dateMap.get(formattedDate) || { 
              date: formattedDate, 
              tasks: 0, 
              projects: 0, 
              teams: 0 
            };
            dateMap.set(formattedDate, { ...existing, teams: existing.teams + 1 });
          }
        }
      });
    }

    // Convert map to array and sort by date
    const result = Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    console.log("Processed Chart Data:", result);
    return result;
  }, [tasksData, projects, allTeams, timeRange]); // Added timeRange to dependencies

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  // Handle loading and error states
  if (tasksStatus === 'loading' || projectStatus === 'loading' || teamStatus === 'loading') {
    return <div>Loading...</div>
  }

  if (tasksError || projectStatus === 'failed' || teamStatus === 'failed') {
    return <div>Error: {tasksError || 'Failed to load data'}</div>
  }

  // If no data, show a message
  if (chartData.length === 0) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Project Metrics</CardTitle>
          <CardDescription>No data available for the selected time range</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Project Metrics</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
           Recent  Project, task, and team activity
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex">
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillProjects" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={1.0} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTeams" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }} />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot" />
              } />
            <Area
              dataKey="teams"
              type="natural"
              fill="url(#fillTeams)"
              stroke="#4ade80"
              stackId="a" />
            <Area
              dataKey="tasks"
              type="natural"
              fill="url(#fillTasks)"
              stroke="#22c55e"
              stackId="a" />
            <Area
              dataKey="projects"
              type="natural"
              fill="url(#fillProjects)"
              stroke="#16a34a"
              stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}


