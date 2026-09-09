"use client";
import { useState } from "react";
import CompleteTripTicketModal from "@/components/ui/modal/complete-trip-ticket/complete-trip-ticket.js";
import Title from "@/components/ui/title";
import { Plus } from "lucide-react";

export default function AllTripApplicationsUI() {
  const [showAllTripTicket, setShowAllTripTicket] = useState(false);

  return (
    <div>
      <div className="flex flex-col items-start justify-start mb-2 md:flex-row md:items-center md:justify-between">
        <Title
          title="Manage Complete"
          title2="Trip Ticket"
          description="View and manage complete trip applications."
        />
        <button
          onClick={() => setShowAllTripTicket(true)}
          className="flex items-center gap-1.5 rounded-lg text-sm bg-[#4DAA74] px-4 py-2.5 text-white font-medium cursor-pointer whitespace-nowrap hover:bg-[#428f63] transition-colors duration-200 "
        >
          <Plus className="h-4 w-4" />
          Add Trip Ticket B
        </button>
        {showAllTripTicket && (
          <CompleteTripTicketModal
            isOpen={showAllTripTicket}
            onClose={() => setShowAllTripTicket(false)}
          />
        )}
      </div>
    </div>
  );
}
