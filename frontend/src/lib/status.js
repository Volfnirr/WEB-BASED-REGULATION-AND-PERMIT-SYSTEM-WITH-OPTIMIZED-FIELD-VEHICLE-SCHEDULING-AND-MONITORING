const statusColors = {
  Accepted: "bg-emerald-600 text-white",
  Approved: "bg-emerald-600 text-white",
  Rejected: "bg-red-600 text-white",
  Pending: "bg-amber-500 text-white",
  Revision: "bg-orange-600 text-white",
  Available: "bg-green-700 text-white",
  Reserved: "bg-sky-600 text-white",
  Active: "bg-blue-600 text-white",
  Completed: "bg-zinc-800 text-white",
  Unused: "bg-gray-500 text-white",
  Maintenance: "bg-rose-700 text-white",
};

export function StatusColor(statusValue) {
  return statusColors[statusValue] || "";
}
