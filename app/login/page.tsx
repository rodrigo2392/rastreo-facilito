import Link from "next/link";
import { entrar } from "./acciones";

const campo =
  "rounded-xl border border-zinc-300 bg-white px-4 py-3 outline-none focus:border-zinc-900";

// Inicio de sesión: Supabase Auth crea la sesión y la guarda en cookies.
export default async function Login(props: PageProps<"/login">) {
  const { error } = await props.searchParams;

  return (
    <main className="mx-auto w-full max-w-sm px-4 py-16">
      <p className="text-sm font-semibold text-orange-600">Fonda La Esquina</p>
      <h1 className="text-3xl font-bold tracking-tight">Entra a Rastro</h1>

      <form
        action={entrar}
        className="mt-8 grid gap-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <input name="correo" type="email" required placeholder="Correo" className={campo} />
        <input name="contrasena" type="password" required placeholder="Contraseña" className={campo} />
        <button className="rounded-xl bg-orange-600 px-4 py-3 font-semibold text-white hover:bg-orange-500">
          Entrar
        </button>
      </form>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      )}

      <p className="mt-6 text-center text-sm text-zinc-600">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-orange-600 hover:underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
