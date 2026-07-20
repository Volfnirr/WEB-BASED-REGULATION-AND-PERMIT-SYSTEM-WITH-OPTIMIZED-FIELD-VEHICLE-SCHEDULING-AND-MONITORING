"use client";
import { useState } from "react";
import TripTicketModal from "@/components/ui/modal/trip-ticket";
import TripApplicationTable from "./trip-applications-table";
import Title from "@/components/ui/title";
import { Plus } from "lucide-react";
import TripApplicationInfo from "./trip-application-info";

export default function ManageTripApplication() {
  const [showTripTicket, setShowTripTicket] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title
          title="Manage"
          title2="Applications"
          description="View and manage all trip applications."
        />
        <button
          onClick={() => setShowTripTicket(true)}
          className="flex items-center gap-1.5 rounded-lg bg-[#4DAA74] px-4 py-2.5 text-white font-medium cursor-pointer hover:bg-[#428f63] transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          New Trip Ticket
        </button>
        <TripTicketModal
          isOpen={showTripTicket}
          onClose={() => setShowTripTicket(false)}
        />
      </div>
      <TripApplicationInfo />
      <TripApplicationTable />
    </div>
  );
}
