-- Clase 4: el webhook que llama a la función cuando cambia un pedido.
-- Lo normal es crearlo en el panel: Database, Webhooks, Create a new hook.
-- Esto es exactamente lo mismo, escrito en SQL.
-- Antes de correrlo cambia TU-PROYECTO y TU-LLAVE-SECRETA (la que empieza con sb_secret_).

-- Cada que cambie un pedido, la base llama a la función avisar-cliente
-- y le manda el pedido como quedó y como estaba antes.
create trigger avisar_al_cliente
after update on public.pedidos
for each row
execute function supabase_functions.http_request(
  'https://TU-PROYECTO.supabase.co/functions/v1/avisar-cliente',
  'POST',
  '{"Content-Type":"application/json","apikey":"TU-LLAVE-SECRETA"}',
  '{}',
  '5000'
);
