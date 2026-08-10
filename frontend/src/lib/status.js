const statusColors = {
  ACCEPTED: "bg-emerald-500 text-emerald-950",
  APPROVED: "bg-teal-500 text-teal-950",
  REJECTED: "bg-rose-600 text-rose-50",
  PENDING: "bg-amber-400 text-amber-950",
  REVISION: "bg-orange-500 text-orange-950",
  AVAILABLE: "bg-lime-500 text-lime-950",
  RESERVED: "bg-cyan-500 text-cyan-950",
  ACTIVE: "bg-indigo-500 text-indigo-50",
  COMPLETED: "bg-slate-700 text-slate-50",
  UNUSED: "bg-neutral-400 text-neutral-900",
  MAINTENANCE: "bg-fuchsia-600 text-fuchsia-50",
};

export function StatusColor(statusValue) {
  return statusColors[statusValue] || "";
}
