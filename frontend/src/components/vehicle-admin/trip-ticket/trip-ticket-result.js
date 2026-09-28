"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function TripTicketResult({ trip, onClose }) {
  const ticket = trip.createTicket;
  const schedule = trip.scheduleVehicle;

  return (
    <Card className="max-w-3xl mx-auto shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Trip Ticket Details</CardTitle>

          <Badge className="bg-green-700">ACTIVE</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-bold text-muted-foreground">
              Trip Ticket No.
            </p>

            <p className="font-medium">{ticket.tripTicketNo}</p>
          </div>

          <div>
            <p className="text-xs font-bold text-muted-foreground">Schedule</p>

            <p>{new Date(schedule.startDate).toLocaleDateString()}</p>
          </div>
        </div>

        <Separator />

        <Field label="Driver Name" value={ticket.driverName} />

        <Field label="Vehicle ID" value={ticket.vehicleId} />

        <Field
          label="Authorized Passenger/s"
          value={ticket.authorizedPassengers}
        />

        <Field label="Places Visited" value={ticket.placesToVisit} />

        <Field label="Purpose" value={ticket.purpose} />

        <Separator />

        <Field label="Schedule ID" value={schedule.id} />

        <div className="flex justify-end pt-4">
          <Button onClick={onClose} className="bg-[#1a5632]">
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>

      <p className="font-medium">{value}</p>
    </div>
  );
}
