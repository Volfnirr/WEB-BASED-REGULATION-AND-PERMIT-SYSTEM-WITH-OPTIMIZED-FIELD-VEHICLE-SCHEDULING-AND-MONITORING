"use client";

import { useState } from "react";

export default function ServicesPage() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // Here is where each item gets its own unique description!
  const services = [
    {
      title: "Application for Agricultural Free Patent (RO-L-03)",
      hasSubMenu: false,
      description:
        "To apply for an Agricultural Free Patent (RO-L-03), submit an application form, Technical description of the land, LRA clearance / MTC or RTC clearance, Tax Declaration, Deed of Conveyance, Barangay and Municipal Posting, Birth Certificate (Applcant must be natural born Filipino Citizen)",
    },
    {
      title: "Issuance of Tree Cutting Permit (RO-F-06)",
      hasSubMenu: false,
      description:
        "To secure a Tree Cutting Permit (RO-F-06), you must submit a formal application letter, proof of land ownership (such as a land title), clear photographs of the specific trees, an official LGU Barangay/Municipal Endorsement or Certification of No Objection, and a technical inventory report alongside applicable processing.",
    },
    {
      title: "Application for Chainsaw Registration (RO-F-04)",
      hasSubMenu: false,
      description:
        "To register a chainsaw under Application for Chainsaw Registration (RO-F-04), you must submit a completed application form, Official Receipt of Chainsaw Purchase (one (1) certified copy and 1 original for verification), SPA if the applicant is not the owner of the chainsaw, Stencil Serial Number of Chainsaw, Detailed Specification of Chainsaw (e.g, brand, model, engine capacity, etc), Notarized Deed of Absolute Sale, if transfer of ownersship (1 original), and Chainsaw to be registered ."
    },
    {
      title: "Application for Residential Free Patent (RO-L-04)",
      hasSubMenu: false,
      description:
        "To apply for a residential free patent under Republic Act No. 10023 (RO-L-04), you must submit a completed application form, Technical Description of the land (Lot data computation and Cadastal Map), LRA Clearance/ MTC or RTC Clearance, Deed of Conveyance (EJS/DOS/Deed of donation/Waiver of rights, etc), Zoning Clearance from Municipality Planning and Devt Office, Barangay Posting and four (4) documentary stamp.",
        },
  ];

  return (
    <div
      className="relative w-full flex-grow flex flex-col min-h-[calc(100vh-80px)]"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'San Francisco', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div className="relative z-10 flex flex-col w-full h-full pt-10 pb-16">
        <main className="flex-grow px-6 md:px-12 flex flex-col items-center">
          <div className="w-full max-w-4xl space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                >
                  <h2 className="text-lg font-bold text-[#1a5c38] text-left">
                    {service.title}
                  </h2>
                  <span className="text-2xl text-gray-800">
                    {openIndex === index ? "▲" : "▼"}
                  </span>
                </button>

                {openIndex === index && (
                  <div className="px-8 pb-6 bg-white">
                    <div className="space-y-4 mt-2 border-t border-gray-100 pt-4">
                      {service.hasSubMenu ? (
                        service.subItems.map((subItem, subIndex) => (
                          <div
                            key={subIndex}
                            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                          >
                            <div className="flex-1">
                              <span className="text-gray-800 font-medium text-base">
                                {subItem.name}
                              </span>

                              <p className="text-gray-600 text-sm mt-1">
                                {subItem.description}
                              </p>
                            </div>

                            <button className="bg-[#5cb87a] hover:bg-[#4cae6c] text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2 transition-colors shadow-sm shrink-0">
                              Apply
                              <svg
                                className="w-4 h-4 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"></path>
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          {/* This code automatically pulls the specific description from the list above */}
                          <p className="text-gray-600 text-base flex-1 whitespace-pre-wrap">
                            {service.description}
                          </p>

                          <button className="bg-[#5cb87a] hover:bg-[#4cae6c] text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2 transition-colors shadow-sm shrink-0">
                            Apply
                            <svg
                              className="w-4 h-4 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}