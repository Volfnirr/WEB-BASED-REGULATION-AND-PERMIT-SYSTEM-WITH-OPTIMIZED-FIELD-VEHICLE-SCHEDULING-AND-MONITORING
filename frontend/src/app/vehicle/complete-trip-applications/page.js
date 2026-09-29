// //import { TableSkeleton } from "@/components/application-admin/services-dashboard/services-table-skeleton";
// import Title from "@/components/ui/title";
// import AllTripApplicationsUI from "@/components/vehicle-admin/all-trip-applications/manage-all-trip-applications";
// import CompleteTripApplicationInfo from "@/components/vehicle-admin/all-trip-applications/complete-trip-info";
// import CompleteTripApplicationTable from "@/components/vehicle-admin/complete-trip-ticket/complete-trip-applications-table";
// import {
//   completedTripTicketsList,
//   completedTripTicketsStatus,
// } from "@/lib/api/vehicle/vehicle-server";
// import { Suspense } from "react";

// async function CompletedApplications() {
//   console.log("IM HERE 1");
//   const { completedtripticketlist } = await completedTripTicketsList();
//   console.log("IM HERE 2");
//   const { status } = await completedTripTicketsStatus();
//   console.log("IM HERE 3");
//   return (
//     <div>
//       <AllTripApplicationsUI />
//       <CompleteTripApplicationInfo status={status} />
//       <CompleteTripApplicationTable initialData={completedtripticketlist} />
//     </div>
//   );
// }

// export default function CompleteTripApplicationsSkeleton() {
//   return (
//     <Suspense
//       fallback={
//         <>
//           <Title
//             title="Manage Complete"
//             title2="Trip Ticket"
//             description="View and manage complete trip applications."
//           />
//           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="flex h-[116px] items-center gap-4 rounded-[20px] bg-white p-6 shadow-sm"
//               >
//                 <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
//                 <div className="space-y-2">
//                   <div className="h-5 w-28 animate-pulse rounded bg-muted" />
//                   <div className="h-8 w-12 animate-pulse rounded bg-muted" />
//                 </div>
//               </div>
//             ))}
//           </div>
//           {/* <TableSkeleton /> */}
//         </>
//       }
//     >
//       <CompletedApplications />
//     </Suspense>
//   );
// }
import { redirect } from "next/navigation";
export default function CompletedApplications() {
  return redirect("vehicle/dashboard");
}
