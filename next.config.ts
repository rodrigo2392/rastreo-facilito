import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Clase 5: un formulario acepta 1 MB por defecto y las fotos del celular pesan más.
      // El límite de verdad (5 MB por foto) lo pone el bucket de Supabase.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
