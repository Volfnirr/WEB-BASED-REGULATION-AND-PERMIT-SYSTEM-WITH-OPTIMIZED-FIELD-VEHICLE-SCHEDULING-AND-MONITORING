export function StatusColor(statusValue) {
  const statusColors = {
    Accepted: "bg-green-500",
    Rejected: "bg-red-500 ",
    Pending: "bg-yellow-500 text-orange-900",
    Revision: "bg-orange-500",
    Available: "bg-green-700",
    Reserved: "bg-blue-500",
    Active: "bg-orange-500",
    Completed: "bg-black-500",
    Unused: "bg-gray-500",
    Maintenance: "bg-red-700",
  };

  return statusColors[statusValue] || "";
}
