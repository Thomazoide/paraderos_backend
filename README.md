# Paraderos – Backend

Backend NestJS + TypeORM (MariaDB) para monitoreo y gestión de limpieza de paraderos.

## Estado (Actualizado 20/11/2025)

### Implementado
- Controladores v1: BusStop, Route, WorkOrder, Entry, Departure, User, Auth
- Servicios: BusStopService, RouteService, WorkOrderService, EntryService, DepartureService, UserService (username único), AuthService (JWT)
- Módulos: bus-stop, route, work-order, entry, departure, user, auth
- Utilidades: Encrypter (hash sha256 + pepper + SECRET, CreateJWT, VerifyPassword, ValidateJWT)
- Entidades: BusStop, VisitForm, Route, WorkOrder, User, Entry, Departure
- Configuración TypeORM + carga .env

### Pendiente
- Guards JWT + autorización por roles (user_type)
- WebSockets (tracking en tiempo real)
- Subida de imágenes (S3) para VisitForm
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
	Paraderos: /paraderos/v1 (CRUD básico + find por id/código)
	Rutas: /rutas/v1 (listar, crear, find/:id, orden/:workOrderId)
	Órdenes: /ordenes/v1 (CRUD básico)
	Entradas: /entradas/v1 (CRUD básico)
	Salidas: /salidas/v1 (CRUD básico)
	Usuarios: /users/v1 (crear, listar, actualizar sin cambio de password, borrar)
	Auth: /auth/v1 (login → JWT)  (detalles según implementación interna)
	Nota: Endpoints exactos según métodos en controladores; agregar Swagger para definición formal.

## Username
Generación: primera letra del nombre + apellido normalizado. Unicidad: sufijo incremental (ej: mjara, mjara1, mjara2).

## Variables de entorno (.env)
- PORT
- DB_HOST
- DB_PORT
- DB_NAME
- DB_USER
- DB_PASS
- SECRET
- PEPPER

## Scripts
`Instalación: npm install`

`Dev: npm run start:dev`

Requisitos: Node 18+, MariaDB 10.5+

## Estructura
	src/
	├── main.ts
	├── app.module.ts
	├── controllers/ (auth, user, bus-stop, route, work-order, entry, departure)
	├── services/ (auth.service.ts, user.service.ts, ...)
	├── modules/ (auth.module.ts, user.module.ts, ...)
	├── entities/
	├── utils/ (encrypter.ts)
	├── config/ (db.config.ts)
	├── types/ (errors.ts, types.ts)

Última actualización: 20 Nov 2025

Status: Base funcional v1 + Auth + Users + generación username ✔