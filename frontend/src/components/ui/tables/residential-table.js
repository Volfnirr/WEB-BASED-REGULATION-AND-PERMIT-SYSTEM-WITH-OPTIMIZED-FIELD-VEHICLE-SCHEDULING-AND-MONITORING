export default function ResidentialTableUI({ columns, rows }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((column) => {
              return (
                <th
                  key={column.head}
                  className="border-b px-4 py-2 text-left font-semibold"
                >
                  {column.head}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.request_id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.data} className="border-b px-4 py-2">
                  {row[column.data]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
