"use client";

import Image from "next/image";

export default function AuthUI({ children }) {
  return (
    <div
      className="relative w-full flex-grow flex flex-col min-h-screen"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      {/* Background Image with the matching green overlay! */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center w-full"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        <div className="absolute inset-0 bg-green-900/60 mix-blend-multiply"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex-grow flex items-center justify-center py-10 px-5">
        <div className="bg-white rounded-lg py-10 px-8 w-full max-w-[480px] shadow-md text-center max-[500px]:py-8 max-[500px]:px-5 transition-all duration-300">
          {/* Shared Header & Logo */}
          <div className="flex flex-col items-center gap-2.5 mb-6">
            <Image
              src="/denrlogo.png"
              alt="DENR Logo"
              width={100}
              height={100}
              className="block mx-auto h-auto mb-4"
              priority
            />
            <h2 className="text-base font-bold text-[#1a1a1a] mb-1 leading-snug">
              Provincial Environment and Natural
              <br />
              Resource Office - Pampanga
            </h2>
            <p className="text-xs text-gray-400">Online Application</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
