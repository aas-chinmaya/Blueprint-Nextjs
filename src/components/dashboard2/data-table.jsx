// "use client"

// import * as React from "react"
// import {
//   closestCenter,
//   DndContext,
//   KeyboardSensor,
//   MouseSensor,
//   TouchSensor,
//   useSensor,
//   useSensors,
// } from "@dnd-kit/core";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
// import {
//   arrayMove,
//   SortableContext,
//   useSortable,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
// import {
//   IconChevronDown,
//   IconChevronLeft,
//   IconChevronRight,
//   IconChevronsLeft,
//   IconChevronsRight,
//   IconCircleCheckFilled,
//   IconDotsVertical,
//   IconGripVertical,
//   IconLayoutColumns,
//   IconLoader,
//   IconPlus,
//   IconTrendingUp,
// } from "@tabler/icons-react"
// import {
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
// import { toast } from "sonner"
// import { z } from "zod"

// import { useIsMobile } from "@/hooks/use-mobile"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
// import { Checkbox } from "@/components/ui/checkbox"
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"

// export const schema = z.object({
//   id: z.number(),
//   header: z.string(),
//   type: z.string(),
//   status: z.string(),
//   target: z.string(),
//   limit: z.string(),
//   reviewer: z.string(),
// })

// // Create a separate component for the drag handle
// function DragHandle({
//   id
// }) {
//   const { attributes, listeners } = useSortable({
//     id,
//   })

//   return (
//     <Button
//       {...attributes}
//       {...listeners}
//       variant="ghost"
//       size="icon"
//       className="text-muted-foreground size-7 hover:bg-transparent">
//       <IconGripVertical className="text-muted-foreground size-3" />
//       <span className="sr-only">Drag to reorder</span>
//     </Button>
//   );
// }

// const columns = [
//   {
//     id: "drag",
//     header: () => null,
//     cell: ({ row }) => <DragHandle id={row.original.id} />,
//   },
//   {
//     id: "select",
//     header: ({ table }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={
//             table.getIsAllPageRowsSelected() ||
//             (table.getIsSomePageRowsSelected() && "indeterminate")
//           }
//           onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//           aria-label="Select all" />
//       </div>
//     ),
//     cell: ({ row }) => (
//       <div className="flex items-center justify-center">
//         <Checkbox
//           checked={row.getIsSelected()}
//           onCheckedChange={(value) => row.toggleSelected(!!value)}
//           aria-label="Select row" />
//       </div>
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "header",
//     header: "Header",
//     cell: ({ row }) => {
//       return <TableCellViewer item={row.original} />;
//     },
//     enableHiding: false,
//   },
//   {
//     accessorKey: "type",
//     header: "Section Type",
//     cell: ({ row }) => (
//       <div className="w-32">
//         <Badge variant="task" className="text-muted-foreground px-1.5">
//           {row.original.type}
//         </Badge>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => (
//       <Badge variant="task" className="text-muted-foreground px-1.5">
//         {row.original.status === "Done" ? (
//           <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
//         ) : (
//           <IconLoader />
//         )}
//         {row.original.status}
//       </Badge>
//     ),
//   },
//   {
//     accessorKey: "target",
//     header: () => <div className="w-full text-right">Target</div>,
//     cell: ({ row }) => (
//       <form
//         onSubmit={(e) => {
//           e.preventDefault()
//           toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
//             loading: `Saving ${row.original.header}`,
//             success: "Done",
//             error: "Error",
//           })
//         }}>
//         <Label htmlFor={`${row.original.id}-target`} className="sr-only">
//           Target
//         </Label>
//         <Input
//           className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
//           defaultValue={row.original.target}
//           id={`${row.original.id}-target`} />
//       </form>
//     ),
//   },
//   {
//     accessorKey: "limit",
//     header: () => <div className="w-full text-right">Limit</div>,
//     cell: ({ row }) => (
//       <form
//         onSubmit={(e) => {
//           e.preventDefault()
//           toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
//             loading: `Saving ${row.original.header}`,
//             success: "Done",
//             error: "Error",
//           })
//         }}>
//         <Label htmlFor={`${row.original.id}-limit`} className="sr-only">
//           Limit
//         </Label>
//         <Input
//           className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
//           defaultValue={row.original.limit}
//           id={`${row.original.id}-limit`} />
//       </form>
//     ),
//   },
//   {
//     accessorKey: "reviewer",
//     header: "Reviewer",
//     cell: ({ row }) => {
//       const isAssigned = row.original.reviewer !== "Assign reviewer"

//       if (isAssigned) {
//         return row.original.reviewer
//       }

//       return (
//         <>
//           <Label htmlFor={`${row.original.id}-reviewer`} className="sr-only">
//             Reviewer
//           </Label>
//           <Select>
//             <SelectTrigger
//               className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
//               size="sm"
//               id={`${row.original.id}-reviewer`}>
//               <SelectValue placeholder="Assign reviewer" />
//             </SelectTrigger>
//             <SelectContent align="end">
//               <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//               <SelectItem value="Jamik Tashpulatov">
//                 Jamik Tashpulatov
//               </SelectItem>
//             </SelectContent>
//           </Select>
//         </>
//       );
//     },
//   },
//   {
//     id: "actions",
//     cell: () => (
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             variant="ghost"
//             className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
//             size="icon">
//             <IconDotsVertical />
//             <span className="sr-only">Open menu</span>
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-32">
//           <DropdownMenuItem>Edit</DropdownMenuItem>
//           <DropdownMenuItem>Make a copy</DropdownMenuItem>
//           <DropdownMenuItem>Favorite</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     ),
//   },
// ]

// function DraggableRow({
//   row
// }) {
//   const { transform, transition, setNodeRef, isDragging } = useSortable({
//     id: row.original.id,
//   })

//   return (
//     <TableRow
//       data-state={row.getIsSelected() && "selected"}
//       data-dragging={isDragging}
//       ref={setNodeRef}
//       className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
//       style={{
//         transform: CSS.Transform.toString(transform),
//         transition: transition,
//       }}>
//       {row.getVisibleCells().map((cell) => (
//         <TableCell key={cell.id}>
//           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//         </TableCell>
//       ))}
//     </TableRow>
//   );
// }

// export function DataTable({
//   data: initialData
// }) {
//   const [data, setData] = React.useState(() => initialData)
//   const [rowSelection, setRowSelection] = React.useState({})
//   const [columnVisibility, setColumnVisibility] =
//     React.useState({})
//   const [columnFilters, setColumnFilters] = React.useState([])
//   const [sorting, setSorting] = React.useState([])
//   const [pagination, setPagination] = React.useState({
//     pageIndex: 0,
//     pageSize: 10,
//   })
//   const sortableId = React.useId()
//   const sensors = useSensors(
//     useSensor(MouseSensor, {}),
//     useSensor(TouchSensor, {}),
//     useSensor(KeyboardSensor, {})
//   )

//   const dataIds = React.useMemo(() => data?.map(({ id }) => id) || [], [data])

//   const table = useReactTable({
//     data,
//     columns,
//     state: {
//       sorting,
//       columnVisibility,
//       rowSelection,
//       columnFilters,
//       pagination,
//     },
//     getRowId: (row) => row.id.toString(),
//     enableRowSelection: true,
//     onRowSelectionChange: setRowSelection,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     onPaginationChange: setPagination,
//     getCoreRowModel: getCoreRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   function handleDragEnd(event) {
//     const { active, over } = event
//     if (active && over && active.id !== over.id) {
//       setData((data) => {
//         const oldIndex = dataIds.indexOf(active.id)
//         const newIndex = dataIds.indexOf(over.id)
//         return arrayMove(data, oldIndex, newIndex);
//       })
//     }
//   }

//   return (
//     <Tabs defaultValue="Task" className="w-full flex-col justify-start gap-6">
//       <div className="flex items-center justify-between px-4 lg:px-6">
//         <Label htmlFor="view-selector" className="sr-only">
//           View
//         </Label>
//         <Select defaultValue="task">
//           <SelectTrigger className="flex w-fit @4xl/main:hidden" size="sm" id="view-selector">
//             <SelectValue placeholder="Select a view" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="task">task</SelectItem>
//             <SelectItem value="projects">Projects</SelectItem>
//             <SelectItem value="team">Teams</SelectItem>
//             <SelectItem value="documents">Documents</SelectItem>
//           </SelectContent>
//         </Select>
//         <TabsList
//           className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
//           <TabsTrigger value="task">task</TabsTrigger>
//           <TabsTrigger value="projects">
//             Projects <Badge variant="secondary">3</Badge>
//           </TabsTrigger>
//           <TabsTrigger value="team">
//             Team <Badge variant="secondary">2</Badge>
//           </TabsTrigger>
//           <TabsTrigger value="focus-documents">Documents</TabsTrigger>
//         </TabsList>
//         <div className="flex items-center gap-2">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="task" size="sm">
//                 <IconLayoutColumns />
//                 <span className="hidden lg:inline">Customize Columns</span>
//                 <span className="lg:hidden">Columns</span>
//                 <IconChevronDown />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               {table
//                 .getAllColumns()
//                 .filter((column) =>
//                 typeof column.accessorFn !== "undefined" &&
//                 column.getCanHide())
//                 .map((column) => {
//                   return (
//                     <DropdownMenuCheckboxItem
//                       key={column.id}
//                       className="capitalize"
//                       checked={column.getIsVisible()}
//                       onCheckedChange={(value) =>
//                         column.toggleVisibility(!!value)
//                       }>
//                       {column.id}
//                     </DropdownMenuCheckboxItem>
//                   );
//                 })}
//             </DropdownMenuContent>
//           </DropdownMenu>
        
//         </div>
//       </div>
//       <TabsContent
//         value="task"
//         className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
//         <div className="overflow-hidden rounded-lg border">
//           <DndContext
//             collisionDetection={closestCenter}
//             modifiers={[restrictToVerticalAxis]}
//             onDragEnd={handleDragEnd}
//             sensors={sensors}
//             id={sortableId}>
//             <Table>
//               <TableHeader className="bg-muted sticky top-0 z-10">
//                 {table.getHeaderGroups().map((headerGroup) => (
//                   <TableRow key={headerGroup.id}>
//                     {headerGroup.headers.map((header) => {
//                       return (
//                         <TableHead key={header.id} colSpan={header.colSpan}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(header.column.columnDef.header, header.getContext())}
//                         </TableHead>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableHeader>
//               <TableBody className="**:data-[slot=table-cell]:first:w-8">
//                 {table.getRowModel().rows?.length ? (
//                   <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
//                     {table.getRowModel().rows.map((row) => (
//                       <DraggableRow key={row.id} row={row} />
//                     ))}
//                   </SortableContext>
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={columns.length} className="h-24 text-center">
//                       No results.
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </DndContext>
//         </div>
//         <div className="flex items-center justify-between px-4">
//           <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
//             {table.getFilteredSelectedRowModel().rows.length} of{" "}
//             {table.getFilteredRowModel().rows.length} row(s) selected.
//           </div>
//           <div className="flex w-full items-center gap-8 lg:w-fit">
//             <div className="hidden items-center gap-2 lg:flex">
//               <Label htmlFor="rows-per-page" className="text-sm font-medium">
//                 Rows per page
//               </Label>
//               <Select
//                 value={`${table.getState().pagination.pageSize}`}
//                 onValueChange={(value) => {
//                   table.setPageSize(Number(value))
//                 }}>
//                 <SelectTrigger size="sm" className="w-20" id="rows-per-page">
//                   <SelectValue placeholder={table.getState().pagination.pageSize} />
//                 </SelectTrigger>
//                 <SelectContent side="top">
//                   {[10, 20, 30, 40, 50].map((pageSize) => (
//                     <SelectItem key={pageSize} value={`${pageSize}`}>
//                       {pageSize}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="flex w-fit items-center justify-center text-sm font-medium">
//               Page {table.getState().pagination.pageIndex + 1} of{" "}
//               {table.getPageCount()}
//             </div>
//             <div className="ml-auto flex items-center gap-2 lg:ml-0">
//               <Button
//                 variant="task"
//                 className="hidden h-8 w-8 p-0 lg:flex"
//                 onClick={() => table.setPageIndex(0)}
//                 disabled={!table.getCanPreviousPage()}>
//                 <span className="sr-only">Go to first page</span>
//                 <IconChevronsLeft />
//               </Button>
//               <Button
//                 variant="task"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}>
//                 <span className="sr-only">Go to previous page</span>
//                 <IconChevronLeft />
//               </Button>
//               <Button
//                 variant="task"
//                 className="size-8"
//                 size="icon"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}>
//                 <span className="sr-only">Go to next page</span>
//                 <IconChevronRight />
//               </Button>
//               <Button
//                 variant="task"
//                 className="hidden size-8 lg:flex"
//                 size="icon"
//                 onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                 disabled={!table.getCanNextPage()}>
//                 <span className="sr-only">Go to last page</span>
//                 <IconChevronsRight />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </TabsContent>
//       <TabsContent value="Projects" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//       </TabsContent>
//       <TabsContent value="Teams" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//       </TabsContent>
//       <TabsContent value="documents" className="flex flex-col px-4 lg:px-6">
//         <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
//       </TabsContent>
//     </Tabs>
//   );
// }

// const chartData = [
//   { month: "January", desktop: 186, mobile: 80 },
//   { month: "February", desktop: 305, mobile: 200 },
//   { month: "March", desktop: 237, mobile: 120 },
//   { month: "April", desktop: 73, mobile: 190 },
//   { month: "May", desktop: 209, mobile: 130 },
//   { month: "June", desktop: 214, mobile: 140 },
// ]

// const chartConfig = {
//   desktop: {
//     label: "Desktop",
//     color: "var(--primary)",
//   },

//   mobile: {
//     label: "Mobile",
//     color: "var(--primary)",
//   }
// }

// function TableCellViewer({
//   item
// }) {
//   const isMobile = useIsMobile()

//   return (
//     <Drawer direction={isMobile ? "bottom" : "right"}>
//       <DrawerTrigger asChild>
//         <Button variant="link" className="text-foreground w-fit px-0 text-left">
//           {item.header}
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader className="gap-1">
//           <DrawerTitle>{item.header}</DrawerTitle>
//           <DrawerDescription>
//             Showing total visitors for the last 6 months
//           </DrawerDescription>
//         </DrawerHeader>
//         <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
//           {!isMobile && (
//             <>
//               <ChartContainer config={chartConfig}>
//                 <AreaChart
//                   accessibilityLayer
//                   data={chartData}
//                   margin={{
//                     left: 0,
//                     right: 10,
//                   }}>
//                   <CartesianGrid vertical={false} />
//                   <XAxis
//                     dataKey="month"
//                     tickLine={false}
//                     axisLine={false}
//                     tickMargin={8}
//                     tickFormatter={(value) => value.slice(0, 3)}
//                     hide />
//                   <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
//                   <Area
//                     dataKey="mobile"
//                     type="natural"
//                     fill="var(--color-mobile)"
//                     fillOpacity={0.6}
//                     stroke="var(--color-mobile)"
//                     stackId="a" />
//                   <Area
//                     dataKey="desktop"
//                     type="natural"
//                     fill="var(--color-desktop)"
//                     fillOpacity={0.4}
//                     stroke="var(--color-desktop)"
//                     stackId="a" />
//                 </AreaChart>
//               </ChartContainer>
//               <Separator />
//               <div className="grid gap-2">
//                 <div className="flex gap-2 leading-none font-medium">
//                   Trending up by 5.2% this month{" "}
//                   <IconTrendingUp className="size-4" />
//                 </div>
//                 <div className="text-muted-foreground">
//                   Showing total visitors for the last 6 months. This is just
//                   some random text to test the layout. It spans multiple lines
//                   and should wrap around.
//                 </div>
//               </div>
//               <Separator />
//             </>
//           )}
//           <form className="flex flex-col gap-4">
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="header">Header</Label>
//               <Input id="header" defaultValue={item.header} />
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="type">Type</Label>
//                 <Select defaultValue={item.type}>
//                   <SelectTrigger id="type" className="w-full">
//                     <SelectValue placeholder="Select a type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Table of Contents">
//                       Table of Contents
//                     </SelectItem>
//                     <SelectItem value="Executive Summary">
//                       Executive Summary
//                     </SelectItem>
//                     <SelectItem value="Technical Approach">
//                       Technical Approach
//                     </SelectItem>
//                     <SelectItem value="Design">Design</SelectItem>
//                     <SelectItem value="Capabilities">Capabilities</SelectItem>
//                     <SelectItem value="Focus Documents">
//                       Focus Documents
//                     </SelectItem>
//                     <SelectItem value="Narrative">Narrative</SelectItem>
//                     <SelectItem value="Cover Page">Cover Page</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="status">Status</Label>
//                 <Select defaultValue={item.status}>
//                   <SelectTrigger id="status" className="w-full">
//                     <SelectValue placeholder="Select a status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Done">Done</SelectItem>
//                     <SelectItem value="In Progress">In Progress</SelectItem>
//                     <SelectItem value="Not Started">Not Started</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="target">Target</Label>
//                 <Input id="target" defaultValue={item.target} />
//               </div>
//               <div className="flex flex-col gap-3">
//                 <Label htmlFor="limit">Limit</Label>
//                 <Input id="limit" defaultValue={item.limit} />
//               </div>
//             </div>
//             <div className="flex flex-col gap-3">
//               <Label htmlFor="reviewer">Reviewer</Label>
//               <Select defaultValue={item.reviewer}>
//                 <SelectTrigger id="reviewer" className="w-full">
//                   <SelectValue placeholder="Select a reviewer" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
//                   <SelectItem value="Jamik Tashpulatov">
//                     Jamik Tashpulatov
//                   </SelectItem>
//                   <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </form>
//         </div>
//         <DrawerFooter>
//           <Button>Submit</Button>
//           <DrawerClose asChild>
//             <Button variant="task">Done</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// }


















"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  LucideCalendar,
  LucideUsers,
  LucideFolder,
  LucideLoader2,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-react";

// Redux actions
import { fetchTasksByDeadline } from "@/store/features/dashboardSlice";
import { fetchAllProjects } from "@/store/features/fetchallProjectsSlice";
import { fetchAllTeams } from "@/store/features/teamSlice";

export function DataTable() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("task");
  const [page, setPage] = useState({ task: 1, projects: 1, team: 1 });
  const [openModal, setOpenModal] = useState(null);
  const itemsPerPage = 5;

  // Selectors
  const { data, error, status } = useSelector(
    (state) => state.dashboard.deadlineTasks
  );
  const { projects = [], status: projectStatus } = useSelector(
    (state) => state.fetchallProjects
  );
  const { allTeams, status: teamStatus } = useSelector((state) => state.team);
console.log(projects);
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchTasksByDeadline());
    dispatch(fetchAllProjects());
    dispatch(fetchAllTeams());
  }, [dispatch]);

  // Pagination logic
  const paginate = (items, page) => {
    const start = (page - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  };

  const renderPagination = (totalItems, tab) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    return (
      <div className="flex items-center justify-end gap-4 mt-4 px-4 lg:px-6">
        <span className="text-sm font-medium text-muted-foreground">
          Page {page[tab]} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-green-600 text-white border-green-700 hover:bg-green-700 hover:text-white transition-all duration-200"
            onClick={() => setPage((prev) => ({ ...prev, [tab]: prev[tab] - 1 }))}
            disabled={page[tab] === 1}
          >
            <LucideChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 bg-green-600 text-white border-green-700 hover:bg-green-700 hover:text-white transition-all duration-200"
            onClick={() => setPage((prev) => ({ ...prev, [tab]: prev[tab] + 1 }))}
            disabled={page[tab] === totalPages}
          >
            <LucideChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    );
  };
// Function to get progress percentage based on status
const getProgressValue = (status) => {
  switch (status?.toLowerCase()) {
    case "planned":
      return 0;
    case "in_progress":
      return 50;
    case "completed":
      return 100;
    default:
      return 0;
  }
};
  // Render modal content based on tab and item
  const renderModalContent = (item, type) => {
    if (type === "task") {
      return (
        <div className="grid gap-4 p-4">
          <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
          <p className="text-sm text-muted-foreground">Task ID: {item.task_id}</p>
          <p className="text-sm text-muted-foreground">Project: {item.projectName}</p>
          <p className="text-sm text-muted-foreground">Assigned To: {item.assignedToName}</p>
          <p className="text-sm text-muted-foreground">Priority: {item.priority}</p>
          <p className="text-sm text-muted-foreground">Status: {item.status}</p>
          <p className="text-sm text-muted-foreground">
            Deadline: {new Date(item.deadline).toLocaleDateString()}
          </p>
        </div>
      );
    } else if (type === "project") {
      return (
        <div className="grid gap-4 p-4">
          <h3 className="text-lg font-semibold text-foreground">{item.projectName}</h3>
          <p className="text-sm text-muted-foreground">ID: {item._id}</p>
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Progress</p>
            <Progress
             value={getProgressValue(item.status)}
              // Replace with actual progress data
              className="h-2 bg-muted"
              indicatorClassName="bg-green-600"
            />
          </div>
        </div>
      );
    } else if (type === "team") {
      return (
        <div className="grid gap-4 p-4">
          <h3 className="text-lg font-semibold text-foreground">{item.projectName}</h3>
          <p className="text-sm text-muted-foreground">Project ID: {item.projectId}</p>
          <p className="text-sm text-muted-foreground">Team ID: {item.teamId}</p>
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <h4 className="text-sm font-medium text-foreground mb-2">Team Lead</h4>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">{item.teamLeadName}</span> ({item.teamLeadId})
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.teamMembers.map((member) => (
              <div
                key={member._id}
                className="border border-border rounded-lg p-3 bg-muted/20 hover:bg-muted/50 transition-all duration-200"
              >
                <p className="font-semibold text-foreground">{member.memberName}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
                <p className="text-xs text-muted-foreground">ID: {member.memberId}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="bg-background rounded-xl shadow-sm border border-border overflow-hidden">
        <Tabs
          defaultValue="task"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border ">
            <TabsList className="flex w-full sm:w-auto bg-transparent border border-border rounded-lg p-1">
              <TabsTrigger
                value="task"
                className="flex-1 text-sm font-medium text-foreground data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md py-2 px-3 transition-all duration-200 hover:bg-muted"
              >
                <LucideCalendar className="h-4 w-4 mr-2" /> Tasks
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="flex-1 text-sm font-medium text-foreground data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md py-2 px-3 transition-all duration-200 hover:bg-muted"
              >
                <LucideFolder className="h-4 w-4 mr-2" /> Projects
                <Badge
                  variant="secondary"
                  className="ml-2 bg-muted text-muted-foreground font-medium text-xs"
                >
                  {projects.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="team"
                className="flex-1 text-sm font-medium text-foreground data-[state=active]:bg-green-600 data-[state=active]:text-white rounded-md py-2 px-3 transition-all duration-200 hover:bg-muted"
              >
                <LucideUsers className="h-4 w-4 mr-2" /> Teams
                <Badge
                  variant="secondary"
                  className="ml-2 bg-muted text-muted-foreground font-medium text-xs"
                >
                  {allTeams.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
            <Select defaultValue="task" onValueChange={setActiveTab}>
              <SelectTrigger className="w-32 sm:hidden" size="sm">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Tasks</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="team">Teams</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Content */}
          <div className="p-4 lg:p-6">
            {/* Tasks Tab */}
            <TabsContent value="task" className="mt-0">
              {status === "loading" && (
                <div className="flex items-center justify-center h-40">
                  <LucideLoader2 className="h-6 w-6 animate-spin text-green-600" />
                </div>
              )}
              {status === "failed" && (
                <div className="text-center text-sm text-muted-foreground">
                  Error loading tasks: {error}
                </div>
              )}
              {status === "succeeded" && data?.data?.length > 0 ? (
                <>
                  {paginate(data.data, page.task).map((task) => (
                    <Dialog
                      key={task._id}
                      open={openModal === task._id}
                      onOpenChange={(open) => setOpenModal(open ? task._id : null)}
                    >
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 mb-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <LucideCalendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                {task.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">ID: {task.task_id}</p>
                            </div>
                          </div>
                          <Badge
                            className={
                              task.status === "Completed"
                                ? "bg-green-600 text-white"
                                : "bg-muted text-muted-foreground"
                            }
                          >
                            {task.status}
                          </Badge>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-background border-border rounded-lg max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Task Details</DialogTitle>
                        </DialogHeader>
                        {renderModalContent(task, "task")}
                      </DialogContent>
                    </Dialog>
                  ))}
                  {renderPagination(data.data.length, "task")}
                </>
              ) : (
                status === "succeeded" && (
                  <div className="text-center text-sm text-muted-foreground">
                    No tasks available
                  </div>
                )
              )}
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-0">
              {projectStatus === "loading" && (
                <div className="flex items-center justify-center h-40">
                  <LucideLoader2 className="h-6 w-6 animate-spin text-green-600" />
                </div>
              )}
              {projectStatus === "succeeded" && projects.length > 0 ? (
                <>
                  {paginate(projects, page.projects).map((project) => (
                    <Dialog
                      key={project._id}
                      open={openModal === project._id}
                      onOpenChange={(open) => setOpenModal(open ? project._id : null)}
                    >
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 mb-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <LucideFolder className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                {project.projectName}
                              </h3>
                              <p className="text-xs text-muted-foreground">ID: {project._id}</p>
                            </div>
                          </div>
                          <Progress
                            value={getProgressValue(project.status)} // Replace with actual progress data
                            className="h-2 w-24 bg-muted"
                            indicatorClassName="bg-green-600"
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-background border-border rounded-lg max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Project Details</DialogTitle>
                        </DialogHeader>
                        {renderModalContent(project, "project")}
                      </DialogContent>
                    </Dialog>
                  ))}
                  {renderPagination(projects.length, "projects")}
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No projects found
                </div>
              )}
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="mt-0">
              {teamStatus === "loading" && (
                <div className="flex items-center justify-center h-40">
                  <LucideLoader2 className="h-6 w-6 animate-spin text-green-600" />
                </div>
              )}
              {teamStatus === "succeeded" && allTeams.length > 0 ? (
                <>
                  {paginate(allTeams, page.team).map((team) => (
                    <Dialog
                      key={team._id}
                      open={openModal === team._id}
                      onOpenChange={(open) => setOpenModal(open ? team._id : null)}
                    >
                      <DialogTrigger asChild>
                        <div
                          className="flex items-center justify-between p-4 mb-3 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
                        >
                          <div className="flex items-center gap-4">
                            <LucideUsers className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h3 className="text-sm font-semibold text-foreground">
                                {team.projectName}
                              </h3>
                              <p className="text-xs text-muted-foreground">Team ID: {team.teamId}</p>
                            </div>
                          </div>
                          <Badge className="bg-muted text-muted-foreground">
                            Members: {team.teamMembers.length}
                          </Badge>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="bg-background border-border rounded-lg max-w-lg">
                        <DialogHeader>
                          <DialogTitle className="text-foreground">Team Details</DialogTitle>
                        </DialogHeader>
                        {renderModalContent(team, "team")}
                      </DialogContent>
                    </Dialog>
                  ))}
                  {renderPagination(allTeams.length, "team")}
                </>
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No team members found
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}


















