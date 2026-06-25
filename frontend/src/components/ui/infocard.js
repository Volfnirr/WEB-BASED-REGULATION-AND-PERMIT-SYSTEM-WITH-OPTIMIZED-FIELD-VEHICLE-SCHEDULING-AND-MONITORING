export default function InfoCard({ title, label, total, bg }) {
  return (
    <div
      className={`rounded-xl p-4 text-white shadow-md min-w-30 max-w-sm  ${bg}`}
    >
      <div className="flex flex-col gap-2">
        <h2 className="text-sm sm:text-base font-semibold">{label}</h2>
        <p className="text-2xl sm:text-4xl font-bold">{total}</p>
      </div>
    </div>
  );
}
