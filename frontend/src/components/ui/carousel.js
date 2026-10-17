"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) throw new Error("Carousel controls must be inside <Carousel>.");
  return context;
}

function Carousel({
  opts,
  plugins,
  setApi,
  orientation = "horizontal",
  className,
  children,
  onKeyDownCapture,
  ...props
}) {
  const [carouselRef, api] = useEmblaCarousel(
    { ...opts, axis: orientation === "horizontal" ? "x" : "y" },
    plugins,
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  React.useEffect(() => {
    if (!api) return;
    setApi?.(api);
    const onSelect = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, setApi]);

  const handleKeyDown = (event) => {
    onKeyDownCapture?.(event);
    if (
      event.defaultPrevented ||
      /INPUT|TEXTAREA|SELECT/.test(event.target.tagName) ||
      event.target.isContentEditable
    )
      return;
    const previous = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";
    const next = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    if (event.key === previous || event.key === next) {
      event.preventDefault();
      if (event.key === previous) scrollPrev();
      else scrollNext();
    }
  };

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api,
        orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        onKeyDownCapture={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }) {
  const { carouselRef, orientation } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }) {
  const { orientation } = useCarousel();
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

const controlClass =
  "absolute inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border bg-white text-slate-900 shadow-sm transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2";

function CarouselPrevious({ className, onClick, disabled, ...props }) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      aria-label="Previous slide"
      className={cn(
        controlClass,
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={disabled || !canScrollPrev}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollPrev();
      }}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

function CarouselNext({ className, onClick, disabled, ...props }) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      aria-label="Next slide"
      className={cn(
        controlClass,
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={disabled || !canScrollNext}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) scrollNext();
      }}
      {...props}
    >
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
