import { createClient } from "@/lib/supabase/server";
import GalleryGrid from "@/components/GalleryGrid";
import SubirFotoForm from "@/components/SubirFotoForm";

export default async function GaleriaPage() {
  const supabase = await createClient();

  const { data: fotos } = await supabase
    .from("fotos")
    .select("*, profiles:usuario_id(nombre)")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold text-text">Galería</h1>
          <p className="text-text-secondary text-xs md:text-sm mt-0.5">
            Fotos e ideas para el hogar
          </p>
        </div>
        <div className="shrink-0">
          <SubirFotoForm />
        </div>
      </div>

      {!fotos || fotos.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-8 md:p-12 text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-secondary/30 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-text-secondary text-base md:text-lg font-medium">
            No hay fotos todavía
          </p>
          <p className="text-text-secondary/60 text-xs md:text-sm mt-1">
            Suban fotos de ideas, muebles o decoración
          </p>
        </div>
      ) : (
        <GalleryGrid fotos={fotos} userId={user?.id} />
      )}
    </div>
  );
}
