"use client";

export default function AboutUs() {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Green tint (no background photo) */}
      <div className="absolute inset-0 bg-green-800/50" />

      {/* Solid green diagonal panel (right side) */}
      <div
        className="absolute inset-y-0 right-0 w-[70%] sm:w-[62%] bg-green-600"
        style={{
          clipPath: "polygon(28% 0, 100% 0, 100% 100%, 8% 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col sm:flex-row min-h-[500px]">
        {/* Mission */}
        <div className="flex-1 flex flex-col justify-center px-6 sm:px-10 py-12 sm:py-0">
          <h2 className="text-white font-extrabold uppercase leading-[0.95] text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
            Our
            <br />
            Mission
          </h2>
          <p className="text-white text-base sm:text-lg max-w-md">
            To mobilize our citizenry in protecting, conserving, and managing
            the environment and natural resources for the present and future
            generations.
          </p>
        </div>

        {/* Vision */}
        <div className="flex-1 flex flex-col justify-center items-center sm:items-end px-6 sm:px-10 py-12 sm:py-0 text-center sm:text-right">
          <h2 className="text-white font-extrabold uppercase leading-[0.95] text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6">
            Our
            <br />
            Vision
          </h2>
          <p className="text-white text-base sm:text-lg max-w-md">
            A nation enjoying and sustaining its natural resources and a
            clean and healthy environment.
          </p>
        </div>
      </div>
    </div>
  );
}