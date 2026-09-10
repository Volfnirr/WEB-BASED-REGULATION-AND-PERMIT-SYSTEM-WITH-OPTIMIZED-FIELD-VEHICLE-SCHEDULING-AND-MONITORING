import AuditLogsUI from "@/components/super-admin/audit-logs";
import { listAllAuditLogs } from "@/lib/api/super-admin/super-admin-server";

export default async function AuditLogs() {
  const { auditLogs } = await listAllAuditLogs();
  return (
    <div>
      <AuditLogsUI data={auditLogs} />
    </div>
  );
}
