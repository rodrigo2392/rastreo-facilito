"use server";

// Entrar, registrarse y salir. Por ahora solo enseñan en la terminal
// lo que les llega; en la clase 2 las conectamos con Supabase Auth.

export async function entrar(formData: FormData) {
  console.log("Quiere entrar:", formData.get("correo"));
}

export async function registrarse(formData: FormData) {
  console.log("Quiere crear su cuenta:", {
    nombre: formData.get("nombre"),
    telefono: formData.get("telefono"),
    direccion: formData.get("direccion"),
    correo: formData.get("correo"),
  });
}

export async function salir() {
  console.log("Quiere salir");
}
