import InfoCard from "@/components/ui/infocard";
import InfoCardContainer from "@/components/ui/infocardcontainer";

export default function DashboardPage() {
  return (
    <>
      <InfoCardContainer title="Application">
        <InfoCard label="New Applications" total="80" bg="bg-[#0BEA1C]" />
      </InfoCardContainer>
      <InfoCardContainer title="Application">
        <InfoCard label="New Applications" total="80" bg="bg-[#0BEA1C]" />
      </InfoCardContainer>
      <p> Admin Dashboard</p>
    </>
  );
}
