"use client";
import { useState } from "react";
import TripTicketModal from "@/components/ui/modal/trip-ticket/trip-ticket";
import Title from "@/components/ui/title";
import { Plus } from "lucide-react";

export default function ManageTripApplication() {
  const [showTripTicket, setShowTripTicket] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-start justify-start mb-2 md:flex-row md:items-center md:justify-between">
        <Title
          title="Manage"
          title2="Applications"
          description="View and manage all trip applications."
        />
        <button
          onClick={() => setShowTripTicket(true)}
          className="flex items-center gap-1.5 rounded-lg text-sm bg-[#4DAA74] px-4 py-2.5 text-white font-medium cursor-pointer whitespace-nowrap hover:bg-[#428f63] transition-colors duration-200 "
        >
          <Plus className="h-4 w-4" />
          New Trip Ticket
        </button>
        <TripTicketModal
          isOpen={showTripTicket}
          onClose={() => setShowTripTicket(false)}
        />
      </div>
    </div>
  );
}
