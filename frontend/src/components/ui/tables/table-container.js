export default function TableContainerUI({
  title,
  description,
  date,
  toolbar,
  footer,
  children,
}) {
  return (
    <section className="w-full min-w-0 overflow-hidden rounded-lg border border-[#E1E5E9] bg-white">
      {(title || description || date || toolbar) && (
        <div className="flex min-w-0 flex-col gap-4 border-b border-[#E1E5E9] px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-[#172033]">{title}</h2>
            )}
            {description && (
              <p className="mt-1 text-xs leading-5 text-[#64748B]">
                {description}
              </p>
            )}
            {date && (
              <p className="text-sm font-semibold text-[#52657D]">{date}</p>
            )}
          </div>
          {toolbar && (
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
              {toolbar}
            </div>
          )}
        </div>
      )}
      <div className="min-w-0">{children}</div>
      {footer && (
        <div className="border-t border-[#E1E5E9] px-4 sm:px-5">{footer}</div>
      )}
    </section>
  );
}
