"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { Menu } from "lucide-react";
import { X } from "lucide-react";

const links = [
  {
    name: "Agricultural Free Patent",
    href: "/applicant/agricultural",
  },
  {
    name: "Residential Free Patent",
    href: "/applicant/residential",
  },
  {
    name: "Chainsaw Registration",
    href: "/applicant/chainsaw",
  },
  {
    name: "Tree Cutting Permit",
    href: "/applicant/tree-cutting",
  },
];

export default function ApplicantSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const close = () => {
    if (window.matchMedia("(max-width: 1023px)").matches) {
      setIsOpen(false);
    }
  };
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
        <aside className="w-64 min-h-screen bg-[#005221] text-white flex flex-col justify-between shrink-0 shadow-xl">
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
                className="p-1.5 rounded-lg hover:bg-green-800 transition-colors shrink-0"
              >
                <X />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              <div className="px-3 mb-2 text-xs font-semibold text-green-300 uppercase tracking-wider">
                <p>Available Services</p>
              </div>

              {links.map((service) => {
                const isActive = pathname.startsWith(service.href);
                return (
                  <Link
                    key={service.href}
                    href={service.href}
                    onClick={close}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "bg-white text-[#005221] font-bold shadow-md"
                        : "text-green-100 hover:bg-green-800"
                    }`}
                  >
                    {service.name}
                  </Link>
                );
              })}
              <div className="flex flex-col gap-1 pt-1">
                <div className="px-3 mb-2 text-xs font-semibold text-green-300 uppercase tracking-wider">
                  <h2>Application</h2>
                </div>

                <Link
                  href="/applicant/my-applications"
                  onClick={close}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pathname === "/applicant/my-applications"
                      ? "bg-white text-[#005221] font-bold shadow-md"
                      : "text-green-100 hover:bg-green-800"
                  }`}
                >
                  My Application Status
                </Link>
              </div>
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
