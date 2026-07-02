import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
