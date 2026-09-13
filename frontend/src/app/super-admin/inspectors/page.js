import InspectorsUI from "@/components/super-admin/inspectors";
import { listAllInspectors } from "@/lib/api/super-admin/super-admin-server";

export default async function Inpsectors() {
  const { list } = await listAllInspectors();
  return (
    <div>
      <InspectorsUI data={list} />
    </div>
  );
}
