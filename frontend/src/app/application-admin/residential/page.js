import ScheduleCardValue from "@/components/application-admin/residential/card";
import ResidentialInfo from "@/components/application-admin/residential/residential-info";
import ResidentialTable from "@/components/application-admin/residential/residential-table";
import Title from "@/components/ui/title";

export default function ResidentialApplicationReview() {
  return (
    <div>
      <Title
        title="Manage "
        title2="Residential"
        title3="Applications"
        description="View and manage all Residential Applications."
      />
      <ResidentialInfo />
      <ResidentialTable />
      <ScheduleCardValue />
    </div>
  );
}
