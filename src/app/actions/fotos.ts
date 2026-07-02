"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function subirFoto(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const file = formData.get("file") as File;
  const descripcion = (formData.get("descripcion") as string) || null;

  if (!file || file.size === 0) throw new Error("Archivo requerido");

  const ext = file.name.split(".").pop();
  const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("fotos")
    .upload(filePath, file);

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabase.storage.from("fotos").getPublicUrl(filePath);
  const url = urlData.publicUrl;

  const { error: dbError } = await supabase.from("fotos").insert({
    usuario_id: user.id,
    url,
    descripcion,
  });

  if (dbError) throw new Error(dbError.message);
  revalidatePath("/galeria");
}

export async function eliminarFoto(id: string, url: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");

  const filePath = url.split("/fotos/")[1];
  if (filePath) {
    await supabase.storage.from("fotos").remove([filePath]);
  }

  const { error } = await supabase
    .from("fotos")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id);

  if (error) throw new Error(error.message);
  revalidatePath("/galeria");
}
