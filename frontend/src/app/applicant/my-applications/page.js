import ApplicationStatusPage from "@/components/applicant/my-applications/status";
import Title from "@/components/ui/title";
import { userApplicationsStatus } from "@/lib/api/applications/user-applications-status";
export default async function ApplicationStatus() {
  const data = await userApplicationsStatus();
  console.log("Application APplication status", data);
  return (
    <div>
      <Title
        title="My "
        title2="Application Status"
        title3=""
        description="View all your applications."
      />
      <ApplicationStatusPage initialData={data} />
    </div>
  );
}
