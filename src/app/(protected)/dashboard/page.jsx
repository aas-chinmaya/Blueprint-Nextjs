'use client';

import CpcDashboard from '@/components/dashboard2/dashboardcontainer/CpcDashboard';
import EmployeeDashboard from '@/components/dashboard2/dashboardcontainer/EmployeeDashboard';
import { useState } from 'react';

import { useDispatch, useSelector } from "react-redux";





export default function page() {
      const { userData, employeeData, loading: userLoading } = useSelector(state => state.user) || {};


const currentUser = {
  // role: "employee", // Change to 'employee' or 'team_lead' for testing
  role: employeeData?.designation, // Change to 'employee' or 'team_lead' for testing
  name: employeeData?.name,
  teamLeadId: 'TL001', // Set to null for employees without team lead role
};
  return (
    <>
      {currentUser.role === "cpc" ? (
        <CpcDashboard  currentUser={currentUser} />
      ) : (
        <EmployeeDashboard  currentUser={currentUser} />
      )}
    </>
  );
}






// import DashboardContainer from "@/components/containers/cpcdashboard";



// export default function Page() {
//   return (
//     <>
     
//         <DashboardContainer/>
     
      
//     </>
//   );
// }





// 'use client';

// import { useEffect, useState } from 'react';
// import dynamic from 'next/dynamic';

// // Dynamically import only the required dashboard containers
// const CPCDashboardContainer = dynamic(() => import('@/components/containers/CPCDashboardContainer'));
// const EmployeeDashboardContainer = dynamic(() => import('@/components/containers/EmployeeDashboardContainer'));

// export default function DashboardPage() {
//   const [role, setRole] = useState('');

//   useEffect(() => {
//     const roleFromCookie = document.cookie
//       .split('; ')
//       .find(row => row.startsWith('role='))
//       ?.split('=')[1];
//     setRole(roleFromCookie);
//   }, []);

//   if (!role) return <p>Loading...</p>;

//   switch (role) {
//     case 'cpc':
//       return <CPCDashboardContainer />;
//     case 'employee':
//       return <EmployeeDashboardContainer />;
//     case 'pc':
//       return <h1>PC Dashboard</h1>; // Replace with actual PC container if needed
//     case 'teamlead':
//       return <h1>Team Lead Dashboard</h1>; // Replace with actual Team Lead container
//     default:
//       return <p>Unauthorized</p>;
//   }
// }
