# Paraderos – Backend

Backend NestJS + TypeORM (MariaDB) para monitoreo y gestión de limpieza de paraderos.

## Estado (Actualizado 26/11/2025)

### Implementado
- Controladores v1: `AuthController`, `UserController`, `BusStopController`, `RouteController`, `WorkOrderController`, `EntryController`, `DepartureController`, `VisitFormController`
- Servicios: `AuthService` (login + verificación JWT), `UserService` (username único + CRUD parcial), `BusStopService`, `RouteService`, `WorkOrderService`, `EntryService`, `DepartureService`, `VisitFormService`
- Módulos: `auth.module.ts`, `user.module.ts`, `bus-stop.module.ts`, `route.module.ts`, `work-order.module.ts`, `entry.module.ts`, `departure.module.ts`, `visit-form.module.ts`
- Utilidades: `Encrypter` (hash sha256 con pepper + `SECRET`, `CreateJWT`, `VerifyPassword`, `VerifyJWT`)
- Entidades: `BusStop`, `VisitForm`, `Route`, `WorkOrder`, `User`, `Entry`, `Departure`
- Sockets: `gps.socket.ts` (estructura inicial para tracking)
- Configuración TypeORM + carga de variables de entorno

### Pendiente
- DTOs + `class-validator` / `class-transformer`
- Guards JWT + autorización por roles (`user_type`)
- WebSockets (activar `gps.socket` y canalizar eventos)
- Subida de imágenes (S3) para `VisitForm`
- Migraciones y seeds
- Tests (unit / e2e)
- Swagger/OpenAPI
- Manejo avanzado de errores y logging estructurado

## Entidades (Resumen)
	BusStop (1→N VisitForm)
	VisitForm (N→1 BusStop, N→1 Route)
	Route (1→1 WorkOrder, 1→N VisitForm)
	WorkOrder (N→1 User, 1→1 Route)
	User (1→N Entry, 1→N Departure, 1→N WorkOrder)
	Entry / Departure (N→1 User)

## API v1 (Controladores presentes)
	Auth: /auth/v1
		- POST /login → devuelve JWT si credenciales válidas
		- POST /verificar-token → valida JWT (boolean)
	Usuarios: /usuarios/v1
		- GET / → listar usuarios (id, full_name, email, username, user_type)
		- POST /registrar → crear usuario (genera `username` único y encripta `password`)
		- POST /actualizar → actualizar datos (sin cambio de password)
		- POST /actualizar/clave → cambio de password con verificación de clave anterior
	Paraderos: /paraderos/v1
		- POST / → crear/actualizar paradero
		- GET / → listar paraderos (incluye `visitForms`)
		- GET /find/:index → buscar por `id` o `codigo`
		- DELETE /delete/:index → eliminar por `id` o `codigo`
	Rutas: /rutas/v1 (listar/crear/find/:id, orden/:workOrderId)
	Órdenes: /ordenes/v1 (CRUD básico)
	Entradas: /entradas/v1 (listar, crear, por usuario, por paradero)
	Salidas: /salidas/v1 (CRUD básico)
	Fichas de visita: /visitas/v1 (CRUD básico)
	Nota: Endpoints exactos según métodos en controladores; se recomienda agregar Swagger para definición formal.

## Username
- Generación: primera letra del nombre + apellido normalizado (sin tildes ni espacios), minúsculas.
- Unicidad: consulta `LIKE base%` y agrega sufijo incremental libre (ej: `mjara`, `mjara1`, `mjara2`).
- Recomendación: índice `UNIQUE` en columna `username` para consistencia.

## Variables de entorno (.env)
- PORT
- DBHOST
- DBPORT
- DBNAME
- DBUSER
- DBPASS
- SECRET
- PEPPER

Nota: La configuración actual de TypeORM usa las claves sin guion bajo (`DBHOST`, `DBPORT`, …) según `src/config/db.config.ts`.

## Scripts
- Instalación: `npm install`
- Desarrollo: `npm run start:dev`

Requisitos: Node 18+, MariaDB 10.5+

## Estructura
	src/
	├── main.ts
	├── app.module.ts
	├── controllers/ (auth, usuarios, paraderos, rutas, ordenes, entradas, salidas, visitas)
	├── services/ (auth.service.ts, user.service.ts, ...)
	├── modules/ (auth.module.ts, user.module.ts, ...)
	├── entities/
	├── sockets/ (gps.socket.ts)
	├── utils/ (encrypter.ts)
	├── config/ (db.config.ts)
	├── types/ (errors.ts, types.ts)

Última actualización: 26 Nov 2025

Status: Base funcional v1 (Auth, Usuarios, Paraderos, Rutas, Órdenes, Entradas/Salidas, Visitas) + generación username ✔