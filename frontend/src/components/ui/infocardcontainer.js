export default function InfoCardContainer({ title, children }) {
  return (
    // add bg or not ahhhhhhhh bg-green-400  py-4 px-2 rounded-md
    // change text color? green?
    <section className="mb-6 ">
      <h2 className="text-sm font-bold uppercase tracking-wide text-green-700 mb-3">
        {title}
      </h2>
      <div className="flex flex-wrap gap-4">{children}</div>
    </section>
  );
}
