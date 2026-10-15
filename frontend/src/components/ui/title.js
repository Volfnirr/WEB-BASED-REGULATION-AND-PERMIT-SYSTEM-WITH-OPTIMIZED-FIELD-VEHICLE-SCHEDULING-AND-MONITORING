export default function Title({ title, title2, title3, description }) {
  return (
    <div className="flex min-w-0 items-center justify-between pb-5">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold leading-9 tracking-[-0.02em] text-[#172033] sm:text-[30px]">
          {title} <span>{title2}</span> <span>{title3}</span>
        </h1>
        <p className="mt-1 text-sm leading-5 text-[#64748B]">{description}</p>
      </div>
    </div>
  );
}
