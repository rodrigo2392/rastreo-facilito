// Clase 4: avisarle al cliente que su pedido va en camino.
// Corre en Supabase, no en Next.js: la llave de Resend nunca llega al navegador.
// En el panel se pega tal cual en Edge Functions, con el nombre "avisar-cliente".
import { withSupabase } from "npm:@supabase/server@1";

export default {
  // Solo responde a peticiones con la llave secreta: las que manda el webhook de la base.
  fetch: withSupabase({ auth: "secret" }, async (req) => {
    // El webhook manda el pedido como quedó (record) y como estaba antes (old_record).
    const { record: pedido, old_record: antes } = await req.json();

    // Solo avisamos cuando el pedido acaba de salir.
    if (pedido?.estado !== "en_camino" || antes?.estado === "en_camino") {
      return Response.json({ enviado: false, motivo: "El pedido no acaba de salir" });
    }

    const respuesta = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Fonda La Esquina <onboarding@resend.dev>",
        // Mientras no tengas dominio propio, Resend solo te deja mandarte correos a ti.
        to: Deno.env.get("CORREO_AVISOS"),
        subject: `Tu pedido ${pedido.id} va en camino`,
        text: `¡Ya salió tu pedido! ${pedido.descripcion} va en camino a ${pedido.direccion}.`,
      }),
    });

    const resultado = await respuesta.json();
    // Todo lo que imprimas aquí aparece en los logs de la función, en el panel.
    console.log("Resend respondió:", respuesta.status, resultado);

    return Response.json(
      { enviado: respuesta.ok, resultado },
      { status: respuesta.ok ? 200 : 500 }
    );
  }),
};
