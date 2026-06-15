import Navbar from "@/components/landing-page/navbar";
import ServicesPage from "@/components/landing-page/services"
import LoginPage from "@/components/landing-page/login"
import CustomInput from "@/components/landing-page/CustomInput"

export default function Home() {
  return (
    <>
      <Navbar></Navbar>
      <section id="home" className="scroll-mt-64"></section>
      <section id="aboutus"></section>
     <section id="services"> <ServicesPage /></section>
     <section id="login"><LoginPage /></section>
      <CustomInput />
    </>
  );
}
