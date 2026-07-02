"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import StatusBadge from "./StatusBadge";
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
    { href: "/", label: "Inicio" },
    { href: "/aportes", label: "Aportes" },
    { href: "/productos", label: "Productos" },
    { href: "/notas", label: "Notas" },
  ];

  return (
    <header className="bg-surface border-b border-border sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-extrabold text-primary whitespace-nowrap">
            Plan: viviendo juntos
          </span>
          <StatusBadge porcentaje={porcentajeGlobal} />
        </Link>

        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-secondary/50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {user && (
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: user.avatar_color }}
              >
                {user.nombre.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-text-secondary hidden sm:block">
                {user.nombre}
              </span>
              <form action={cerrarSesion}>
                <button
                  type="submit"
                  className="text-xs text-text-secondary hover:text-danger transition cursor-pointer"
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
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              {menuOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="md:hidden border-t border-border px-4 py-2 bg-surface animate-fade-in">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-secondary/50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
