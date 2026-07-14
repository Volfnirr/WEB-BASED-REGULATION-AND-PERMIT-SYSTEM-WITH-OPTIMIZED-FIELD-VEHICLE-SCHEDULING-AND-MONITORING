export default function InfoCard({ label, total, bg }) {
  return (
    <div
      className={`rounded-xl p-4 text-white shadow-md min-w-30 max-w-sm ${bg}`}
    >
      <div className="flex flex-col gap-2">
        <span className="text-sm sm:text-base font-semibold">{label}</span>
        <span className="text-2xl sm:text-4xl font-bold">{total}</span>
      </div>
    </div>
  );
}
