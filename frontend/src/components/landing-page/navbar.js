"use client";
import Image from "next/image";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex flex-row justify-between pt-1 pb-1 pl-8 pr-8 bg-[#008338] w-fu">
      <div className="order-1 items-center gap-50">
        <div className="flex flex-row items-center">
          <Image src="/denrlogo.png" alt="denrlogo" width={56} height={56} />
          <div className="flex-col pl-4">
            <h3 className="font-bold text-[#FFFFFF]">
              Provincial Environment and Natural Resources Office
            </h3>
            <p className="font-thin text-[#FFFFFF]">
              Brgy. San Antonio, Guagua, Pampanga, 2003
            </p>
          </div>
        </div>
      </div>
      <div className="order-2 flex flex-row items-center gap-12">
        <Button asChild variant="link" className="text-lg text-[#FFFFFF]">
          <a href="#home">Home</a>
        </Button>

        <Button asChild variant="link" className="text-lg text-[#FFFFFF]">
          <a href="#aboutus">About Us</a>
        </Button>

        <Button asChild variant="link" className="text-lg text-[#FFFFFF]">
          <a href="#services">Services</a>
        </Button>

        <Button variant="link" className="text-lg text-[#FFFFFF]">
          Login
        </Button>
      </div>
    </nav>
  );
}
