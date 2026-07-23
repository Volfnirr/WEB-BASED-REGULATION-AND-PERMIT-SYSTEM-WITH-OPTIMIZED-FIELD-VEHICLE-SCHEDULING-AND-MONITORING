import Link from "next/link";
export default function ThankYouModal({ onClose }) {
  return (
    <div className="fixed inset-y-0 left-0 right-0 md:left-64 z-50 flex items-center justify-center pt-10 bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 md:p-10 text-center transform transition-all animate-scaleUp">
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-3">
          Thank You For Your Application!
        </h3>
        <p className="text-sm md:text-base font-medium text-gray-700 mb-8 max-w-sm mx-auto leading-relaxed">
          Your application has been set! You can click button below to view your
          application status.
        </p>
        <div className="flex flex-row justify-between">
          <button
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-900 text-white font-bold text-xs md:text-sm rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95"
            onClick={onClose}
          >
            Close
          </button>
          <Link
            href="/applicant/my-applications"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8AD29D] hover:bg-[#74c48a] text-gray-900 font-bold text-xs md:text-sm rounded-full shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            <span>View Application status</span>
            <span className="text-base leading-none">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
