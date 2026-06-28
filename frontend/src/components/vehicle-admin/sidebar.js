"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { FileText } from "lucide-react";
import { CalendarCog } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Car } from "lucide-react";

const links = [
  {
    icon: <FileText />,
    name: "Review Applications",
    href: "/vehicle/applications",
  },
  {
    icon: <CalendarCog />,
    name: "Vehicle Schedules",
    href: "/vehicle/vehicles-schedules",
  },
  {
    icon: <UsersRound />,
    name: "Driver Availability",
    href: "/vehicle/driver-availability",
  },
  {
    icon: <Car />,
    name: "Vehicles",
    href: "/vehicle/manage-vehicles",
  },
];

export default function VehicleAdminSiderbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-[#005221] text-white shadow-md hover:bg-green-800 transition-colors"
        >
          <Menu />
        </button>
      )}

      {isOpen && (
        <aside className="fixed md:relative w-64 min-h-screen bg-[#005221] text-white flex flex-col justify-between shrink-0 shadow-xl">
          <div>
            <div className="p-6 border-b border-green-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Image
                  src="/denrlogo.png"
                  alt="DENR logo"
                  width={40}
                  height={40}
                />
                <div>
                  <h2 className="font-bold text-xs tracking-wider uppercase text-green-200">
                    PENRO Portal
                  </h2>
                  <p className="text-sm font-semibold truncate max-w-37.5">
                    Juan Dela Cruz
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="md:hidden p-1.5 rounded-lg hover:bg-green-800 transition-colors shrink-0"
              >
                <X />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              <Link
                href="/vehicle/dashboard"
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  pathname === "/vehicle/dashboard"
                    ? "bg-white text-[#005221] font-bold shadow-md"
                    : "text-green-100 hover:bg-green-800"
                }`}
              >
                <LayoutDashboard />
                Dashboard
              </Link>
              <div className="px-3 mb-2 text-xs font-semibold text-green-300 uppercase tracking-wider">
                <p>Available Services</p>
              </div>

              {links.map((service) => {
                const isActive = pathname.startsWith(service.href);
                return (
                  <Link
                    key={service.href}
                    href={service.href}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#005221] font-bold shadow-md"
                        : "text-green-100 hover:bg-green-800"
                    }`}
                  >
                    {service.icon}
                    {service.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-green-800">
            <Link
              href="/"
              className="flex w-full items-center justify-center px-4 py-2 text-sm font-medium bg-red-700 hover:bg-red-800 text-white rounded-lg transition-colors shadow"
            >
              Logout
            </Link>
          </div>
        </aside>
      )}
    </>
  );
}
