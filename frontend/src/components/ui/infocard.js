"use client";
export default function InfoCard({ departmentName, description, bg }) {
  return (
    <div
      className={`grid justify-center-safe items-center rounded-xl border-4  my-3  max-w-28  min-w-74 gap-2 py-4 ${bg} border-[#0048ad]`}
    >
      <div className="grid gap-4 ml-4 mr-4">
        <h1 className="text-xl font-bold">{departmentName}</h1>
        <p className="line-clamp-5 ">{description}</p>
      </div>
    </div>
  );
}
