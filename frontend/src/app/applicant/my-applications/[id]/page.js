import ApplicationDetails from "@/components/applicant/my-applications/application-details";
export default async function ApplicationDetailsPage({ params }) {
  const { id } = await params;
  return <ApplicationDetails key={id} id={id} />;
}
