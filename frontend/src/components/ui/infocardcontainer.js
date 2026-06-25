export default function InfoCardContainer({ title, children }) {
  return (
    <div className="bg-[#4DAA74] rounded-2xl mb-4 min-w-70 w-full p-4 sm:p-6">
      <h1 className="text-lg font-bold mb-4 uppercase text-white">{title}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {children}
      </div>
    </div>
  );
}
