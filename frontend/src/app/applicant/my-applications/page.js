"use client";

import { useQuery } from "@tanstack/react-query";
import ApplicationStatusPage from "@/components/applicant/my-applications/status";
import { UserApplicationsSkeleton } from "@/components/applicant/my-applications/status-skeleton";
import Title from "@/components/ui/title";
import { useUser } from "@/lib/context/account-info-context";
import { userApplicationsStatus } from "@/lib/api/applications/user-applications-status";

export default function MyApplicationsPage() {
  const { user, isPending: isUserPending } = useUser();

  const applicationsQuery = useQuery({
    queryKey: ["my-applications", user?.id],
    queryFn: userApplicationsStatus,
    enabled: Boolean(user?.id),
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });

  if (isUserPending || applicationsQuery.isPending) {
    return (
      <>
        <Title
          title="My "
          title2="Application Status"
          description="View all your applications."
        />
        <UserApplicationsSkeleton />
      </>
    );
  }

  if (applicationsQuery.isError && !applicationsQuery.data) {
    return (
      <>
        <Title
          title="My "
          title2="Application Status"
          description="View all your applications."
        />
        <p className="text-sm text-red-600" role="alert">
          {applicationsQuery.error.message}
        </p>
      </>
    );
  }

  return (
    <div>
      <Title
        title="My "
        title2="Application Status"
        description="View all your applications."
      />

      {applicationsQuery.isError && (
        <p className="mb-3 text-sm text-amber-700" role="status">
          Could not refresh your applications. Showing the last loaded results.
        </p>
      )}

      {applicationsQuery.isFetching && (
        <p className="mb-3 text-xs text-gray-500" role="status">
          Checking for status updates…
        </p>
      )}

      <ApplicationStatusPage initialData={applicationsQuery.data ?? []} />
    </div>
  );
}
