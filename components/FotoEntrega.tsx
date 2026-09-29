import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

// La foto de entrega está en un bucket público:
// cualquiera que tenga la liga la puede ver.
export default async function FotoEntrega({ ruta }: { ruta: string }) {
  const supabase = await createClient();
  const { data } = supabase.storage.from("entregas").getPublicUrl(ruta);

  return (
    <Image
      src={data.publicUrl}
      alt="Foto de entrega"
      width={640}
      height={480}
      // La foto viene de Supabase con su propia liga; Next no tiene que retocarla.
      unoptimized
      className="mt-4 h-auto w-full rounded-xl border border-zinc-200"
    />
  );
}
