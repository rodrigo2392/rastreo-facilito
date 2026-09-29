-- Clase 2: cada quien ve lo suyo.
-- Cada parte se pega en el SQL Editor de Supabase cuando toca en la clase.


-- PARTE 1 (viene hecha, se pega al arrancar la clase): perfiles
-- Cada cuenta tiene un perfil con su nombre, su teléfono, su dirección
-- y su rol: tienda o cliente.

create table public.perfiles (
  id uuid primary key references auth.users on delete cascade,
  nombre text,
  telefono text,
  direccion text,
  rol text not null default 'cliente'
);

alter table public.perfiles enable row level security;

create policy "Cada quien ve su perfil"
on public.perfiles for select to authenticated
using (id = auth.uid());

grant select on public.perfiles to authenticated;

-- Cada que alguien se registra, la base le crea su perfil sola
-- con los datos que dio al registrarse. Todos nacen clientes.
create function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfiles (id, nombre, telefono, direccion)
  values (
    new.id,
    new.raw_user_meta_data ->> 'nombre',
    new.raw_user_meta_data ->> 'telefono',
    new.raw_user_meta_data ->> 'direccion'
  );
  return new;
end;
$$;

create trigger al_registrarse
after insert on auth.users
for each row execute function public.crear_perfil();

-- Pregunta guardada: ¿la cuenta que está usando la app es de la tienda?
-- Puede leer todos los perfiles, pero solo contesta sí o no.
create function public.es_tienda()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.perfiles
    where id = auth.uid() and rol = 'tienda'
  );
$$;

grant execute on function public.es_tienda() to authenticated;


-- PARTE 2 (bloque 2, en vivo): RLS

-- 1. Cada pedido ahora tiene dueño: quien lo hizo. La base lo llena sola.
alter table public.pedidos
  add column cliente_id uuid references public.perfiles on delete cascade default auth.uid();

-- 2. Se activa RLS. Sin políticas, nadie ve nada, ni la tienda.
alter table public.pedidos enable row level security;

-- 3. Las reglas, primero en español:
--    el cliente ve sus pedidos y la tienda ve todos;
--    el cliente hace pedidos a su nombre;
--    solo la tienda cambia el estado.
create policy "El cliente ve sus pedidos y la tienda ve todos"
on public.pedidos for select to authenticated
using (cliente_id = auth.uid() or public.es_tienda());

create policy "El cliente hace pedidos a su nombre"
on public.pedidos for insert to authenticated
with check (cliente_id = auth.uid());

create policy "Solo la tienda cambia el estado"
on public.pedidos for update to authenticated
using (public.es_tienda());

-- Permiso para que las cuentas con sesión entren a la tabla.
grant select, insert, update on public.pedidos to authenticated;


-- PARTE 3 (bloque 2, viene hecha): la cuenta de la tienda
-- La tienda no se registra en la app: la damos de alta nosotros con esta migración.
-- Antes de darle Run, cambia el correo, la contraseña y el nombre.

do $$
declare
  correo text := 'tienda@fonda.test';
  contrasena text := 'cambia-esta-contrasena';
  nombre_tienda text := 'Fonda La Esquina';
  id_tienda uuid := gen_random_uuid();
begin
  -- La cuenta, igual que la crea Supabase cuando alguien se registra.
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change, email_change_token_new
  ) values (
    '00000000-0000-0000-0000-000000000000', id_tienda, 'authenticated', 'authenticated',
    correo, extensions.crypt(contrasena, extensions.gen_salt('bf')), now(),
    '{"provider": "email", "providers": ["email"]}', jsonb_build_object('nombre', nombre_tienda),
    now(), now(), '', '', '', ''
  );

  -- Con qué entra: su correo y su contraseña.
  insert into auth.identities (user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  values (
    id_tienda, id_tienda::text,
    jsonb_build_object('sub', id_tienda::text, 'email', correo, 'email_verified', true),
    'email', now(), now(), now()
  );

  -- Su perfil ya lo creó la base sola (parte 1) como cliente: lo volvemos tienda.
  update public.perfiles set rol = 'tienda' where id = id_tienda;
end $$;
