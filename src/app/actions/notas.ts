"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearNota(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const contenido = formData.get("contenido") as string;

  const { error } = await supabase
    .from("notas")
    .insert({ usuario_id: user.id, contenido });
  if (error) throw new Error(error.message);
  revalidatePath("/notas");
}

export async function eliminarNota(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("notas")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/notas");
}
