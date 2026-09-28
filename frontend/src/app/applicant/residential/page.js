import FormSkeleton from "@/components/applicant/form-skeleton";
import ResidentialForm from "@/components/applicant/residential/residential-form";
import { inspectorList } from "@/lib/api/applications/residential/residential-server";
import { Suspense } from "react";
async function ResidentialApplication() {
  const { inspectors } = await inspectorList();
  return <ResidentialForm inspectors={inspectors} />;
}

export default function ResidentialApplicationSkeleton() {
  return (
    <Suspense
      fallback={
        <>
          <FormSkeleton />
        </>
      }
    >
      <ResidentialApplication />
    </Suspense>
  );
}
