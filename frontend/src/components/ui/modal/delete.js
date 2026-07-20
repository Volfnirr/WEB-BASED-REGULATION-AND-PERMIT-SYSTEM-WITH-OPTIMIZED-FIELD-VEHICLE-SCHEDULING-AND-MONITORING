export default function DeleteModal({ data, onClose }) {
  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="text-xl font-bold text-gray-800">
          Delete {data.brand} {data.model}?
        </h1>

        <p className="mt-2 text-gray-600">Plate No: {data.plateNo}</p>
        <p>Type "CONFIRM" to delete</p>
        <input className="w-full rounded border p-3" />
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-300 px-4 py-2 cursor-pointer hover:bg-gray-400"
          >
            Cancel
          </button>

          <button className="rounded-lg bg-red-500 px-4 py-2 cursor-pointer text-white hover:bg-red-900  ">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
