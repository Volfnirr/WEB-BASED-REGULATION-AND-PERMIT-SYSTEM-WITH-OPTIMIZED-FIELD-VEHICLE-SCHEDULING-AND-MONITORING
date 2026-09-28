import ApplicationStatusPage from "@/components/applicant/my-applications/status";
import { UserApplicationsSkeleton } from "@/components/applicant/my-applications/status-skeleton";
import Title from "@/components/ui/title";
import { userApplicationsStatus } from "@/lib/api/applications/user-applications-status";
import { Suspense } from "react";

async function ApplicationStatus() {
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

export default function ApplicationSkeleton() {
  return (
    <Suspense
      fallback={
        <>
          <Title
            title="My "
            title2="Application Status"
            title3=""
            description="View all your applications."
          />
          <UserApplicationsSkeleton />
        </>
      }
    >
      <ApplicationStatus />
    </Suspense>
  );
}
