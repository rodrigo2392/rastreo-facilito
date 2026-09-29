"use server";

// Server Actions: funciones que corren en el servidor
// y que un formulario puede llamar directamente.
// Por ahora solo enseñan en la terminal lo que les llega del formulario;
// en la clase 1 las conectamos con Supabase.

export async function crearPedido(formData: FormData) {
  console.log("Llegó un pedido nuevo:", {
    descripcion: formData.get("descripcion"),
    direccion: formData.get("direccion"),
    telefono: formData.get("telefono"),
  });
}

export async function cambiarEstado(formData: FormData) {
  console.log("Cambiar el estado:", {
    id: formData.get("id"),
    estado: formData.get("estado"),
  });
}
