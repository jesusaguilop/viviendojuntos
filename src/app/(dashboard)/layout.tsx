import Header from "@/components/Header";
import MobileNav from "@/components/MobileNav";
import NotificationProvider from "@/components/NotificationProvider";
import { ToastProvider } from "@/lib/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col pb-14 md:pb-0">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-4 md:py-6">
        <ToastProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ToastProvider>
      </main>
      <MobileNav />
    </div>
  );
}
