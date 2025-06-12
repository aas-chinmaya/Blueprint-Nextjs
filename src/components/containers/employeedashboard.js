import { SectionCards } from "@/components/dashbaord2/section-cards";
import { ChartAreaInteractive } from "@/components/dashbaord2/chart-area-interactive";
import { DataTable } from "@/components/dashbaord2/data-table";
import data from "./data.json";

export default function EmployeeContainer() {
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
