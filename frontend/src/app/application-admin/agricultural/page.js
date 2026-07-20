import AgriculturallInfo from "@/components/application-admin/agricultural/agricultural-info";
import AgriculturalTable from "@/components/application-admin/agricultural/agricultural-table";
import Title from "@/components/ui/title";

export default function AgriculturalApplicationReview() {
  return (
    <div>
      <Title
        title="Manage "
        title2="Agricultural"
        title3="Applications"
        description="View and manage all Agricultural Applications."
      />
      <AgriculturallInfo />
      <AgriculturalTable />
    </div>
  );
}
