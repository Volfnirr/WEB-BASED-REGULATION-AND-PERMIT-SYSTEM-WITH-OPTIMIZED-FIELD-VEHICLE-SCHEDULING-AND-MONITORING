import Navbar from "@/components/landing-page/navbar";
import ServicesPage from "@/components/landing-page/services";
import Home from "@/components/landing-page/home";
import AboutUs from "@/components/landing-page/aboutus";
import InfoCard from "@/components/ui/infocard.js";

export default function LandingPage() {
  return (
    <>
      <div
        className="min-h-screen bg-cover bg-center bg-fixed relative"
        style={{ backgroundImage: "url('background.png')" }}
      >
        <div className="absolute inset-0 bg-green-900/60 mix-blend-multiply pointer-events-none z-0" />

        <div className="relative z-10">
          <Navbar />
          <section id="home" className="scroll-mt-64 ">
            <Home />
          </section>
          <section id="aboutus">
            <AboutUs />
          </section>
          <section id="services">
            <ServicesPage />
          </section>
          {/*
          example 
          <div className="  w-full left-50% right-50%">
            <InfoCard
              className="pl-500px"
              departmentName="name"
              description="asda"
              bg="bg-blue-500"
            />
          </div> */}
        </div>
      </div>
    </>
  );
}
