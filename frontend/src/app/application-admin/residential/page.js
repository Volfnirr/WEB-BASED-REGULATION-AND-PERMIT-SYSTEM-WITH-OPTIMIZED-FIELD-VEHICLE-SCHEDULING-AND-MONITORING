import ScheduleCardValue from "@/components/application-admin/residential/card";
import ResidentialInfo from "@/components/application-admin/residential/residential-info";
import ResidentialTable from "@/components/application-admin/residential/residential-table";
import AssignedServices from "@/components/route-protection/check-service";
import Title from "@/components/ui/title";

export default function ResidentialApplicationReview() {
  return (
    <div>
      <AssignedServices reqServices={[2]}>
        <Title
          title="Manage "
          title2="Residential"
          title3="Applications"
          description="View and manage all Residential Applications."
        />
        <ResidentialInfo />
        <ResidentialTable />
        <ScheduleCardValue />
      </AssignedServices>
    </div>
  );
}
