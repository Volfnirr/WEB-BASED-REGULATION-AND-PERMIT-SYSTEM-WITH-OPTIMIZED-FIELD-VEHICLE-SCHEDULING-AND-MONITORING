import ApplicationStatusPage from "@/components/applicant/my-applications/status";
import Title from "@/components/ui/title";

export default function ApplicationStatus() {
  return (
    <div>
      <Title
        title="My "
        title2="Application Status"
        title3=""
        description="View all your applications."
      />
      <ApplicationStatusPage />
    </div>
  );
}
