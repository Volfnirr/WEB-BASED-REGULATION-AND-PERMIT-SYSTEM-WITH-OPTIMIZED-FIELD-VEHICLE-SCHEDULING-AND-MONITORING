import AssignedServices from "@/components/route-protection/check-service";
import { notFound } from "next/navigation";

import ReviewAgricultural from "@/components/review/agricultural/agricultural-review";
import ReviewResidential from "@/components/review/residential/residential-review";
import ReviewTreeCutting from "@/components/review/tree-cutting/tree-cutting-review";
import ReviewChainsawApp from "@/components/review/chainsaw/chainsaw-review";

import { getTreeCuttingFormDataById } from "@/lib/api/applications/tree-cutting/tree-cutting-server";

const serviceConfig = {
  //   agricultural: {
  //     reqServices: [1],
  //     fetchFormData: getAgriculturalFormDataById,
  //     Component: ReviewAgricultural,
  //   },
  //   residential: {
  //     reqServices: [2],
  //     fetchFormData: getResidentialFormDataById,
  //     Component: ReviewResidential,
  //   },
  "tree-cutting": {
    reqServices: [3],
    fetchFormData: getTreeCuttingFormDataById,
    Component: ReviewTreeCutting,
  },
  //   chainsaw: {
  //     reqServices: [4],
  //     fetchFormData: getChainsawFormDataById,
  //     Component: ReviewChainsawApp,
  //   },
};

export default async function ApplicationReview({ params }) {
  const { service, id } = await params;

  const config = serviceConfig[service];
  if (!config) {
    notFound();
  }

  const { reqServices, fetchFormData, Component } = config;

  const data = await fetchFormData(id);
  if (!data) {
    notFound();
  }

  return (
    <div>
      <AssignedServices reqServices={reqServices}>
        <Component data={data} params={id} />
      </AssignedServices>
    </div>
  );
}
