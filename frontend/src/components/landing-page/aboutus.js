"use client";

export default function AboutUs() {
  return (
    <section className="relative mx-10 mt-5 min-h-[600px] overflow-hidden rounded-2xl bg-green-900 md:min-h-[650px] md:bg-transparent">
      <div
        className="absolute inset-0 hidden bg-green-900 md:block"
        style={{
          clipPath: "polygon(0 0, 52.88% 0, 41.72% 100%, 0 100%)",
        }}
      />

      <div
        className="absolute inset-0 hidden bg-white/30 md:block"
        style={{
          clipPath: "polygon(52.88% 0, 100% 0, 100% 100%, 41.72% 100%)",
        }}
      />

      <div className="relative z-10 flex min-h-[600px] flex-col justify-center gap-10 px-6 py-16 text-center md:block md:min-h-[650px] md:px-0 md:py-0 md:text-left">
        <div className="w-full break-words md:absolute md:left-10 md:top-10 md:w-[42%] lg:left-5 lg:top-16">
          <h2 className="mb-6 pr-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:text-5xl sm:pr-0 lg:text-9xl">
            Our
            <br />
            Mission
          </h2>

          <p className="mx-auto max-w-md pr-4 text-base leading-relaxed text-white sm:pr-0 sm:text-lg md:mx-0 md:text-2xl">
            To mobilize our citizenry in protecting, conserving, and managing
            the environment and natural resources for the present and future
            generations.
          </p>
        </div>

        <div className="w-full break-words md:absolute md:bottom-10 md:right-10 md:w-[42%] md:text-right lg:bottom-16 lg:right-5 mx-0">
          <h2 className="mb-6 pl-4 pr-4 text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white sm:pl-0 sm:pr-0 sm:text-5xl lg:text-9xl">
            Our
            <br />
            Vision
          </h2>

          <p className="mx-auto max-w-md pl-4 pr-4 text-base leading-relaxed text-white sm:pl-0 sm:pr-0 sm:text-lg md:ml-auto md:mr-0 md:text-2xl">
            A nation enjoying and sustaining its natural resources and a clean
            and healthy environment.
          </p>
        </div>
      </div>
    </section>
  );
}