"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearMeta(formData: FormData) {
  const supabase = await createClient();
  const nombre = formData.get("nombre") as string;
  const monto_objetivo = parseFloat(formData.get("monto_objetivo") as string);
  const descripcion = (formData.get("descripcion") as string) || null;

  const { error } = await supabase.from("metas").insert({
    nombre,
    monto_objetivo,
    descripcion,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
}

export async function eliminarMeta(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("metas").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
}
