"use client";

import { useState } from "react";
import Image from "next/image";
import CustomInput from "@/components/landing-page/CustomInput";

const modalH3 =
  "text-xs font-bold text-green-800 mt-4 mb-1.5 pb-1 border-b border-gray-200 uppercase tracking-[0.04em]";
const modalP = "text-[13px] leading-7 text-[#444] mb-3";
const modalStrong = "text-[#1a1a1a]";

export default function AuthSection() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [showTerms, setShowTerms] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log("Processing login for:", data.identifier);
    console.log("Processing password:", data.password);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log("Form submitted data (Frontend only):", data);
  };

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

          {/* === LOGIN VIEW === */}
          {isLoginView ? (
            <div className="animate-in fade-in zoom-in duration-300">
              <form
                onSubmit={handleLoginSubmit}
                className="flex flex-col gap-4 text-left"
              >
                <CustomInput
                  label="UserName or Email"
                  type="text"
                  id="identifier"
                  name="identifier"
                  placeholder="e.g. juan.delacruz"
                  required={true}
                />
                <CustomInput
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  required={true}
                />

                <button
                  type="submit"
                  className="w-full py-3 mt-2 bg-green-700 text-white font-bold rounded text-sm transition-colors duration-300 hover:bg-green-800"
                >
                  Log In
                </button>
              </form>

              <div className="text-[12px] text-gray-600 mt-6">
                <span>Don&apos;t have an account? </span>{" "}
                <button
                  onClick={() => setIsLoginView(false)}
                  className="text-blue-600 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
                >
                  Sign up
                </button>
              </div>
            </div>
          ) : (
            /* === SIGNUP VIEW === */
            <div className="animate-in fade-in zoom-in duration-300">
              <form
                onSubmit={handleRegisterSubmit}
                className="flex flex-col gap-4 text-left"
              >
                <CustomInput
                  label="Username"
                  type="text"
                  id="username"
                  name="username"
                  required={true}
                />
                <CustomInput
                  label="Full name"
                  type="text"
                  id="fullname"
                  name="fullname"
                  required={true}
                />
                <CustomInput
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  required={true}
                />
                <CustomInput
                  label="Confirm Password"
                  type="password"
                  id="confirmpassword"
                  name="confirmpassword"
                  required={true}
                />
                <CustomInput
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  required={true}
                />

                <div className="flex flex-row items-center gap-2">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    required
                    className="cursor-pointer"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-xs text-gray-500 cursor-pointer"
                  >
                    I have read and accept{" "}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-blue-600 font-bold text-xs cursor-pointer hover:underline p-0 bg-transparent border-none inline"
                    >
                      terms and conditions
                    </button>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 mt-2 bg-green-700 text-white font-bold rounded text-sm transition-colors duration-300 hover:bg-green-800"
                >
                  Register
                </button>
              </form>

              <div className="text-[12px] text-gray-600 mt-6">
                <span>Already have an account? </span>{" "}
                <button
                  onClick={() => setIsLoginView(true)}
                  className="text-blue-600 font-bold bg-transparent border-none p-0 cursor-pointer hover:underline"
                >
                  Log in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === TERMS MODAL === */}
      <div
        className={`fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 transition-opacity duration-200 ${
          showTerms
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-white rounded-lg w-full max-w-[580px] max-h-[85vh] flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.25)] transition-all duration-200 overflow-hidden ${
            showTerms ? "translate-y-0 scale-100" : "translate-y-5 scale-[0.97]"
          }`}
        >
          <div className="pt-5 px-6 pb-4 border-b border-gray-200 flex items-center gap-2.5 bg-green-700">
            <span className="text-[15px] font-bold text-white flex-1 text-left">
              Terms and Conditions
            </span>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="bg-white/20 w-7 h-7 rounded-full cursor-pointer text-base text-white flex items-center justify-center transition-colors duration-150 hover:bg-white/35 border-none"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-5 px-6 text-left [scrollbar-width:thin] [scrollbar-color:#ccc_transparent]">
            <p className={modalP}>
              The following Terms and Conditions contain significant agreements
              involving all users of the{" "}
              <strong className={modalStrong}>
                Provincial Environment and Natural Resources Office (PENRO)
                Pampanga Online Application System.
              </strong>{" "}
              Please review them carefully.
            </p>

            <h3 className={modalH3}>1. Parties & Definitions</h3>
            <p className={modalP}>
              All terms{" "}
              <strong className={modalStrong}>You, Your, and Yours</strong>{" "}
              refer to the Online PMS user — the individual who has registered
              or is attempting to register an account.{" "}
              <strong className={modalStrong}>We, Us, and Our</strong> refer to
              PENRO Pampanga. <strong className={modalStrong}>System</strong>{" "}
              refers to the Online PMS.
            </p>

            <h3 className={modalH3}>2. Account & Credentials</h3>
            <p className={modalP}>
              Your <strong className={modalStrong}>Username</strong> is the
              email address you provide during registration.{" "}
              <strong className={modalStrong}>Your access</strong> or{" "}
              <strong className={modalStrong}>system account</strong> refers to
              the combination of your email address and password registered in
              the system. The terms username and email address are used
              interchangeably. You are solely responsible for maintaining the
              confidentiality of your credentials.
            </p>

            <h3 className={modalH3}>
              3. Confidential Business Information (CBI)
            </h3>
            <p className={modalP}>
              The term{" "}
              <strong className={modalStrong}>
                Confidential Business Information (CBI)
              </strong>{" "}
              refers to information considered a trade secret — any formula,
              pattern, compilation, program, device, method, technique, or
              process whose economic value depends on remaining secret. You
              agree not to disclose CBI to any unauthorized third party.
            </p>

            <h3 className={modalH3}>4. User Conduct & Compliance</h3>
            <p className={modalP}>
              By registering, you agree to use the system responsibly and in
              full compliance with applicable{" "}
              <strong className={modalStrong}>
                Philippine laws, DENR regulations
              </strong>
              , and the policies set by PENRO Pampanga. Prohibited activities
              include submitting false information, unauthorized access,
              uploading harmful content, and impersonating others.
            </p>

            <h3 className={modalH3}>5. Consequences of Violation</h3>
            <p className={modalP}>
              Unauthorized access, misrepresentation, or misuse of the system
              may result in{" "}
              <strong className={modalStrong}>
                suspension of your account
              </strong>{" "}
              and appropriate legal action under applicable laws, including the
              Cybercrime Prevention Act of 2012 (RA 10175).
            </p>

            <h3 className={modalH3}>6. Amendments</h3>
            <p className={modalP}>
              PENRO Pampanga reserves the right to update these Terms and
              Conditions at any time. Continued use of the system after changes
              are posted constitutes your acceptance of the revised terms.
            </p>

            <h3 className={modalH3}>7. Governing Law</h3>
            <p className={modalP}>
              These Terms and Conditions shall be governed by and construed in
              accordance with the laws of the Republic of the Philippines.
              Disputes shall be subject to the jurisdiction of the appropriate
              Philippine courts.
            </p>
          </div>

          <div className="py-3.5 px-6 border-t border-gray-200 flex justify-end">
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              className="py-2.5 px-6 rounded text-[13px] font-bold cursor-pointer border-none bg-green-700 text-white transition-colors duration-300 hover:bg-green-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
