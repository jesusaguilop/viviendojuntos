"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "./StatusBadge";
import ThemeToggle from "./ThemeToggle";
import type { Profile } from "@/types";
import { cerrarSesion } from "@/app/actions/auth";

export default function Header() {
  const [user, setUser] = useState<Profile | null>(null);
  const [porcentajeGlobal, setPorcentajeGlobal] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user!.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) setUser(profile as Profile);
          });
      }
    });

    cargarProgresoGlobal(supabase);
  }, []);

  const cargarProgresoGlobal = async (supabase: ReturnType<typeof createClient>) => {
    const { data: metas } = await supabase.from("metas").select("*");
    if (!metas || metas.length === 0) return;

    const { data: aportes } = await supabase.from("aportes").select("monto");
    if (!aportes) return;

    const totalObjetivo = metas.reduce((s, m) => s + Number(m.monto_objetivo), 0);
    const totalAportado = aportes.reduce((s, a) => s + Number(a.monto), 0);
    setPorcentajeGlobal(Math.min(Math.round((totalAportado / totalObjetivo) * 100), 100));
  };

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-30 shadow-sm">
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-2 md:py-3 flex items-center justify-between gap-2">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-xs md:text-sm group-hover:scale-105 transition-transform">
            VJ
          </div>
          <div className="hidden sm:block">
            <span className="text-base md:text-lg font-extrabold text-text">
              Viviendo Juntos
            </span>
          </div>
          <div className="hidden sm:block">
            <StatusBadge porcentaje={porcentajeGlobal} />
          </div>
        </Link>

        <div className="flex items-center gap-1 md:gap-2">
          <div className="hidden md:flex items-center gap-1">
            <StatusBadge porcentaje={porcentajeGlobal} />
          </div>

          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-1.5 md:gap-2 ml-1 md:ml-2 pl-1 md:pl-2 border-l border-border">
              <div
                className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0"
                style={{ backgroundColor: user.avatar_color }}
              >
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm text-text-secondary font-medium">
                {user.nombre}
              </span>
              <form action={cerrarSesion}>
                <button
                  type="submit"
                  className="text-xs text-text-secondary hover:text-danger transition cursor-pointer font-medium"
                >
                  Salir
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
