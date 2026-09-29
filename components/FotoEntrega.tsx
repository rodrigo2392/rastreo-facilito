import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

// La foto de entrega está en un bucket privado:
// se pide una liga firmada que solo sirve 60 segundos.
export default async function FotoEntrega({ ruta }: { ruta: string }) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("entregas").createSignedUrl(ruta, 60);

  if (error) {
    return <p className="mt-4 text-sm text-red-700">No se pudo mostrar la foto: {error.message}</p>;
  }

  return (
    <Image
      src={data.signedUrl}
      alt="Foto de entrega"
      width={640}
      height={480}
      // La foto viene de Supabase con su propia liga; Next no tiene que retocarla.
      unoptimized
      className="mt-4 h-auto w-full rounded-xl border border-zinc-200"
    />
  );
}
