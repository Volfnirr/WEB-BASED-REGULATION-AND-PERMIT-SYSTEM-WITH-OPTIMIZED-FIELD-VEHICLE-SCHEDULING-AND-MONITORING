"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#aboutus" },
  { label: "Services", href: "#services" },
];

export default function Navbar() {
  const [activeHash, setActiveHash] = useState("#home");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const sections = links
      .map(({ href }) => document.querySelector(href))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length > 0) {
          setActiveHash(`#${visibleSections[0].target.id}`);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: "-80px 0px -20% 0px",
      },
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (href) => {
    setActiveHash(href);
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-green-800/50">
      <div className="mx-auto flex h-16 w-full items-center justify-between px-6 lg:px-24">
        <Link
          href="#home"
          className="flex min-w-0 items-center"
          onClick={() => handleNavClick("#home")}
        >
          <Image
            src="/homedenrlogo.png"
            alt="DENR logo"
            width={48}
            height={48}
            className="hidden md:block h-10 w-10 sm:h-12 sm:w-12"
            priority
          />

          <div className="ml-3 hidden min-w-0 lg:block">
            <h3 className="truncate text-sm font-bold text-white lg:text-base">
              Provincial Environment and Natural Resources Office
            </h3>

            <p className="text-xs font-light text-white/80 lg:text-sm">
              Brgy. San Antonio, Guagua, Pampanga, 2003
            </p>
          </div>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => handleNavClick(href)}
              className={`relative px-2 py-2 text-sm font-medium text-white transition-colors ${
                activeHash === href
                  ? "after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-white"
                  : "hover:text-white/80"
              }`}
            >
              {label}
            </Link>
          ))}

          <div className="flex items-center gap-3">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-white/30 bg-transparent font-medium text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="bg-white font-bold text-green-700 hover:bg-green-50"
            >
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center lg:hidden">
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger
              className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>

            <SheetContent
              side="right"
              className="flex w-[280px] flex-col bg-[#008338] text-white"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-white">
                  PENRO Pampanga
                </SheetTitle>
              </SheetHeader>

              <div className="mt-4 flex flex-1 flex-col gap-2 px-2">
                {links.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => handleNavClick(href)}
                    className={`rounded-md px-4 py-3 text-base text-white transition-colors hover:bg-white/10 ${
                      activeHash === href ? "bg-white/10" : ""
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-3 border-t border-white/10 px-2 pb-4 pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-white/30 bg-transparent font-medium text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-white font-bold text-green-700 hover:bg-green-50"
                >
                  <Link href="/register" onClick={() => setMenuOpen(false)}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
