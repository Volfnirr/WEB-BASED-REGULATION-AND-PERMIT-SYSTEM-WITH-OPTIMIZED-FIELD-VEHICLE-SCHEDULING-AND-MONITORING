"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ClipboardCheck,
  FileText,
  Leaf,
  Mail,
  MapPin,
  Menu,
  Phone,
  ShieldCheck,
  TreePine,
  UserRound,
  X,
} from "lucide-react";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "About Us", href: "#aboutus" },
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
];

const services = [
  {
    code: "RO-L-03",
    title: "Agricultural Free Patent",
    description: "Apply for a patent over qualifying agricultural land.",
    image: "/c1.png",
    imageAlt: "Agricultural fields viewed from above",
    requirements: [
      "Application form and technical description of the land",
      "LRA clearance or MTC / RTC clearance",
      "Tax Declaration and Deed of Conveyance",
      "Barangay and Municipal Posting",
      "Birth Certificate (applicant must be a natural-born Filipino citizen)",
    ],
  },
  {
    code: "RO-L-04",
    title: "Residential Free Patent",
    description:
      "Apply for a residential free patent under Republic Act No. 10023.",
    image: "/c3.png",
    imageAlt: "Open countryside and land at sunset",
    requirements: [
      "Completed application form and technical description (lot data computation and cadastral map)",
      "LRA clearance or MTC / RTC clearance",
      "Deed of Conveyance, such as EJS, DOS, Deed of Donation, or Waiver of Rights",
      "Zoning Clearance from the Municipal Planning and Development Office",
      "Barangay Posting and four (4) documentary stamps",
    ],
  },
  {
    code: "RO-F-04",
    title: "Chainsaw Registration",
    description: "Register a chainsaw or record a transfer of ownership.",
    image: "/landing-page/chainsaw.webp",
    imageAlt: "PENRO Pampanga office building",
    requirements: [
      "Completed application form and chainsaw for registration",
      "Official Receipt of purchase: one certified copy and one original for verification",
      "Special Power of Attorney if the applicant is not the chainsaw owner",
      "Chainsaw serial number stencil and detailed specifications (brand, model, engine capacity, etc.)",
      "Notarized Deed of Absolute Sale (one original) if ownership is transferred",
    ],
  },
  {
    code: "RO-F-06",
    title: "Tree Cutting Permit",
    description:
      "Request authorization to cut trees on land you own or manage.",
    image: "/landing-page/treecutting.webp",
    imageAlt: "Green forest and cultivated field",
    requirements: [
      "Formal application letter",
      "Proof of land ownership, such as a land title",
      "Clear photographs of the specific trees",
      "LGU Barangay / Municipal Endorsement or Certification of No Objection",
      "Technical inventory report and applicable processing requirements",
    ],
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description:
      "Sign up with your details to create a secure applicant account and access PENRO Pampanga online services.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Submit your application",
    description:
      "Choose a service, complete the application, and submit the application.",
    icon: FileText,
  },
  {
    number: "03",
    title: "Receive status updates",
    description:
      "Sign in to check your application status and see updates as your application moves through review.",
    icon: ClipboardCheck,
  },
];

const REPLAY_REVEAL_ON_SCROLL = true;

function SectionEyebrow({ children, light = false }) {
  return (
    <p
      className={`mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] ${
        light ? "text-emerald-200" : "text-emerald-700"
      }`}
    >
      <span className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}

export default function LandingPageUI() {
  const [menuOpen, setMenuOpen] = useState(false);

  const total = services.length;
  const [carouselApi, setCarouselApi] = useState(null);
  const [displayedIndex, setDisplayedIndex] = useState(0);

  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-reveal, .reveal-from-left, .reveal-from-right, .reveal-from-bottom",
    );

    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.1) {
            entry.target.classList.add("is-visible");
          } else if (!entry.isIntersecting && REPLAY_REVEAL_ON_SCROLL) {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: [0, 0.1],
        rootMargin: "0px 0px -20px 0px",
      },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!carouselApi) return;

    const updateSelection = () => {
      setDisplayedIndex(carouselApi.selectedScrollSnap());
    };

    updateSelection();
    carouselApi.on("select", updateSelection);
    carouselApi.on("reInit", updateSelection);

    return () => {
      carouselApi.off("select", updateSelection);
      carouselApi.off("reInit", updateSelection);
    };
  }, [carouselApi]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#064e35]/95 text-white shadow-lg shadow-emerald-950/10 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link
            href="#home"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <Image
              src="/DENR_LOGO.png"
              alt="Department of Environment and Natural Resources seal"
              width={52}
              height={52}
              priority
              className="h-11 w-11 rounded-full bg-white object-contain sm:h-12 sm:w-12"
            />

            <span className="leading-tight">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-100 sm:text-xs">
                DENR Region III
              </span>
              <span className="block text-sm font-extrabold tracking-wide sm:text-base">
                PENRO Pampanga
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-white/80 transition hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <Link
              href="/login"
              className="rounded-full border border-white/35 px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
            >
              Log In
            </Link>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-lime-300 px-5 py-2.5 text-sm font-bold text-emerald-950 shadow-lg shadow-black/10 transition hover:bg-lime-200"
            >
              Start Application <ArrowUpRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-white/10 bg-[#064e35] px-5 pb-5 pt-3 lg:hidden">
            <div className="mx-auto flex max-w-[1440px] flex-col gap-1">
              {navigation.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-lg px-3 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-2 grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="rounded-full border border-white/35 px-4 py-3 text-center text-sm font-semibold"
                >
                  Log In
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenu}
                  className="rounded-full bg-lime-300 px-4 py-3 text-center text-sm font-bold text-emerald-950"
                >
                  Start Application
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <section
        id="home"
        className="relative isolate min-h-[650px] scroll-mt-20 overflow-hidden bg-[#063f2d] sm:min-h-[700px] lg:min-h-[760px]"
        style={{
          backgroundImage: "url('/penrobuilding.png')",
          backgroundSize: "cover",
          backgroundPosition: "center 42%",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#032f24]/95 via-[#064e35]/82 to-[#064e35]/30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#032f24]/65 via-transparent to-black/10" />
        {/* <div className="absolute -right-28 top-16 -z-10 h-80 w-80 rounded-full border border-white/15 sm:right-12 sm:top-20 sm:h-[430px] sm:w-[430px]" />
        <div className="absolute -right-10 top-32 -z-10 h-64 w-64 rounded-full border border-lime-200/20 sm:right-28 sm:top-36 sm:h-[300px] sm:w-[300px]" /> */}

        <div className="mx-auto flex min-h-[650px] max-w-[1440px] items-center px-5 py-20 sm:min-h-[700px] sm:px-8 lg:min-h-[760px] lg:px-12">
          <div className="max-w-3xl text-white">
            {/* <div
              className="hero-item mb-7 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-emerald-50 backdrop-blur sm:text-sm"
              style={{ animationDelay: "100ms" }}
            >
              <Leaf size={15} className="text-lime-300" />
              Official Online Services Portal
            </div> */}

            <h1
              className="hero-item max-w-4xl text-[clamp(3.1rem,8vw,7.4rem)] font-black leading-[0.93] tracking-[-0.06em]"
              style={{ animationDelay: "250ms" }}
            >
              Welcome to
              <br />
              <span className="text-lime-300">PENRO Pampanga</span>
            </h1>

            <p
              className="hero-item mt-8 text-xl font-bold text-white sm:text-2xl"
              style={{ animationDelay: "400ms" }}
            >
              Online Services
            </p>

            <p
              className="hero-item mt-3 max-w-xl text-base leading-relaxed text-white/80 sm:text-lg"
              style={{ animationDelay: "500ms" }}
            >
              Apply for permits and patents and track your applications — all in
              one place.
            </p>

            <div
              className="hero-item mt-9 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "620ms" }}
            >
              <Link
                href="/register"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-lime-300 px-7 text-base font-extrabold text-emerald-950 shadow-xl shadow-black/15 transition hover:-translate-y-0.5 hover:bg-lime-200"
              >
                Start Application <ArrowRight size={18} />
              </Link>

              <a
                href="#services"
                className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/5 px-7 text-base font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                Explore Services <ArrowDown size={17} />
              </a>
            </div>

            <div
              className="hero-item mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-white/20 pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-white/70 sm:text-sm"
              style={{ animationDelay: "760ms" }}
            >
              <span className="inline-flex items-center gap-2">
                <ShieldCheck size={17} className="text-lime-300" />
                Secure applications
              </span>

              <span className="inline-flex items-center gap-2">
                <ClipboardCheck size={17} className="text-lime-300" />
                Track your status
              </span>
            </div>
          </div>
        </div>

        {/* <a
          href="#aboutus"
          className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/65 md:flex"
        >
          Scroll to explore <ArrowDown size={14} />
        </a> */}
      </section>

      <section
        id="aboutus"
        className="scroll-mt-20 overflow-hidden bg-[#f7faf7] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
            <div className="reveal-from-left max-w-2xl">
              <SectionEyebrow>About Us</SectionEyebrow>

              <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.045em] text-[#123d2b] sm:text-5xl lg:text-6xl">
                Caring for the land we share.
              </h2>

              <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
                The PENRO Pampanga is the provincial field office of DENR Region
                III, mandated to implement national laws, policies, programs,
                and projects on the conservation, management, development, and
                sustainable utilization of the country's environment and natural
                resources within the Province of Pampanga.
              </p>

              <div className="mt-9 border-l-4 border-lime-500 pl-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Our Mission
                </p>

                <p className="mt-2 max-w-xl text-lg font-semibold leading-relaxed text-[#123d2b] sm:text-xl">
                  To mobilize our citizenry in protecting, conserving, and
                  managing the environment and natural resources for the present
                  and future generations.
                </p>
              </div>
            </div>

            <div className="reveal-from-right relative min-h-[340px] overflow-hidden rounded-[2rem] shadow-2xl shadow-emerald-950/15 sm:min-h-[440px]">
              <Image
                src="/c3.png"
                alt="Pampanga landscape at sunset"
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063f2d]/65 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 text-white sm:bottom-8 sm:left-8 sm:right-8">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-200">
                    For today and tomorrow
                  </p>

                  <p className="mt-1 text-xl font-extrabold sm:text-2xl">
                    Protecting our natural heritage
                  </p>
                </div>

                <span className="hidden rounded-full border border-white/30 bg-white/15 p-3 backdrop-blur sm:inline-flex">
                  <TreePine size={22} />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-8 border-t border-emerald-900/10 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
            <div className="reveal-from-left grid min-h-[280px] grid-cols-[1.1fr_0.9fr] gap-4 sm:min-h-[360px]">
              <div className="relative overflow-hidden rounded-3xl">
                <Image
                  src="/c1.png"
                  alt="Cultivated fields and green land"
                  fill
                  sizes="(max-width: 1024px) 55vw, 35vw"
                  className="object-cover"
                />
              </div>
              <div className="grid grid-rows-2 gap-4">
                <div className="relative overflow-hidden rounded-3xl">
                  <Image
                    src="/c2.png"
                    alt="Field and forest landscape"
                    fill
                    sizes="(max-width: 1024px) 45vw, 25vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-between rounded-3xl bg-[#0b6844] p-5 text-white sm:p-7">
                  <Leaf className="text-lime-300" size={24} />

                  <p className="text-lg font-bold leading-snug sm:text-xl">
                    A clean and healthy environment for every generation.
                  </p>
                </div>
              </div>
            </div>

            <div className="reveal-from-right flex flex-col justify-center gap-8">
              <div>
                <SectionEyebrow>Our Vision</SectionEyebrow>

                <h3 className="text-3xl font-extrabold leading-tight tracking-tight text-[#123d2b] sm:text-4xl">
                  A nation enjoying and sustaining its natural resources and a
                  clean and healthy environment.
                </h3>
              </div>

              <div className="rounded-3xl border border-emerald-900/10 bg-white p-6 shadow-sm sm:p-8">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-800">
                    <ShieldCheck size={21} />
                  </span>

                  <h3 className="text-xl font-extrabold text-[#123d2b]">
                    Our Mandate
                  </h3>
                </div>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  As the primary government agency for the conservation,
                  management, development, and proper use of the country’s
                  environment and natural resources, DENR works for the
                  well-being of present and future generations.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-16 grid items-center gap-12 border-t border-emerald-900/10 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div className="reveal-from-left max-w-2xl">
              <SectionEyebrow>Quality Policy</SectionEyebrow>

              <h2 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.045em] text-[#123d2b] sm:text-5xl">
                Our commitment to service.
              </h2>

              <div className="mt-7 max-w-xl space-y-5 text-left text-base leading-8 text-slate-600 sm:text-lg">
                <p>
                  We at the Department of Environment and Natural Resources are
                  committed to be the driving force in the effective and
                  efficient protection, conservation, management, development
                  and use of the country's environment and natural resources for
                  the welfare of the present and future generations.
                </p>

                <p>
                  We pledge to achieve quality environment and sustainable
                  natural resources through good governance and high degree of
                  professionalism in consideration of the requirement of our
                  stakeholders and in accordance with pertinent laws, rules and
                  regulations.
                </p>

                <p>
                  We adhere to continually improve our Quality Management System
                  (QMS) to provide the highest quality of service and social
                  justice to the people.
                </p>
              </div>

              <div className="mt-9 border-l-4 border-lime-500 pl-5">
                <p className="max-w-xl text-lg font-semibold leading-relaxed text-[#123d2b] sm:text-xl">
                  "Malinis na kapaligiran at mayamang kalikasan para sa buong
                  sambayanan"
                </p>
              </div>
            </div>

            <div className="reveal-from-right relative min-h-[320px] overflow-hidden rounded-[2rem] shadow-2xl shadow-emerald-950/15 sm:min-h-[420px]">
              <Image
                src="/penrobuilding.png"
                alt="PENRO Pampanga office building"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#063f2d]/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="scroll-mt-20 overflow-hidden bg-[#edf3ee] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="reveal-from-left max-w-2xl">
            <SectionEyebrow>Online Services</SectionEyebrow>

            <h2 className="text-4xl font-black leading-[1.05] tracking-[-0.045em] text-[#123d2b] sm:text-5xl lg:text-6xl">
              Services for your next step.
            </h2>

            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Explore the requirements before you apply. Select a service to
              review the documents you’ll need to prepare.
            </p>
          </div>

          <Carousel
            setApi={setCarouselApi}
            opts={{ align: "center", loop: true }}
            aria-label="Online services"
            className="reveal-from-bottom reveal-delay-1 relative mt-11 mx-0 pb-16 sm:mx-14 sm:pb-0"
          >
            <CarouselContent className="-ml-5 items-stretch py-3">
              {services.map((service, index) => {
                const isActive = index === displayedIndex;

                return (
                  <CarouselItem
                    key={service.code}
                    className="flex min-w-0 basis-full pl-5 md:basis-1/2 lg:basis-1/3"
                  >
                    <article
                      aria-current={isActive ? "true" : undefined}
                      className={`flex h-full w-full min-h-[680px] min-w-0 flex-col overflow-hidden rounded-[1.75rem] border p-6 shadow-lg shadow-emerald-950/5 transition-all duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] sm:p-7 ${
                        isActive
                          ? "border-[#075c3d] bg-[#075c3d] text-white md:scale-100"
                          : "border-emerald-900/10 bg-white text-slate-900 md:scale-[0.94]"
                      }`}
                    >
                      <div className="-mx-6 -mt-6 mb-5 sm:-mx-7 sm:-mt-7">
                        <div className="relative h-40 overflow-hidden sm:h-44">
                          <Image
                            src={service.image}
                            alt={service.imageAlt}
                            fill
                            sizes="(max-width: 767px) 90vw, (max-width: 1024px) 32vw, 30vw"
                            className="object-cover transition-transform duration-500 hover:scale-105"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-[#032f24]/80 via-[#032f24]/10 to-transparent" />

                          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                            <span className="rounded-full border border-white/25 bg-[#064e35]/80 px-3 py-1.5 text-[11px] font-extrabold tracking-[0.1em] text-white backdrop-blur">
                              {service.code}
                            </span>

                            <span className="rounded-full bg-lime-300 p-2 text-emerald-950">
                              {service.code === "RO-F-06" ? (
                                <TreePine size={18} />
                              ) : (
                                <FileText size={18} />
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <h3 className="text-2xl font-extrabold leading-tight tracking-tight sm:text-[1.65rem]">
                        {service.title}
                      </h3>

                      <p
                        className={`mt-3 min-h-12 text-sm leading-6 transition-colors duration-[650ms] ${
                          isActive ? "text-white/80" : "text-slate-500"
                        }`}
                      >
                        {service.description}
                      </p>

                      <div
                        className={`mt-6 border-t pt-5 transition-colors duration-[650ms] ${
                          isActive ? "border-white/20" : "border-slate-200"
                        }`}
                      >
                        <p
                          className={`mb-4 text-xs font-extrabold uppercase tracking-[0.15em] ${
                            isActive ? "text-lime-200" : "text-emerald-800"
                          }`}
                        >
                          Requirements
                        </p>

                        <ul className="space-y-3">
                          {service.requirements.map((requirement) => (
                            <li
                              key={requirement}
                              className={`flex gap-2.5 text-sm leading-5 ${
                                isActive ? "text-white/90" : "text-slate-600"
                              }`}
                            >
                              <Check
                                size={16}
                                className={`mt-0.5 shrink-0 ${
                                  isActive
                                    ? "text-lime-300"
                                    : "text-emerald-700"
                                }`}
                              />

                              <span>{requirement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        href="/register"
                        className={`mt-auto inline-flex items-center justify-between border-t pt-5 text-sm font-bold ${
                          isActive
                            ? "mt-7 border-white/20 text-white"
                            : "mt-7 border-slate-200 text-emerald-800"
                        }`}
                      >
                        Start this application
                        <ArrowUpRight size={17} />
                      </Link>
                    </article>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              aria-label="Previous service"
              className="left-[calc(50%-3.25rem)] top-auto bottom-0 h-11 w-11 translate-y-0 border-emerald-900/15 bg-white text-emerald-900 hover:bg-[#075c3d] hover:text-white sm:-left-14 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2"
            />
            <CarouselNext
              aria-label="Next service"
              className="right-[calc(50%-3.25rem)] top-auto bottom-0 h-11 w-11 translate-y-0 border-emerald-900/15 bg-[#075c3d] text-white hover:bg-[#06452f] sm:-right-14 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2"
            />
          </Carousel>

          <div className="reveal-from-bottom reveal-delay-2 mt-8 flex flex-col items-center gap-3">
            <div
              className="flex items-center justify-center gap-2.5"
              role="group"
              aria-label="Choose a service"
            >
              {services.map((service, index) => {
                const isActive = index === displayedIndex;

                return (
                  <button
                    key={service.code}
                    type="button"
                    aria-label={`Go to ${service.title}`}
                    aria-pressed={isActive}
                    onClick={() => carouselApi?.scrollTo(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      isActive
                        ? "w-8 bg-[#075c3d]"
                        : "w-2.5 bg-emerald-900/20 hover:bg-emerald-700/50"
                    }`}
                  />
                );
              })}
            </div>

            <p
              aria-live="polite"
              aria-atomic="true"
              className="text-xs font-medium text-slate-500"
            >
              Service {String(displayedIndex + 1).padStart(2, "0")} of{" "}
              {String(total).padStart(2, "0")}
              {" · "}
              {services[displayedIndex].title}
            </p>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="scroll-mt-20 overflow-hidden bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
      >
        <div className="mx-auto max-w-[1240px]">
          <div className="reveal-from-bottom text-center">
            <SectionEyebrow>Applicant Flow</SectionEyebrow>

            <h2 className="text-4xl font-black leading-tight tracking-[-0.045em] text-[#123d2b] sm:text-5xl">
              Getting started is simple.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Create an account, submit your application, and follow its status
              as it is reviewed.
            </p>
          </div>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
            <div>
              {steps.map((step, index) => {
                const StepIcon = step.icon;

                return (
                  <div
                    key={step.number}
                    className="reveal-from-left relative grid grid-cols-[58px_1fr] gap-5 pb-10 last:pb-0 sm:grid-cols-[70px_1fr] sm:gap-6"
                    style={{ transitionDelay: `${index * 140}ms` }}
                  >
                    {index < steps.length - 1 && (
                      <span className="absolute bottom-0 left-[28px] top-14 w-px bg-emerald-900/15 sm:left-[34px]" />
                    )}

                    <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-900/10 bg-[#edf5ef] text-emerald-800 sm:h-[70px] sm:w-[70px]">
                      <StepIcon size={23} />
                    </span>

                    <div className="pt-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                        Step {step.number}
                      </p>

                      <h3 className="mt-1 text-xl font-extrabold text-[#123d2b] sm:text-2xl">
                        {step.title}
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reveal-from-right relative mx-auto w-full max-w-[500px] rounded-[2rem] bg-[#eaf2eb] p-5 sm:p-8">
              <div className="absolute -right-3 -top-4 rounded-full bg-lime-300 p-3 text-emerald-950 shadow-lg sm:-right-5 sm:-top-5 sm:p-4">
                <ClipboardCheck size={22} />
              </div>

              <div className="rounded-[1.5rem] bg-white p-5 shadow-xl shadow-emerald-950/10 sm:p-7">
                <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                  <div>
                    <p className="text-xs font-semibold text-slate-500">
                      APPLICATION STATUS
                    </p>

                    <h3 className="mt-1 text-lg font-extrabold text-[#123d2b]">
                      Your application
                    </h3>
                  </div>

                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">
                    Pending
                  </span>
                </div>

                <div className="mt-6 space-y-5">
                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-white">
                      <Check size={16} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Application submitted
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Your form was received.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800">
                      <FileText size={15} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Review in progress
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Check your account for status updates.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-50">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <ShieldCheck size={15} />
                    </span>

                    <div>
                      <p className="text-sm font-bold text-slate-800">
                        Remarks posted
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        You’ll see the next update here.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-7 rounded-xl bg-[#f4f8f4] px-4 py-3 text-xs leading-5 text-slate-500">
                  Status shown for illustration. Sign in to view your
                  application’s current status.
                </div>
              </div>

              <Link
                href="/login"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#075c3d] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#06452f]"
              >
                Log In to Track an Application <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="overflow-hidden bg-[#053d2c] text-white">
        <div className="border-b border-white/10">
          <div className="mx-auto grid max-w-[1320px] gap-5 px-5 py-8 sm:px-8 md:grid-cols-[1fr_1fr_1.25fr] lg:px-12">
            <div className="reveal-from-left flex items-start gap-3">
              <span className="rounded-full bg-white/10 p-3 text-lime-300">
                <MapPin size={19} />
              </span>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                  Visit Us
                </p>

                <p className="mt-1 text-sm font-semibold">
                  Brgy. San Antonio, Guagua, Pampanga, 2003
                </p>
              </div>
            </div>

            <div className="reveal-from-bottom reveal-delay-1">
              <a
                href="mailto:penropampanga@denr.gov.ph"
                className="flex items-start gap-3"
              >
                <span className="rounded-full bg-white/10 p-3 text-lime-300">
                  <Mail size={19} />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                    Email Us
                  </p>

                  <p className="mt-1 break-all text-sm font-semibold">
                    penropampanga@denr.gov.ph
                  </p>
                </div>
              </a>
            </div>

            <div className="reveal-from-right reveal-delay-2">
              <a href="tel:+63454365779" className="flex items-start gap-3">
                <span className="rounded-full bg-white/10 p-3 text-lime-300">
                  <Phone size={19} />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/55">
                    PENRO Hotline
                  </p>

                  <p className="mt-1 text-sm font-semibold">(045) 436 5779</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1320px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-16 lg:px-12 lg:py-16">
          <div className="reveal-from-left">
            <Link href="#home" className="inline-flex items-center gap-3">
              <Image
                src="/DENR_LOGO.png"
                alt="DENR seal"
                width={48}
                height={48}
                className="h-11 w-11 rounded-full bg-white object-contain"
              />

              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.15em] text-emerald-200">
                  Department of Environment and Natural Resources
                </span>

                <span className="mt-1 block text-xl font-extrabold">
                  PENRO Pampanga
                </span>
              </span>
            </Link>

            <p className="mt-5 max-w-md text-sm leading-7 text-white/65">
              Online services for environmental permits and land patents in
              Pampanga. Protecting our natural resources through accessible
              public service.
            </p>
          </div>

          <div className="reveal-from-bottom reveal-delay-1">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-lime-200">
              Explore
            </h3>

            <ul className="mt-5 space-y-3 text-sm font-medium text-white/75">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}

              <li>
                <Link href="/login" className="transition hover:text-white">
                  Log In
                </Link>
              </li>
            </ul>
          </div>

          <div className="reveal-from-right reveal-delay-2">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.18em] text-lime-200">
              Services
            </h3>

            <ul className="mt-5 space-y-3 text-sm font-medium text-white/75">
              {services.map((service) => (
                <li key={service.code}>
                  <a href="#services" className="transition hover:text-white">
                    {service.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="reveal-from-bottom mx-auto flex max-w-[1320px] flex-col gap-5 px-5 py-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
            <p className="text-xs font-medium text-white/55">
              © {new Date().getFullYear()} PENRO Pampanga. All rights reserved.
            </p>

            <div
              className="flex flex-wrap items-center gap-3"
              aria-label="Quality and compliance partners"
            >
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex flex-nowrap items-center gap-1">
                  <Image
                    src="/landing-page/sgs.svg"
                    alt="SGS"
                    width={114}
                    height={56}
                    className="h-10 w-auto shrink-0 rounded-md py-1.5 pl-1.5 pr-0 object-contain sm:h-12"
                  />
                  <Image
                    src="/landing-page/ph16.svg"
                    alt="PH16"
                    width={114}
                    height={56}
                    className="h-10 w-auto shrink-0 rounded-md py-1.5 pl-0 pr-1.5 object-contain sm:h-12"
                  />
                </div>

                <Image
                  src="/landing-page/socotec.svg"
                  alt="SOCOTEC"
                  width={114}
                  height={56}
                  className="h-10 w-auto shrink-0 rounded-md p-1.5 object-contain sm:h-12"
                />
              </div>
              <span className="ml-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/45 sm:text-xs">
                Quality service • public trust
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
