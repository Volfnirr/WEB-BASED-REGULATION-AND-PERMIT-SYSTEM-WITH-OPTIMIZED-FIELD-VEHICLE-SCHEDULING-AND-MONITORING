import ApplicationStatusPage from "@/components/applicant/my-applications/status";
import Title from "@/components/ui/title";
import { userApplicationsStatus } from "@/lib/api/applications/user-applications-status";
export default async function ApplicationStatus() {
  const { application } = await userApplicationsStatus();
  return (
    <div>
      <Title
        title="My "
        title2="Application Status"
        title3=""
        description="View all your applications."
      />
      <ApplicationStatusPage initialData={application} />
    </div>
  );
}
