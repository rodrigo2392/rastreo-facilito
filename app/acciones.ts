"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Server Actions: funciones que corren en el servidor
// y que un formulario puede llamar directamente.

export async function crearPedido(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.from("pedidos").insert({
    descripcion: String(formData.get("descripcion")),
    direccion: String(formData.get("direccion")),
    telefono: String(formData.get("telefono")),
  });

  if (error) throw new Error(error.message);

  // Vuelve a renderizar la página para que aparezca el pedido nuevo.
  revalidatePath("/");
}

export async function cambiarEstado(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("pedidos")
    .update({ estado: String(formData.get("estado")) })
    .eq("id", Number(formData.get("id")));

  if (error) throw new Error(error.message);

  revalidatePath("/");
}
