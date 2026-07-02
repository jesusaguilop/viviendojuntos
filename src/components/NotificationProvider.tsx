"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Toast {
  id: string;
  title: string;
  body: string;
  type: "aporte" | "nota" | "meta";
}

export default function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserId(data.user.id);

        if ("Notification" in window) {
          setNotificationPermission(Notification.permission);
          if (Notification.permission === "default") {
            Notification.requestPermission().then(setNotificationPermission);
          }
        }
      }
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    const aportesChannel = supabase
      .channel("aportes-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "aportes" },
        async (payload) => {
          const newAporte = payload.new as { usuario_id: string; monto: number; meta_id: string };
          if (newAporte.usuario_id === userId) return;

          const { data: perfil } = await supabase
            .from("profiles")
            .select("nombre")
            .eq("id", newAporte.usuario_id)
            .single();

          const { data: meta } = await supabase
            .from("metas")
            .select("nombre")
            .eq("id", newAporte.meta_id)
            .single();

          const nombre = perfil?.nombre ?? "Alguien";
          const metaNombre = meta?.nombre ?? "una meta";

          showNotification({
            title: "💰 Nuevo aporte",
            body: `${nombre} aportó $${Number(newAporte.monto).toLocaleString("es-ES")} a ${metaNombre}`,
            type: "aporte",
          });
        },
      )
      .subscribe();

    const notasChannel = supabase
      .channel("notas-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notas" },
        async (payload) => {
          const newNota = payload.new as { usuario_id: string; contenido: string };
          if (newNota.usuario_id === userId) return;

          const { data: perfil } = await supabase
            .from("profiles")
            .select("nombre")
            .eq("id", newNota.usuario_id)
            .single();

          const nombre = perfil?.nombre ?? "Alguien";

          showNotification({
            title: "💬 Nuevo mensaje",
            body: `${nombre}: ${newNota.contenido.slice(0, 80)}${newNota.contenido.length > 80 ? "..." : ""}`,
            type: "nota",
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(aportesChannel);
      supabase.removeChannel(notasChannel);
    };
  }, [userId]);

  const showNotification = (toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev.slice(-4), { ...toast, id }]);

    if (notificationPermission === "granted") {
      new Notification(toast.title, {
        body: toast.body,
        icon: "/favicon.ico",
      });
    }

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  return (
    <>
      {children}

      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="glass-card rounded-xl p-4 shadow-lg animate-slide-up cursor-pointer"
            onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          >
            <p className="font-bold text-text text-sm">{toast.title}</p>
            <p className="text-text-secondary text-sm mt-0.5">{toast.body}</p>
          </div>
        ))}
      </div>
    </>
  );
}
