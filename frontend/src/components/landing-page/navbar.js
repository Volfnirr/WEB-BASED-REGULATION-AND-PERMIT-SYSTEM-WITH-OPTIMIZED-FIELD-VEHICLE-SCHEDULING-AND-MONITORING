"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#aboutus" },
  { label: "Services", href: "#services" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState("");

  useEffect(() => {
    const sectionIds = ["home", "aboutus", "services"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHash("#" + entry.target.id);
          }
        });
      },
      { threshold: 0.5 },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
  return (
    <nav className="sticky top-0 z-50 bg-[#008338] w-full py-1 px-8">
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row items-center">
          <Image src="/denrlogo.png" alt="DENR logo" width={56} height={56} />
          <div className="flex flex-col pl-4">
            <div className="hidden md:flex flex-col">
              <h3 className="font-bold text-white">
                Provincial Environment and Natural Resources Office
              </h3>
              <p className="font-thin text-white text-sm">
                Brgy. San Antonio, Guagua, Pampanga, 2003
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-row items-center gap-12">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setActiveHash(href)}
              className={`text-lg font-medium text-white underline-offset-4 hover:underline ${
                activeHash === href ? "underline" : ""
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex flex-row justify-between items-center gap-2">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-green-600 px-2 py-0.5 text-lg text-white font-medium transition hover:bg-green-700"
          >
            Login
          </Link>

          <button
            className="lg:hidden text-white text-2xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden flex flex-col items-start gap-2 pb-4">
          {links.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              onClick={() => {
                setActiveHash(href);
                setMenuOpen(false);
              }}
              className={`text-lg font-medium text-white underline-offset-4 hover:underline ${
                activeHash === href ? "underline" : ""
              }`}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
