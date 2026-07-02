"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearAporte(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const monto = parseFloat(formData.get("monto") as string);
  const meta_id = formData.get("meta_id") as string;
  const nota = (formData.get("nota") as string) || null;

  const { error } = await supabase.from("aportes").insert({
    meta_id,
    usuario_id: user.id,
    monto,
    nota,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/aportes");
}

export async function eliminarAporte(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const { error } = await supabase
    .from("aportes")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/aportes");
}
