import ApplicationAdminSidebar from "@/components/application-admin/sidebar";

export default function ApplicationAdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#b1b1b1]">
      <ApplicationAdminSidebar />
      <main className="flex-1 py-16 px-4 overflow-auto bg-[#F2F2F4]">
        {children}
      </main>
    </div>
  );
}
