const statusColors = {
  APPROVED: "bg-[#4daa74] text-green-950 hover:bg-green-600  font-bold",
  REJECTED: "bg-rose-600 text-rose-50 hover:bg-rose-700 font-bold",
  PENDING: "bg-amber-400 text-amber-950 hover:bg-amber-500 font-bold",
  AVAILABLE: "bg-lime-500 text-lime-950 hover:bg-lime-600 font-bold",
  RESERVED: "bg-cyan-500 text-cyan-950 hover:bg-cyan-600 font-bold",
  ACTIVE: "bg-indigo-500 text-indigo-50 hover:bg-indigo-600 font-bold",
  COMPLETED: "bg-slate-700 text-slate-50 hover:bg-slate-800 font-bold",
  UNUSED: "bg-neutral-400 text-neutral-900 hover:bg-neutral-500 font-bold",
  MAINTENANCE: "bg-fuchsia-600 text-fuchsia-50 hover:bg-fuchsia-700 font-bold",
  SELF_ASSIGN: "bg-violet-500 text-violet-100 hover:bg-violet-600 font-bold",
  VIEW: "bg-sky-500 text-sky-950 hover:bg-sky-600 font-bold",
};

export function StatusColor(statusValue) {
  return statusColors[statusValue] || "";
}
