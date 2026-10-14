# Rastro: sigue tu pedido

Proyecto de las clases de Supabase + Next.js del bootcamp de Código Facilito.

Rastro es la app de pedidos a domicilio de un restaurante, la Fonda La Esquina: el cliente sigue su pedido en vivo, como en las apps de comida. Cada clase le agrega una parte:

| Clase | Qué le agregamos | De Supabase |
|---|---|---|
| 1 | Los pedidos en una base de datos: verlos, crearlos y cambiarles el estado | Base de datos (Postgres) |
| 2 | Registro, inicio de sesión y que cada usuario vea solo sus pedidos | Auth y RLS |
| 3 | El pedido se actualiza en pantalla sin recargar | Realtime |
| 4 | Un correo al cliente cuando su pedido sale | Edge Functions y webhooks |
| 5 | La foto de entrega, guardada en privado | Storage |
| 6 | El historial del pedido y la moto en el mapa | Triggers y Broadcast |

## Cómo funcionan las clases

1. **En clase** primero va la teoría y luego construyo en vivo la parte de ese día. Tú miras, preguntas y entiendes; no hace falta copiar a la par lo que ves en pantalla.
2. **De tarea** construyes tú solo lo que viste, en tu propio proyecto.
3. **Si no te sale**, no pasa nada: toma el inicio de la siguiente clase, que ya lo trae hecho, y compáralo con lo tuyo para encontrar qué te faltó.

## Lo que necesitas

- Node.js 20.9 o más nuevo (revísalo con `node -v`)
- Git, o bajar el código en zip desde GitHub
- Una cuenta gratis en [Supabase](https://supabase.com)
- Un editor, por ejemplo VS Code

## Para empezar: la tarea de la clase 1

1. Crea un proyecto nuevo en Supabase. El plan gratis permite 2 proyectos activos: si ya tienes 2, pausa uno. Al crearlo, en Security, deja marcado "Enable Data API" y sin marcar "Enable automatic RLS". Si creas la tabla desde el Table Editor, deja prendido "Data API access": sin ese permiso la app recibe `permission denied for table pedidos`.
2. Baja el código y cámbiate al inicio de la clase 1:

   ```
   git clone https://github.com/rodrigo2392/rastreo-facilito.git
   cd rastreo-facilito
   git checkout clase-1-inicio
   ```

3. Copia `.env.example` como `.env.local` y pon la URL y la llave publishable de tu proyecto. Las encuentras en el panel de Supabase, en la página de inicio de tu proyecto, con el botón Copy (Project URL y Publishable key).
4. Instala y arranca:

   ```
   npm install
   npm run dev
   ```

   Si `npm install` muestra avisos que empiezan con `npm warn`, es normal; solo preocúpate si dice `ERR`.

5. Abre http://localhost:3000. Debes ver la página de pedidos con tres pedidos de ejemplo escritos en el código. La tarea es que la página los lea de tu tabla en Supabase, que el formulario guarde pedidos nuevos y que los botones les cambien el estado.

Con `npm run dev`, Next.js vuelve a leer `.env.local` cada vez que lo guardas (en la terminal sale `Reload env`): no hace falta reiniciar.

Antes de la tarea de la clase 2, en Authentication, Sign In / Providers, sección User Signups, apaga "Confirm email" y guarda con Save changes. El correo de Supabase sin configurar solo manda 2 por hora y nadie podría registrarse.

## Seguridad

Al terminar la clase 1 la tabla de pedidos no tiene RLS, a propósito, para ver el problema: cualquiera que tenga tu URL y tu llave publishable puede leer todos los pedidos (con direcciones y teléfonos), crear pedidos falsos y cambiarles el estado. La llave publishable es pública por diseño, así que esconderla no protege nada. En la clase 2 se cierra con autenticación y políticas RLS. Mientras tanto, no guardes datos reales.

La llave secreta (`sb_secret_`) se salta RLS: nunca va en el navegador ni en el repo, solo en el servidor y en los secretos de Supabase. `.env.local` ya está en `.gitignore`.

## Los puntos de cada clase

Cada clase tiene tres puntos, cada uno en su propio branch:

| Branch | Qué trae |
|---|---|
| `clase-3-inicio` | Con lo que arranca la clase: lo de la clase anterior más las piezas que ya vienen hechas |
| `clase-3-rescate` | Cómo queda a la mitad de la clase |
| `clase-3-final` | Cómo queda al terminar |

Sirven para comparar con lo tuyo al hacer la tarea. La clase 4 no tiene punto a la mitad: todo lo de esa clase pasa en el panel de Supabase.

Para cambiarte a un punto, por ejemplo al inicio de la clase 3:

```
git fetch
git checkout -f clase-3-inicio
```

`-f` descarta lo que hayas cambiado en los archivos del proyecto; si quieres conservar tu tarea, antes copia tu carpeta. Tu `.env.local` no se toca.

Sin git: en GitHub, elige el branch en el selector de branches, luego Code, Download ZIP; descomprímelo, copia ahí tu `.env.local` y corre `npm install`.

Desde la clase 6 hay una librería nueva (la del mapa): corre `npm install` antes de `npm run dev`.

Supabase pausa los proyectos gratis que pasan una semana sin uso. Si el tuyo está en pausa, reactívalo desde el panel; tarda unos minutos.

## El SQL de cada clase

Cada clase trae un archivo en `supabase/` que se pega en el SQL Editor de tu proyecto y se corre con Run. Tu proyecto de Supabase es el mismo todo el curso: si te saltaste una clase, corre su SQL antes de seguir.

| Clase | Archivo | Qué hace |
|---|---|---|
| 1 | `supabase/clase-1.sql` | Crea la tabla de pedidos con tres de ejemplo, sin RLS |
| 2 | `supabase/clase-2.sql` | Perfiles, el dueño de cada pedido, las políticas RLS y la cuenta de la tienda |
| 3 | `supabase/clase-3.sql` | Activa Realtime en la tabla de pedidos |
| 4 | `supabase/clase-4.sql` | El webhook: cuando cambia un pedido, la base llama a la función que manda el correo |
| 5 | `supabase/clase-5.sql` | El bucket de fotos de entrega y sus políticas: solo la tienda sube, y ves la foto si puedes ver el pedido |
| 6 | `supabase/clase-6.sql` | El historial del pedido, que llena un trigger (la moto en el mapa no necesita SQL) |

En la app solo se registran clientes, con su teléfono y su dirección; cada pedido los toma de ahí. La cuenta de la tienda se crea con la parte 3 de `supabase/clase-2.sql`: antes de correrla, cambia su correo y su contraseña.

Para ver la clase 3 en acción abre dos ventanas lado a lado: una normal con la tienda y una de incógnito con un cliente. Si la tienda cambia un pedido, la pantalla del cliente se actualiza sola.

## La función de la clase 4

La función que manda el correo corre en Supabase, no en Next.js. Todo se hace desde el panel, sin instalar nada:

1. Crea una cuenta gratis en [Resend](https://resend.com) y saca tu llave (empieza con `re_`).
2. En Edge Functions crea una función llamada `avisar-cliente` con el editor y pega el contenido de `supabase/functions/avisar-cliente/index.ts`.
3. En la pestaña Settings de la función apaga "Verify JWT with legacy secret": la función valida por su cuenta que la petición traiga tu llave secreta (`sb_secret_`).
4. En los secretos de Edge Functions agrega `RESEND_API_KEY` con tu llave de Resend y `CORREO_AVISOS` con el correo con el que abriste Resend. Mientras no tengas dominio propio, Resend solo te deja mandarte correos a ti.
5. En Integrations, Database Webhooks (la primera vez, Enable webhooks), crea uno para la tabla `pedidos` con el evento Update, de tipo Supabase Edge Functions, que llame a `avisar-cliente` y mande el encabezado `apikey` con tu llave secreta (en HTTP Headers, la flecha de Add header, Add secret key). También puedes correr `supabase/clase-4.sql` con tus datos.

Cuando la tienda marque un pedido como "En camino", te llega el correo. Si no llega, la respuesta está en los logs de la función, en el panel.

## La moto de la clase 6

En la tienda, cada pedido "En camino" tiene el botón "Salir a repartir": simula al repartidor y recorre una ruta grabada de la Roma a la Condesa, un punto por segundo. El cliente ve la moto moverse en su mapa, sin guardar nada en la base.

La casilla "Mandar en binario" cambia cómo viaja cada mensaje: como texto pesa unos 32 bytes y en binario pesa 8. Con 200 repartidores la diferencia ya no es de bytes: el plan gratis de Supabase aguanta 100 mensajes por segundo, así que hay que juntar todas las posiciones en un solo mensaje.

El mapa es OpenStreetMap con Leaflet; no pide llaves ni cuentas.

## Dónde vive cada cosa

| Archivo | Qué hace | Desde la clase |
|---|---|---|
| `app/page.tsx` | La página de pedidos: la tienda ve todos y el cliente solo los suyos | 1 |
| `app/acciones.ts` | Las Server Actions de los pedidos: crear uno, cambiarle el estado y subir la foto de entrega | 1 |
| `components/` | Las piezas visuales: formulario, tarjeta de pedido y etiqueta de estado | 1 |
| `lib/pedidos.ts` | El tipo de un pedido y el orden de sus estados | 1 |
| `lib/supabase/server.ts` | El cliente de Supabase para el servidor | 1 |
| `supabase/` | El SQL de cada clase | 1 |
| `app/login/` y `app/registro/` | Entrar, crear cuenta de cliente y salir | 2 |
| `proxy.ts` y `lib/supabase/proxy.ts` | Renuevan la sesión antes de cada petición | 2 |
| `lib/supabase/client.ts` | El cliente de Supabase para el navegador | 3 |
| `components/BarraProgreso.tsx` | Los cuatro pasos del pedido, para el cliente | 3 |
| `components/EnVivo.tsx` | Se suscribe a los cambios de pedidos (Realtime) y actualiza la página | 3 |
| `components/EnLinea.tsx` | El indicador de "la tienda está en línea" (Presence) | 3 |
| `lib/sonido.ts` | El "ding" que suena en la tienda cuando entra un pedido | 3 |
| `supabase/functions/avisar-cliente/` | La función que manda el correo (corre en Supabase, no en Next.js) | 4 |
| `components/FotoEntrega.tsx` | Muestra la foto de entrega | 5 |
| `next.config.ts` | Deja que un formulario mande fotos de hasta 10 MB (Next acepta 1 MB si no se lo dices) | 5 |
| `components/LineaDeTiempo.tsx` | El historial del pedido: cada estado con su hora | 6 |
| `components/Mapa.tsx` | El mapa con la moto (viene hecho) | 6 |
| `components/Simulador.tsx` | Simula al repartidor: manda su posición cada segundo por Broadcast | 6 |
| `components/SeguirMoto.tsx` | El cliente recibe esas posiciones y ve la moto moverse | 6 |
| `lib/ruta.ts` | La ruta grabada del repartidor | 6 |
| `lib/binario.ts` | Empacar y desempacar posiciones en binario | 6 |

Lo que viene de la documentación de Supabase conserva su nombre en inglés (`createClient`, `updateSession`); lo nuestro va en español.
