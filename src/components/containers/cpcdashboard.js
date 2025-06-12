"use client";
import { SectionCards } from "@/components/dashbaord2/section-cards";
import { ChartAreaInteractive } from "@/components/dashbaord2/chart-area-interactive";
import { DataTable } from "@/components/dashbaord2/data-table";
import data from "./data.json";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { Chart } from "@/components/ui/chart";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects } from "@/store/features/fetchallProjectsSlice";
import { getAllTaskList } from "@/store/features/TaskSlice";
export default function DashboardContainer() {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { projects, status, error } = useSelector(
    (state) => state.fetchallProjects
  );
    const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};
const currentUser = {
  role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
 
};

const { allTaskList } = useSelector((state) => state.task);
  console.log("Projects:", projects);

  useEffect(() => {
    toast({
      title: "Welcome back!",
      description: "You have 3 tasks due today",
    });
  }, []);
  useEffect(() => {
    dispatch(fetchAllProjects());
    dispatch(getAllTaskList());
  }, [dispatch]);
  console.log("All Tasks:", allTaskList);
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
