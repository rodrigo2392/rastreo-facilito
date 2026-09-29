-- Clase 5: la foto de entrega.
-- Cada parte se pega en el SQL Editor de Supabase cuando toca en la clase.


-- PARTE 1 (bloque 1): el bucket público

-- El pedido guarda dónde quedó su foto de entrega.
alter table public.pedidos add column foto_entrega text;

-- Un bucket público para las fotos: solo imágenes y máximo 5 MB por foto.
-- En el panel es lo mismo: Storage, New bucket.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('entregas', 'entregas', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']);

-- Sin esta regla la subida falla con "new row violates row-level security policy":
-- Storage tiene RLS activo: subir requiere una política aunque el bucket sea público.
create policy "Solo la tienda sube fotos de entrega"
on storage.objects for insert to authenticated
with check (bucket_id = 'entregas' and public.es_tienda());


-- PARTE 2 (bloque 2): el bucket privado

-- El bucket deja de ser público. Ojo: una liga pública que ya se abrió puede seguir
-- sirviendo hasta una hora, porque quedó en el caché.
update storage.buckets set public = false where id = 'entregas';

-- Ves la foto si puedes ver su pedido. La carpeta de cada foto es el número
-- de su pedido (por ejemplo 12/foto.jpeg), y las reglas de la clase 2
-- deciden qué pedidos ve cada quien.
create policy "Ves la foto si puedes ver el pedido"
on storage.objects for select to authenticated
using (
  bucket_id = 'entregas'
  and exists (
    select 1 from public.pedidos
    where pedidos.id::text = (storage.foldername(name))[1]
  )
);
