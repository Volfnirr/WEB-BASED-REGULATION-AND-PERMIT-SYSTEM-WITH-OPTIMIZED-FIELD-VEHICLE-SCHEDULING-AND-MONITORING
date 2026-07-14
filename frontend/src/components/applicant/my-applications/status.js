import { StatusColor } from "@/lib/status";
export default function ApplicationStatusPage() {
  const data = [
    {
      id: "1",
      service: "Agricultural Free Patent",
      submission_date: "2026-07-01",
      status: "Pending",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
    {
      id: "2",
      service: "Agricultural Free Patent",
      submission_date: "2026-07-01",
      status: "Rejected",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
    {
      id: "3",
      service: "Agricultural Free Patent",
      submission_date: "2026-07-01",
      status: "Pending",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
    {
      id: "4",
      service: "Agricultural Free Patent",
      submission_date: "2026-07-01",
      status: "Rejected",
      remarks:
        "Maecenas dui ante, elementum sed dictum eu, posuere et lectus. Sed vehicula tempus nibh non gravida. Vivamus vestibulum odio odio, vel hendrerit erat vestibulum at. Morbi ut facilisis orci. Duis eget tincidunt urna, vel consequat est. Maecenas nec velit diam. Mauris ornare turpis in odio suscipit, ac vehicula mi blandit. Vivamus ipsum massa, aliquet mattis efficitur sed, posuere nec purus.",
    },
  ];
  return (
    <div>
      {/* Container */}
      <div className="flex flex-col gap-2">
        {data.map((d) => (
          <div
            key={d.id}
            className="flex flex-col gap-2  bg-[#4DAA74] rounded-md px-5 py-5 text-white"
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-md text-green-800">
                  {d.service}
                </span>
                <div className="flex flex-row items-center">
                  <span className="font-medium text-sm">{d.id}</span>
                  <span className="text-sm">•</span>
                  <span className="font-medium text-sm">
                    {d.submission_date}
                  </span>
                </div>
              </div>
              <span className={`${StatusColor(d.status)} rounded-sm px-2`}>
                {d.status}
              </span>
            </div>

            <hr />
            <span className="font-light text-sm">Remarks</span>
            <span>{d.remarks}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
