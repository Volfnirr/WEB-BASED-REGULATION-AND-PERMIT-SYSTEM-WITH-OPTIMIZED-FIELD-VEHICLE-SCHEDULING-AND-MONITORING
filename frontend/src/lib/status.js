export default function status(status_value) {
  const status_color = [
    {
      status: "Accepted",
      color: "bg-green-500",
    },
    {
      status: "Rejected",
      color: "bg-red-500",
    },
  ];
  return (
    <div>
      {status_color.map((status) => (
        <div key={status.status} className={`pt-2 pb-2`}></div>
      ))}
    </div>
  );
}
