"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function entrar(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("correo")),
    password: String(formData.get("contrasena")),
  });

  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);
  redirect("/");
}

// Solo los clientes se registran aquí; la tienda se crea desde la base.
export async function registrarse(formData: FormData) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: String(formData.get("correo")),
    password: String(formData.get("contrasena")),
    // Estos datos viajan con la cuenta y la base los copia a su perfil.
    options: {
      data: {
        nombre: String(formData.get("nombre")),
        telefono: String(formData.get("telefono")),
        direccion: String(formData.get("direccion")),
      },
    },
  });

  if (error) redirect(`/registro?error=${encodeURIComponent(error.message)}`);

  // Si el proyecto pide confirmar el correo, todavía no hay sesión.
  if (!data.session) {
    const aviso = "Tu proyecto pide confirmar el correo. Apaga esa opción en Authentication.";
    redirect(`/registro?error=${encodeURIComponent(aviso)}`);
  }

  redirect("/");
}

export async function salir() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
