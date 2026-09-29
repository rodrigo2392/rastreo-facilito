"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// Server Actions: funciones que corren en el servidor
// y que un formulario puede llamar directamente.

export async function crearPedido(formData: FormData) {
  const supabase = await createClient();

  // La dirección y el teléfono los dio el cliente al registrarse.
  // No hace falta decir de quién es el perfil: la base solo te deja ver el tuyo.
  const { data: perfil, error: errorPerfil } = await supabase
    .from("perfiles")
    .select("direccion, telefono")
    .single();

  if (errorPerfil) throw new Error(errorPerfil.message);

  const { error } = await supabase.from("pedidos").insert({
    descripcion: String(formData.get("descripcion")),
    direccion: perfil.direccion,
    telefono: perfil.telefono,
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

// Clase 5: la tienda sube la foto de entrega de un pedido.
// Por ahora solo enseña en la terminal la foto que llegó; en la clase la guardamos en Supabase.
export async function subirFotoEntrega(formData: FormData) {
  const foto = formData.get("foto") as File;
  console.log("Llegó una foto:", foto.name, foto.size, "bytes");
}
