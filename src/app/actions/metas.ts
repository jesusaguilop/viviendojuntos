"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearMeta(formData: FormData) {
  const supabase = await createClient();
  const nombre = formData.get("nombre") as string;
  const montoRaw = (formData.get("monto_objetivo") as string).replace(/\./g, "").replace(",", ".");
  const monto_objetivo = parseFloat(montoRaw);
  const descripcion = (formData.get("descripcion") as string) || null;
  const fecha_limite = (formData.get("fecha_limite") as string) || null;

  if (isNaN(monto_objetivo) || monto_objetivo <= 0) {
    throw new Error("Monto inválido");
  }

  const data: Record<string, unknown> = {
    nombre,
    monto_objetivo,
    descripcion,
  };
  if (fecha_limite) data.fecha_limite = fecha_limite;

  const { error } = await supabase.from("metas").insert(data);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function eliminarMeta(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("metas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
