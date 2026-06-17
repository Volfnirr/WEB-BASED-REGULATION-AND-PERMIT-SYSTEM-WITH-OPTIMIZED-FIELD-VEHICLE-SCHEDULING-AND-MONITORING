import Image from "next/image";
import Link from "next/link";
export default function Home() {
  return (
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-between h-150 px-6 lg:px-24 gap-10">
      <div className="text-center md:text-left">
        <h1 className="text-white font-bold text-4xl md:text-6xl lg:text-7xl leading-tight">
          Provincial <br />
          Environment and <br />
          Natural Resources <br />
          Office - Pampanga
        </h1>
      </div>
      {/* RIGHT: LOGO + BUTTON */}
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/homedenrlogo.png"
          alt="DENR Logo"
          width={250}
          height={250}
          className="drop-shadow-xl"
        />

        <button className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg md:text-2xl px-10 py-4 rounded-2xl shadow-lg transition">
          Start Application
        </button>
      </div>
    </div>
  );
}
