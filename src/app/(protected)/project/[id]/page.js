// 'use client';


// import ViewProjectById from '@/components/project/ViewProjectById';



// export default function Page({ params }) {
//   return (
//     <>
//       <div className="px-4 lg:px-6">
// <ViewProjectById projectId={params.id} />
        
//       </div>
//     </>
//   );
// }





'use client';

import { use } from 'react';
import ViewProjectById from '@/components/project/ViewProjectById';

export default function Page({ params }) {
  const resolvedParams = use(params); // Unwrap the params Promise
  return (
    <>
      <div className="px-4 lg:px-6">
        <ViewProjectById projectId={resolvedParams.id} />
      </div>
    </>
  );
}