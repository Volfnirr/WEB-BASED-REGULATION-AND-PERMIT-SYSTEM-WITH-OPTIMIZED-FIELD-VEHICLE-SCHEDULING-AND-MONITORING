"use client";

import { Controller, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROVINCES,
  DEFAULT_PROVINCE,
  getMunicipalities,
  getBarangays,
} from "@/lib/data/ph-address";

/**
 * Cascading Province / Municipality / Barangay dropdowns for React Hook Form.
 *
 * - Province defaults to Pampanga and is locked (single-province dataset for now;
 *   add more provinces to lib/data/ph-address.js and this will list them automatically).
 * - Selecting a municipality/city loads its barangays and resets any previously
 *   selected barangay that no longer belongs to it.
 *
 * Uses `useWatch` (scoped to this component) rather than the top-level `watch`
 * from useForm, so the municipality/barangay dropdowns update immediately and
 * reliably — passing `watch` down as a prop and calling it here does NOT
 * guarantee this component re-renders when the value changes, since that
 * subscription lives on whichever component originally called useForm().
 *
 * Usage:
 *   <AddressFields control={control} setValue={setValue} errors={errors} />
 */
export default function AddressFields({
  control,
  setValue,
  errors = {},
  names = {},
  inputClass = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm text-gray-800 placeholder-gray-400 transition-colors",
  errorClass = "text-red-600 text-xs font-medium",
  selectTriggerClass = "w-full px-2 py-2 mb-0 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1a5632] focus:border-transparent text-sm transition-colors text-start",
}) {
  const provinceName = names.province ?? "province";
  const municipalityName = names.municipality ?? "municipality";
  const barangayName = names.barangay ?? "barangay";

  // Scoped to this component: re-renders AddressFields (and only this
  // component) whenever province/municipality change, regardless of what
  // else is going on in the parent form.
  const watchedProvince = useWatch({ control, name: provinceName });
  const selectedMunicipality = useWatch({ control, name: municipalityName });
  const selectedProvince = watchedProvince || DEFAULT_PROVINCE;

  const municipalities = getMunicipalities(selectedProvince);
  const barangays = selectedMunicipality
    ? getBarangays(selectedProvince, selectedMunicipality)
    : [];

  return (
    <>
      {/* PROVINCE */}
      <div className="flex flex-col gap-1 text-left">
        <Controller
          name={provinceName}
          control={control}
          defaultValue={DEFAULT_PROVINCE}
          render={({ field }) => (
            <Select
              value={field.value ?? DEFAULT_PROVINCE}
              onValueChange={(value) => {
                field.onChange(value);
                // Province changed -> municipality & barangay are no longer valid
                setValue(municipalityName, "", { shouldValidate: true });
                setValue(barangayName, "", { shouldValidate: true });
              }}
            >
              <SelectTrigger size="20" className={selectTriggerClass}>
                <SelectValue placeholder="*SELECT PROVINCE" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.[provinceName] && (
          <div className={errorClass}>{errors[provinceName].message}</div>
        )}
      </div>

      {/* MUNICIPALITY / CITY */}
      <div className="flex flex-col gap-1 text-left">
        <Controller
          name={municipalityName}
          control={control}
          render={({ field }) => (
            <Select
              value={field.value ?? ""}
              onValueChange={(value) => {
                field.onChange(value);
                // Municipality changed -> previously selected barangay may not belong to it
                setValue(barangayName, "", { shouldValidate: true });
              }}
            >
              <SelectTrigger size="20" className={selectTriggerClass}>
                <SelectValue placeholder="*SELECT MUNICIPALITY/CITY" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {municipalities.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.[municipalityName] && (
          <div className={errorClass}>{errors[municipalityName].message}</div>
        )}
      </div>

      {/* BARANGAY */}
      <div className="flex flex-col gap-1 text-left">
        <Controller
          name={barangayName}
          control={control}
          render={({ field }) => (
            <Select
              key={selectedMunicipality || "no-municipality"}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              disabled={!selectedMunicipality}
            >
              <SelectTrigger size="20" className={selectTriggerClass}>
                <SelectValue
                  placeholder={
                    selectedMunicipality
                      ? "*SELECT BARANGAY"
                      : "SELECT MUNICIPALITY FIRST"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {barangays.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {errors?.[barangayName] && (
          <div className={errorClass}>{errors[barangayName].message}</div>
        )}
      </div>
    </>
  );
}
