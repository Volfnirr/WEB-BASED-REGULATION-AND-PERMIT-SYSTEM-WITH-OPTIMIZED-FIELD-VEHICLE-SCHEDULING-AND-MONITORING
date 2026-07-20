export default function Title({ title, title2, title3, description }) {
  return (
    <div className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          {title} <span className="text-green-700">{title2}</span>{" "}
          <span className="text-black">{title3}</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
}
