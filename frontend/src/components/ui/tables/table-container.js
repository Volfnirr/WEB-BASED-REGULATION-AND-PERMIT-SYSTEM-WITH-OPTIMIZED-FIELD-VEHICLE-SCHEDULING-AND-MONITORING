export default function TableContainerUI({ title, date, children }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col justify-between gap-2 lg:flex-row lg:items-center">
        <p className="text-md font-bold">{title}</p>
        <p className="text-md font-bold">{date}</p>
      </div>

      <div>{children}</div>
    </div>
  );
}
