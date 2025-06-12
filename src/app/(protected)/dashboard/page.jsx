import DashboardContainer from "@/components/containers/cpcdashboard";



export default function Page() {
  return (
    <>
     
        <DashboardContainer/>
     
      
    </>
  );
}





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
