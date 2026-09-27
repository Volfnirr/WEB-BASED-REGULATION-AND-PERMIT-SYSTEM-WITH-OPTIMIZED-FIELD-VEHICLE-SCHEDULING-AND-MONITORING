import AgriculturalForm from "@/components/applicant/agricultural/agricultural-form";
import FormSkeleton from "@/components/applicant/form-skeleton";
import { inspectorList } from "@/lib/api/applications/residential/residential-server";
import { Suspense } from "react";

async function AgriculturalApplication() {
  const { inspectors } = await inspectorList();

  return <AgriculturalForm inspectors={inspectors} />;
}

export default function AgriculturalApplicationSkeleton() {
  return (
    <Suspense
      fallback={
        <>
          <FormSkeleton />
        </>
      }
    >
      <AgriculturalApplication />
    </Suspense>
  );
}
