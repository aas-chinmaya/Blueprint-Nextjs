"use client";
import { SectionCardEmployee } from "@/components/dashboard2/section-cards";
import {  ChartAreaInteractiveEmployee } from "@/components/dashboard2/chart-area-interactive";
import { DataTable } from "@/components/dashboard2/data-table";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProjects } from "@/store/features/fetchallProjectsSlice";
import { getAllTaskList } from "@/store/features/TaskSlice";
export default function EmployeeDashboard() {
  const dispatch = useDispatch();

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
    dispatch(fetchAllProjects());
    dispatch(getAllTaskList());
  }, [dispatch]);
  console.log("All Tasks:", allTaskList);
  return (
    <>
    
      <SectionCardEmployee />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractiveEmployee />
      </div>
      <DataTable  />
    </>
  );
}
