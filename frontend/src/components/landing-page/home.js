import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <section className="relative mx-10 mt-5 min-h-150 overflow-hidden rounded-2xl bg-green-800/50 md:min-h-150">
      <div className="relative flex min-h-150 flex-col items-center justify-center gap-12 px-10 py-16 md:min-h-150 md:flex-row md:justify-between md:gap-16 md:px-12 md:py-0 lg:px-25">
        <div className="order-2 flex w-full max-w-150 flex-col items-center text-center md:order-1 md:items-start md:text-left">
          <Badge className="mb-4 border border-white/20 bg-white/10 text-white hover:bg-white/20">
            Official Government Portal
          </Badge>

          <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-white">PENRO Pampanga</span>
          </h1>

          <p className="mt-4 text-lg font-semibold text-green-50/90 sm:text-xl">
            Online Services
          </p>

          <p className="mt-2 max-w-md text-sm text-green-50/70 sm:text-base">
            Apply for permits, patent, and track your applications — all in one
            place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <Button
              asChild
              className="h-11 rounded-2xl bg-white text-base font-bold text-green-700 shadow-lg hover:bg-green-50 sm:h-12 sm:text-lg md:text-xl lg:text-2xl"
            >
              <Link href="/login">Start Application</Link>
            </Button>
          </div>
        </div>

        <div className="order-1 flex items-center justify-center md:order-1 md:items-start md:-mt-3.5">
          <div className="relative">
            <Image
              src="/DENR_LOGO.png"
              alt="DENR Logo"
              width={250}
              height={250}
              loading="eager"
              className="relative h-32 w-32 sm:h-40 sm:w-40 md:h-64 md:w-64 lg:h-80 lg:w-80 xl:h-100 xl:w-100"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
