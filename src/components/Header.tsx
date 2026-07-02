"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "./StatusBadge";
import ThemeToggle from "./ThemeToggle";
import type { Profile } from "@/types";
import { cerrarSesion } from "@/app/actions/auth";

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<Profile | null>(null);
  const [porcentajeGlobal, setPorcentajeGlobal] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const navLinks = [
    { href: "/", label: "Inicio", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/aportes", label: "Aportes", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { href: "/productos", label: "Productos", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
    { href: "/notas", label: "Notas", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" },
  ];

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-extrabold text-sm group-hover:scale-105 transition-transform">
            VJ
          </div>
          <div className="hidden sm:block">
            <span className="text-lg font-extrabold text-text">
              Viviendo Juntos
            </span>
          </div>
          <StatusBadge porcentaje={porcentajeGlobal} />
        </Link>

        <div className="flex items-center gap-1">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-sm"
                      : "text-text-secondary hover:bg-secondary/50 hover:text-text"
                  }`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <ThemeToggle />

          {user && (
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-border">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                style={{ backgroundColor: user.avatar_color }}
              >
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-text-secondary hidden sm:block font-medium">
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

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:bg-secondary/50 transition cursor-pointer"
            aria-label="Menú"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border px-4 py-2 bg-surface animate-slide-down">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-secondary/50"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
          <div className="border-t border-border mt-2 pt-2 px-3">
            <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
