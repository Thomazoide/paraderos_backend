# Paraderos – Backend (Municipalidad)

Backend para la plataforma de monitoreo y gestión de limpieza de paraderos. Permite registrar paraderos, generar órdenes de trabajo con rutas, gestionar fichas de visita (antes/después), y habilitar el seguimiento en tiempo real de los trabajadores en terreno.

Este repo contiene únicamente el backend (NestJS + TypeORM + MariaDB). También se planifica un frontend web y una app móvil (ver Roadmap).

## Estado Actual
- Implementado:
	- `BusStopController` (`/paraderos`) con operaciones básicas: crear/actualizar, listar, buscar y eliminar.
	- `BusStopService` con persistencia vía TypeORM.
	- `EntryService` (parcial; sin controlador asociado).
	- Configuración base de NestJS, carga de variables de entorno y bootstrap.
- Pendiente de integrar/corregir (backend):
	- Registrar entidades en TypeORM (`entities: [...]` o `autoLoadEntities: true`).
	- Arreglar `BusStopModule` para usar `BusStopController` como controller.
	- Añadir módulos, servicios y controladores para el resto de entidades.
	- Añadir DTOs y validación (`class-validator`, `class-transformer`).
	- Autenticación/autorización (JWT) por tipo de usuario.
	- WebSockets para ubicación en tiempo real.
	- Tests (unitarios/e2e) para endpoints críticos.

## Arquitectura (objetivo)
- API REST con NestJS.
- Base de datos MariaDB (driver `mysql2`) gestionada con TypeORM.
- WebSockets (Socket.IO) para broadcast de ubicaciones y eventos de trabajo.
- Almacenamiento de imágenes (antes/después) vía S3 u otro proveedor (SDK ya incluido).

## Entidades (src/entities)
- `BusStop` (Paradero): `id`, `lat`, `lng`, `codigo`, `description`, `visitForms[]`.
- `VisitForm` (Ficha de visita): `id`, `picBeforeURL`, `picAfterURL`, `description`, `busStopId`, `routeId?`, relaciones a `BusStop` y `Route`.
- `Route` (Ruta): `id`, `route_points: number[]`, `route_points_visited: number[]`, `completed`, `work_order`, `visitForms[]`.
- `WorkOrder` (Orden de trabajo): `id`, `completada`, `fichas_ids: number[]`, `creation_date`, `complete_date`, `user_id?`, `route_id?`, relación `route`, `user_final`.
- `User`: `id`, `full_name`, `email`, `password`, `user_type: "jefatura" | "terreno" | "oferente"`, `entries`, `departures`, `work_orders?`.
- `Entry` (Entrada): `id`, `date`, `user_id`, `bus_stop_id`, relación `user`.
- `Departure` (Salida): `id`, `date`, `user_id`, `bus_stop_id`, relación `user`.

Relaciones clave: un `BusStop` tiene muchas `VisitForm`; una `Route` puede estar asociada 1:1 a un `WorkOrder`; `User` tiene muchas `Entry` y `Departure`.

## API – Implementado (hoy)
- `Paraderos` (`/paraderos`)
	- `POST /paraderos` – crea/actualiza un paradero. Body: parcial de `BusStop`.
	- `GET /paraderos` – lista todos los paraderos (incluye `visitForms`).
	- `GET /paraderos/find/:index` – busca por `id` o `codigo`.
	- `DELETE /paraderos/delete/:index` – elimina por `id` o `codigo`.

Nota: hoy `FindOneBusStop` elimina en lugar de devolver. En el desarrollo se corregirá para retornar el recurso sin eliminarlo y se migrará a rutas REST estándar (`GET /paraderos/:id` y `GET /paraderos?codigo=...`).

## API – Pendiente por implementar (propuesta)
- `Usuarios` (`/users`, `/auth`)
	- `POST /auth/login` – login y emisión de JWT.
	- `POST /users` – crear usuario (solo jefatura).
	- `GET /users` y `GET /users/:id` – listar/obtener.
	- `PATCH /users/:id` – actualizar datos y tipo.
	- `DELETE /users/:id` – desactivar/eliminar.

- `Fichas de visita` (`/fichas`)
	- `POST /fichas` – crear ficha con `busStopId`, `description`, URLs de fotos.
	- `GET /fichas/:id` – obtener ficha.
	- `GET /fichas` – filtrar por `busStopId` y/o `routeId`.
	- `PATCH /fichas/:id` – actualizar descripción/URLs.
	- `DELETE /fichas/:id` – eliminar.

- `Órdenes de trabajo` (`/ordenes`)
	- `POST /ordenes` – crear (opcionalmente asignando `user_id` y `route_id`).
	- `GET /ordenes` y `GET /ordenes/:id`.
	- `PATCH /ordenes/:id` – actualizar estado (`completada`, `complete_date`) y asignaciones.
	- `DELETE /ordenes/:id` – eliminar.

- `Rutas` (`/rutas`)
	- `POST /rutas` – crear ruta con `route_points`.
	- `GET /rutas` y `GET /rutas/:id`.
	- `PATCH /rutas/:id` – actualizar `route_points_visited` y marcar `completed`.
	- `DELETE /rutas/:id` – eliminar.

- `Entradas` (`/entradas`) y `Salidas` (`/salidas`)
	- `POST /entradas` – registrar entrada (`user_id`, `bus_stop_id`, `date`).
	- `GET /entradas` – listar, con filtros por usuario/rango de fechas.
	- `POST /salidas` – registrar salida (`user_id`, `bus_stop_id`, `date`).
	- `GET /salidas` – listar, con filtros.

- `Tracking tiempo real` (WebSocket, p.ej. `/ws`)
	- Evento `location:update` (cliente→servidor): `{ userId, lat, lng, ts }`.
	- Evento `location:broadcast` (servidor→clientes jefatura): distribución en tiempo real.
	- Endpoint REST opcional para última ubicación: `GET /tracking/users/:id/last`.

## Tareas por hacer (checklist)
- TypeORM
	- [ ] Registrar todas las entidades en `TypeOrmModule.forRoot` o usar `autoLoadEntities: true`.
	- [ ] Revisar tipos de columnas (`array` en `Route`) según base MariaDB.
- Módulos/Servicios/Controladores
	- [ ] `UsersModule`, `UsersService`, `UsersController`.
	- [ ] `VisitFormsModule`, `VisitFormsService`, `VisitFormsController`.
	- [ ] `WorkOrdersModule`, `WorkOrdersService`, `WorkOrdersController`.
	- [ ] `RoutesModule`, `RoutesService`, `RoutesController`.
	- [ ] `EntriesModule`, `EntryService` controlador y endpoints.
	- [ ] `DeparturesModule`, `DeparturesService`, `DeparturesController`.
	- [ ] Corregir `BusStopModule` para exportar `BusStopController` y registrar el módulo en `AppModule`.
- Cross-cutting
	- [ ] DTOs y validación de payloads.
	- [ ] Manejo de errores consistente (`ResponsePayload<T>` o excepciones Nest).
	- [ ] Autenticación JWT y guardias por `user_type`.
	- [ ] WebSocket Gateway para tracking.
	- [ ] Subida de imágenes (SDK S3 ya presente) y firma segura.
	- [ ] Seeds/migraciones iniciales.
	- [ ] Tests unitarios y e2e básicos.

## Endpoints – Contratos (borrador)
Ejemplos de payloads para guiar los DTOs:

- Crear paradero
	- `POST /paraderos`
	- Body:
		```json
		{ "lat": -33.45, "lng": -70.66, "codigo": "P-123", "description": "Paradero Av. Central" }
		```

- Crear ficha de visita
	- `POST /fichas`
	- Body:
		```json
		{
			"busStopId": 12,
			"description": "Se retiró basura y se lavó",
			"picBeforeURL": "https://.../before.jpg",
			"picAfterURL": "https://.../after.jpg",
			"routeId": 7
		}
		```

- Crear orden de trabajo
	- `POST /ordenes`
	- Body:
		```json
		{
			"fichas_ids": [101, 102, 103],
			"user_id": 55,
			"route_id": 7
		}
		```

- Crear ruta
	- `POST /rutas`
	- Body:
		```json
		{
			"route_points": [12, 34, 56],
			"route_points_visited": [],
			"completed": false
		}
		```

## Configuración y ejecución
Requisitos: Node 18+, MariaDB 10.5+.

Variables de entorno necesarias (ejemplo):
```
PORT=3000
DBHOST=localhost
DBPORT=3306
DBNAME=paraderos
DBUSER=root
DBPASS=changeme
```

Instalación y arranque (PowerShell):
```powershell
npm install
npm run start:dev
```

Notas técnicas:
- En `src/config/db.config.ts` configure las entidades (o use `autoLoadEntities: true`).
- Ajuste el driver MariaDB/MySQL según su entorno.

## Estructura del proyecto (resumen)
```
src/
	controllers/       # Controladores (hoy: BusStopController)
	services/          # Servicios (hoy: BusStopService, EntryService)
	entities/          # Entidades TypeORM
	modules/           # Módulos de características (corregir BusStopModule)
	config/            # Config DB y otros
	types/             # Tipos y errores comunes
```

## Roadmap Frontend y Móvil
- Frontend Web (sugerido): Next.js + TypeScript + TailwindCSS.
	- Vistas: dashboard jefatura, mapa de ubicaciones, gestión de paraderos, órdenes y rutas, revisión de fichas.
	- Consumo de API REST y canal de WebSockets.
- App Móvil (sugerido): React Native (Expo) + TypeScript.
	- Funciones: autenticación trabajador, lista de tareas/rutas, captura de fotos y envío de fichas, update de ubicación en tiempo real.
	- Optimizar uso de GPS y subida de imágenes.

## Próximos pasos sugeridos (backend)
- Registrar entidades en TypeORM y corregir `BusStopModule`.
- Añadir controladores y servicios faltantes tomando como guía las firmas propuestas.
- Incorporar DTOs y validación.
- Implementar auth JWT y guardias por tipo de usuario.
- Añadir WebSocket Gateway para tracking en tiempo real.

