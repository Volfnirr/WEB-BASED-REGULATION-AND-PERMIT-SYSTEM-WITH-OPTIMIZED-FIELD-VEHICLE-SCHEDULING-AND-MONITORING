export default function InfoCardContainer({ title, children }) {
  return (
    <section className="mb-6">
      <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">
        {title}
      </h2>
      <div className="flex flex-wrap gap-4">{children}</div>
    </section>
  );
}
