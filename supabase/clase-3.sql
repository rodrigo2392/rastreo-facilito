-- Clase 3: tu pedido en vivo.
-- Enciende Realtime en la tabla de pedidos.
-- Sin esta línea no llega ningún aviso, y tampoco sale ningún error.
alter publication supabase_realtime add table public.pedidos;
