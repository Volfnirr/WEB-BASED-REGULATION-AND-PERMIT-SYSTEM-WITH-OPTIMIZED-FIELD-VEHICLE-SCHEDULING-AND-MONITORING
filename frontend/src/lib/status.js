const statusColors = {
  //APPLICATION
  // prettier-ignore

  APPROVED:"bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold",
  REJECTED: "bg-rose-50 text-rose-700 border border-rose-200 font-bold",
  PENDING: "bg-orange-50 text-orange-700 border border-orange-200 font-bold",
  SELF_ASSIGN: "bg-violet-500 text-violet-100 hover:bg-violet-600 font-bold",
  VIEW: "bg-sky-500 text-sky-950 hover:bg-sky-600 font-bold",

  //VEHICLE
  AVAILABLE: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  RESERVED: "bg-blue-50 text-blue-700 border border-blue-200",
  MAINTENANCE: "bg-purple-50 text-purple-700 border border-purple-200",
  NOT_AVAILABLE: "bg-red-50 text-red-700 border border-red-200",
  UNUSED: "bg-gray-100 text-gray-600 ring-1 ring-gray-200",
  EDIT: "bg-sky-500 text-sky-950 hover:bg-sky-600 font-bold",

  //TRIP-TICKET
  ACTIVE: "bg-indigo-500 text-indigo-50 hover:bg-indigo-600 font-bold",
  COMPLETED: "bg-slate-700 text-slate-50 hover:bg-slate-800 font-bold",
};

export function StatusColor(statusValue) {
  return statusColors[statusValue] || "";
}
