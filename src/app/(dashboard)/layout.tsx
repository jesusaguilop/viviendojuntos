import Header from "@/components/Header";
import NotificationProvider from "@/components/NotificationProvider";
import { ToastProvider } from "@/lib/toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-6">
        <ToastProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </ToastProvider>
      </main>
    </div>
  );
}
