"use client";

import { useSyncExternalStore } from "react";

const storageKey = "application-export-format";
const valid = (value) => value === "pdf" || value === "docx";
const changeEvent = "application-export-format-change";
let sessionFormat = "pdf";

function readFormat() {
  try {
    const saved = window.localStorage.getItem(storageKey);
    if (valid(saved)) return saved;
  } catch {
    /* Storage may be unavailable. */
  }
  return sessionFormat;
}

function subscribe(notify) {
  const sync = (event) => {
    if (event.key === storageKey || event.key === null) {
      sessionFormat = valid(event.newValue) ? event.newValue : "pdf";
      notify();
    }
  };
  window.addEventListener("storage", sync);
  window.addEventListener(changeEvent, notify);
  return () => {
    window.removeEventListener("storage", sync);
    window.removeEventListener(changeEvent, notify);
  };
}

function chooseFormat(value) {
  if (!valid(value)) return;
  sessionFormat = value;
  try {
    window.localStorage.setItem(storageKey, value);
  } catch {
    /* Session choice still works. */
  }
  window.dispatchEvent(new Event(changeEvent));
}

export default function useExportFormat() {
  const format = useSyncExternalStore(subscribe, readFormat, () => "pdf");
  return [format, chooseFormat];
}
