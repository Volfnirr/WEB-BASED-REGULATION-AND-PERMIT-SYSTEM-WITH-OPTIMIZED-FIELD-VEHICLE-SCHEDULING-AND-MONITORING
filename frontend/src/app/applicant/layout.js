export default function PatientLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#b1b1b1]">
      <aside className="w-64">
        <div>
          <p>TEMP</p>
        </div>
      </aside>

      <main className="flex-1 p-6 overflow-auto bg-[#eaeaea] text-white">
        {children}
      </main>
    </div>
  );
}
