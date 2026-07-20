export default function InfoCard({ icon, label, total, bg }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm flex items-center gap-3 flex-1 min-w-[200px] max-w-xs transition-transform hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <span className="block text-sm text-gray-500 truncate">{label}</span>
        <span className="block text-xl sm:text-2xl font-bold text-gray-900 tabular-nums">
          {total}
        </span>
      </div>
    </div>
  );
}
