import { StatusColor } from "@/lib/status";
import Link from "next/link";

export default function ScheduleCardInfo({
  name,
  reqid,
  date,
  status,
  serviceName,
  plateno,
  link,
}) {
  return (
    <div className="p-4 mt-2 bg-white border rounded-lg shadow-sm hover:shadow-md transition lg:hidden">
      <h1 className="text-base font-semibold text-gray-900">{name}</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-gray-600 mt-2">
        <span className="font-medium text-blue-500">#{reqid}</span>
        <span>{serviceName}</span>
        <span>{plateno}</span>
        <span className="sm:ml-auto">{date}</span>
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t">
        <span
          className={`${StatusColor(status)} px-2 py-1 rounded-lg  text-xs font-semibold`}
        >
          {status}
        </span>
        <Link
          href={`${link + reqid}`}
          className="bg-blue-500 text-white text-sm px-3 py-1 rounded-md hover:bg-blue-600 transition"
        >
          View
        </Link>
      </div>
    </div>
  );
}
