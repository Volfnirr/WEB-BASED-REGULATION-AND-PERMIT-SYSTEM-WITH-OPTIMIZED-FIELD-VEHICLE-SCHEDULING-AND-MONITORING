"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import {
  getAvailableInspectors,
  saveApplicationInspector,
} from "@/lib/api/applications/app-admin-action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const inspectorName = (inspector) =>
  inspector
    ? `${[inspector.firstName, inspector.middleName, inspector.lastName, inspector.extensionName].filter(Boolean).join(" ")} (${inspector.email})`
    : "Not assigned";

export default function InspectorAssignment({
  applicationId,
  status,
  assignedInspector,
  displayName,
  onSaved,
  onBusyChange,
  onDirtyChange,
  reviewSubmitting,
}) {
  const selectId = useId();
  const [inspectors, setInspectors] = useState([]);
  const [selected, setSelected] = useState(
    assignedInspector ? String(assignedInspector) : "",
  );
  const [savedId, setSavedId] = useState(assignedInspector ?? null);
  const [savedName, setSavedName] = useState(displayName || "Not assigned");
  const [loading, setLoading] = useState(status === "PENDING");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (status !== "PENDING") return;
    let active = true;
    getAvailableInspectors()
      .then((result) => {
        if (active) setInspectors(result.inspectors);
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [status, retry]);

  async function save() {
    if (
      status !== "PENDING" ||
      loading ||
      saving ||
      reviewSubmitting ||
      !selected ||
      !dirty
    )
      return;
    setSaving(true);
    onBusyChange(true);
    setError("");
    try {
      const result = await saveApplicationInspector(
        applicationId,
        Number(selected),
      );
      const inspector = inspectors.find(
        (item) => item.id === result.assignedInspector,
      );
      setSavedId(result.assignedInspector);
      setSavedName(
        inspector
          ? inspectorName(inspector)
          : `Inspector #${result.assignedInspector}`,
      );
      onSaved(result.assignedInspector);
      onDirtyChange(false);
      toast.success("Inspector saved");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      onBusyChange(false);
    }
  }

  const dirty = selected !== (savedId ? String(savedId) : "");
  const savedNotAvailable =
    savedId && !inspectors.some((item) => item.id === savedId);

  return (
    <section className="rounded-xl border border-[#E1E5E9] bg-white p-5 text-sm">
      <h2 className="mb-3 font-semibold">Assigned inspector</h2>
      <p className="break-words" aria-live="polite">
        {savedName}
      </p>
      {status === "PENDING" && (
        <div className="mt-4 space-y-3">
          <label htmlFor={selectId} className="block text-xs text-[#52657D]">
            Select inspector
          </label>
          {loading ? (
            <p role="status">Loading inspectors...</p>
          ) : (
            <Select
              value={selected || null}
              disabled={saving || reviewSubmitting || !inspectors.length}
              onValueChange={(value) => {
                const next = value == null ? "" : String(value);
                setSelected(next);
                onDirtyChange(next !== (savedId ? String(savedId) : ""));
              }}
            >
              <SelectTrigger
                id={selectId}
                className="min-h-10 w-full min-w-0 border border-gray-300 bg-white text-sm"
              >
                <SelectValue placeholder="Select an inspector">
                  {selected
                    ? selected === String(savedId) && savedNotAvailable
                      ? `${savedName} (currently unavailable)`
                      : inspectorName(
                          inspectors.find(
                            (item) => String(item.id) === selected,
                          ),
                        )
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {savedNotAvailable && (
                  <SelectItem value={String(savedId)} disabled>
                    {savedName} (currently unavailable)
                  </SelectItem>
                )}
                {inspectors.map((inspector) => (
                  <SelectItem key={inspector.id} value={String(inspector.id)}>
                    {inspectorName(inspector)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {!loading && !inspectors.length && !error && (
            <p>No inspectors are currently available.</p>
          )}
          {error && (
            <p role="alert" className="text-red-600">
              {error}
            </p>
          )}
          {!loading && (
            <button
              type="button"
              className="text-xs underline"
              disabled={saving || reviewSubmitting}
              onClick={() => {
                setError("");
                setLoading(true);
                setRetry((value) => value + 1);
              }}
            >
              Refresh inspector list
            </button>
          )}
          <Button
            type="button"
            onClick={save}
            disabled={
              loading || saving || reviewSubmitting || !selected || !dirty
            }
            className="min-h-10 w-full rounded-lg bg-[#005221] px-4 py-2 text-white hover:bg-[#00451c] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save inspector"}
          </Button>
          <p className="text-xs text-[#52657D]">
            {dirty
              ? "Save your selection before approving."
              : "An inspector must be saved before approval."}
          </p>
        </div>
      )}
    </section>
  );
}
