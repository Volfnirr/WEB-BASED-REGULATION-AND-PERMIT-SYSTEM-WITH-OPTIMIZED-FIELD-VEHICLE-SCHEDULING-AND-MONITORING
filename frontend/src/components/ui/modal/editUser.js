import { useEffect, useState } from "react";
import { X } from "lucide-react";

export default function EditUser({ open, onClose, user }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } else {
      setForm({
        name: "",
        email: "",
        role: "",
      });
    }
  }, [user, open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: send `form` to backend (id comes from `user.id`, not editable here)
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-xl bg-white">
        <div className="flex items-center justify-between border-b p-4 sm:p-6">
          <h2 className="text-xl font-bold sm:text-2xl">
            {user ? "Edit User" : "Add User"}
          </h2>
          <button onClick={onClose} className="cursor-pointer">
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6"
        >
          {user && (
            <div className="rounded border bg-gray-50 p-3 text-sm text-gray-500">
              <p>User ID: {user.id}</p>
              <p>Date Created: {user.createdAt}</p>
            </div>
          )}

          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded border p-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded border p-3"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded border p-3"
          >
            <option value="">Select Role</option>
            <option value="Applicant">Applicant</option>
            <option value="ApplicantAdmin">ApplicantAdmin</option>
            <option value="VehicleAdmin">VehicleAdmin</option>
            <option value="SuperAdmin">SuperAdmin</option>
          </select>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-5 py-2 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-900"
            >
              {user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
