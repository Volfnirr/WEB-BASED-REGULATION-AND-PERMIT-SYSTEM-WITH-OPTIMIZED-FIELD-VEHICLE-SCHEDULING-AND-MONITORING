"use client";
import Image from "next/image";
import { useState } from "react";

export default function AboutUs() {
  const images = ["/c1.png", "/c2.png", "/c3.png"];

  const [currentImage, setCurrentImage] = useState(0);
  return (
    <div className="flex flex-col lg:flex-row justify-between items-center gap-10 lg:gap-24 px-4">
      {/* LEFT SIDE */}
      <div className="w-full lg: mt-10 lg:mt-20">
        <div className="bg-white rounded-3xl shadow-lg p-3">
          <Image
            src={images[currentImage]}
            alt="Priorities"
            width={700}
            height={400}
            className="rounded-2xl w-full h-auto"
            priority
          />

          {/* Slider Dots */}
          <div className="flex justify-center gap-3 py-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                  currentImage === index ? "bg-green-700" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col gap-6 lg:gap-12 mt-6 lg:mt-15 w-full lg:w-auto items-center lg:items-start">
        {/* Mission */}
        <div className="bg-white rounded-[30px] shadow-lg w-full sm:w-[90%] lg:w-[500px] min-h-[180px] flex flex-col justify-center px-6 lg:px-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black font-['Times_New_Roman']">
            Our Mission
          </h2>

          <p className="text-base lg:text-lg text-black font-['Times_New_Roman']">
            To mobilize our citizenry in protecting, conserving, and managing
            the environment and natural resources for the present and future
            generations.
          </p>
        </div>

        {/* Vision */}
        <div className="bg-white rounded-[30px] shadow-lg w-full sm:w-[90%] lg:w-[500px] min-h-[180px] flex flex-col justify-center px-6 lg:px-10 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-black font-['Times_New_Roman']">
            Our Vision
          </h2>

          <p className="text-base lg:text-lg text-black font-['Times_New_Roman']">
            A nation enjoying and sustaining its natural resources and a clean
            and healthy environment.
          </p>
        </div>
      </div>
    </div>
  );
}
