import ScheduleCardValue from "@/components/application-admin/residential/card";
import ResidentialInfo from "@/components/application-admin/residential/residential-info";
import ResidentialTable from "@/components/application-admin/residential/residential-table";

export default function ResidentialApplicationReview() {
  return (
    <div>
      <ResidentialInfo />
      <ResidentialTable />
      <ScheduleCardValue />
    </div>
  );
}
