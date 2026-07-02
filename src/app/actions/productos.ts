"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function crearSeccion(formData: FormData) {
  const supabase = await createClient();
  const nombre = formData.get("nombre") as string;
  const orden = parseInt(formData.get("orden") as string) || 0;

  const { error } = await supabase.from("secciones").insert({ nombre, orden });
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function eliminarSeccion(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("secciones").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function crearProducto(formData: FormData) {
  const supabase = await createClient();
  const nombre = formData.get("nombre") as string;
  const seccion_id = formData.get("seccion_id") as string;
  const precioRaw = formData.get("precio_estimado") as string;

  const { error } = await supabase.from("productos").insert({
    nombre,
    seccion_id,
    precio_estimado: precioRaw ? parseFloat(precioRaw) : null,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function actualizarEstadoProducto(id: string, estado: string) {
  const supabase = await createClient();
  const updates: Record<string, unknown> = { estado };

  if (estado === "comprado") {
    updates.precio_real = 0;
  }

  const { error } = await supabase.from("productos").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function actualizarPrecioReal(id: string, precio_real: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("productos")
    .update({ precio_real })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function editarProducto(id: string, formData: FormData) {
  const supabase = await createClient();
  const nombre = formData.get("nombre") as string;
  const precioEstimadoRaw = formData.get("precio_estimado") as string;
  const estado = formData.get("estado") as string;
  const precioRealRaw = formData.get("precio_real") as string;
  const notas = (formData.get("notas") as string) || null;

  const { error } = await supabase
    .from("productos")
    .update({
      nombre,
      precio_estimado: precioEstimadoRaw ? parseFloat(precioEstimadoRaw) : null,
      estado,
      precio_real: precioRealRaw ? parseFloat(precioRealRaw) : null,
      notas,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}

export async function eliminarProducto(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/productos");
}
