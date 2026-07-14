export default function CardContainer({ title, children }) {
  return (
    <div className="lg:hidden">
      <h1 className="text-lg font-bold  uppercase text-black">{title}</h1>
      {children}
    </div>
  );
}
