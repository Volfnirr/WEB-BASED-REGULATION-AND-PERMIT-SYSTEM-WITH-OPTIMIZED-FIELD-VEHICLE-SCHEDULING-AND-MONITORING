import ReviewAgriFreePatentApp from "@/components/review/agricultural/agricultural-review";
import ReviewChainsawApp from "@/components/review/chainsaw/chainsaw-review";
import ReviewResidential from "@/components/review/residential/residential-review";
import TreeCuttingReview from "@/components/review/tree-cutting/tree-cutting-review";

export default function FieldApplicationStatus() {
  return (
    <>
      <p>My Status</p>
      <ReviewChainsawApp />
      <ReviewResidential />
      <ReviewAgriFreePatentApp />
      <TreeCuttingReview />
    </>
  );
}
