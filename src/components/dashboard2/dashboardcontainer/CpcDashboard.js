"use client";
import { SectionCards } from "@/components/dashboard2/section-cards";
import { ChartAreaInteractive } from "@/components/dashboard2/chart-area-interactive";
import { DataTable } from "@/components/dashboard2/data-table";
import {  useSelector } from "react-redux";

export default function CpcDashboard() {



    const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};
const currentUser = {
  role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
 
};


  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable  />
    </>
  );
}
