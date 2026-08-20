"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getMyServices } from "@/lib/api/services";

const ServicesContext = createContext(null);

const defaultServicesContext = {
  assignedServices: [],
  loading: false,
  error: null,
};

export function ServicesProvider({ children }) {
  const [assignedServices, setAssignedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getMyServices();
        setAssignedServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <ServicesContext.Provider value={{ assignedServices, loading, error }}>
      {children}
    </ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  return ctx ?? defaultServicesContext;
}
