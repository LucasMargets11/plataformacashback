# Documentación Técnica del Sistema — Plataforma Cashback

**Versión:** 1.0  
**Fecha:** 2026-04-27  
**Estado del sistema:** Funcional para uso interno (milestone cerrado)

---

## Índice

1. [Visión general de la arquitectura](#1-visión-general-de-la-arquitectura)
2. [Estructura del monorepo](#2-estructura-del-monorepo)
3. [Infraestructura y despliegue](#3-infraestructura-y-despliegue)
4. [Backend — Django API](#4-backend--django-api)
   - 4.1 [Stack tecnológico](#41-stack-tecnológico)
   - 4.2 [Apps y responsabilidades](#42-apps-y-responsabilidades)
   - 4.3 [Modelos de datos](#43-modelos-de-datos)
   - 4.4 [Endpoints REST](#44-endpoints-rest)
   - 4.5 [Autenticación y autorización](#45-autenticación-y-autorización)
   - 4.6 [Lógica de negocio central](#46-lógica-de-negocio-central)
   - 4.7 [Seeds y datos iniciales](#47-seeds-y-datos-iniciales)
   - 4.8 [Tests](#48-tests)
5. [Frontend — React Web](#5-frontend--react-web)
   - 5.1 [Stack tecnológico](#51-stack-tecnológico)
   - 5.2 [Estructura de carpetas](#52-estructura-de-carpetas)
   - 5.3 [Enrutamiento](#53-enrutamiento)
   - 5.4 [Layouts](#54-layouts)
   - 5.5 [Autenticación en el cliente](#55-autenticación-en-el-cliente)
   - 5.6 [Capa de API](#56-capa-de-api)
6. [Variables de entorno](#6-variables-de-entorno)
7. [Diagrama de flujo principal](#7-diagrama-de-flujo-principal)
8. [Estado actual y pendientes](#8-estado-actual-y-pendientes)
9. [Hallazgos de la auditoría](#9-hallazgos-de-la-auditoría)

---

## 1. Visión general de la arquitectura

La plataforma es un **monorepo** con tres capas diferenciadas:

```
┌─────────────────────────────────────────────────────┐
│                   Usuario Final                     │
└────────────────────────┬────────────────────────────┘
                         │ HTTP
┌────────────────────────▼────────────────────────────┐
│         Frontend  (React + Vite — puerto 5173)       │
│         apps/web                                     │
└────────────────────────┬────────────────────────────┘
                         │ REST / JSON  (JWT Bearer)
┌────────────────────────▼────────────────────────────┐
│          Backend API  (Django + DRF — puerto 8000)   │
│          apps/api                                    │
└────────────────────────┬────────────────────────────┘
                         │ TCP 5432
┌────────────────────────▼────────────────────────────┐
│          Base de datos  (PostgreSQL 16)              │
│          infra/docker-compose.yml → servicio db      │
└─────────────────────────────────────────────────────┘
```

**Comunicación:** El frontend consume la API mediante fetch nativo con JWT en header `Authorization: Bearer <token>`. No hay SSR ni GraphQL.

---

## 2. Estructura del monorepo

```
cashback/
├── apps/
│   ├── api/              ← Backend Django
│   └── web/              ← Frontend React/Vite
├── infra/
│   ├── docker-compose.yml
│   └── nginx/            ← (reservado para producción)
├── Makefile
├── package.json          ← Root workspaces (npm workspaces → apps/web)
├── README.md
└── MILESTONE.md
```

---

## 3. Infraestructura y despliegue

### Servicios Docker Compose (`infra/docker-compose.yml`)

| Servicio | Imagen / Build              | Puerto | Descripción                                                                                          |
| -------- | --------------------------- | ------ | ---------------------------------------------------------------------------------------------------- |
| `db`     | postgres:16                 | 5432   | Base de datos PostgreSQL. Healthcheck con `pg_isready`. Volumen persistente `db_data`.               |
| `api`    | Build `apps/api/Dockerfile` | 8000   | Django con runserver. Espera a `db` healthy. Ejecuta `migrate` y opcionalmente `runseeds` al inicio. |
| `web`    | Build `apps/web/Dockerfile` | 5173   | Vite dev server con `--host`.                                                                        |

### Secuencia de arranque

```
db (healthy) → api (migrate → runseeds → runserver) → web
```

### Comando de arranque

```bash
docker compose -f infra/docker-compose.yml up --build
```

### Variables de entorno del compose

| Variable               | Default                 | Descripción                         |
| ---------------------- | ----------------------- | ----------------------------------- |
| `DJANGO_SECRET_KEY`    | `insecure-secret`       | Clave secreta Django                |
| `DJANGO_DEBUG`         | `1`                     | Modo debug                          |
| `POSTGRES_*`           | `cashback/cashback`     | Credenciales de base de datos       |
| `ALLOWED_HOSTS`        | `localhost,127.0.0.1`   | Hosts permitidos Django             |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Orígenes CORS permitidos            |
| `LOAD_SEEDS`           | `true`                  | Ejecutar seeds en startup           |
| `VITE_API_URL`         | `http://localhost:8000` | URL base de la API para el frontend |

> **Nota de seguridad:** En producción se deben sobreescribir `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=0`, `POSTGRES_PASSWORD` y `LOAD_SEEDS=false` mediante variables de entorno o un `.env` real fuera del repo.

---

## 4. Backend — Django API

### 4.1 Stack tecnológico

| Dependencia                   | Versión mínima | Rol                              |
| ----------------------------- | -------------- | -------------------------------- |
| Django                        | ≥ 5.2          | Framework web                    |
| djangorestframework           | ≥ 3.15         | API REST                         |
| djangorestframework-simplejwt | ≥ 5.3          | Autenticación JWT                |
| django-cors-headers           | ≥ 4.6          | CORS                             |
| psycopg2-binary               | ≥ 2.9          | Driver PostgreSQL                |
| Pillow                        | ≥ 10.0         | Procesamiento de imágenes        |
| boto3                         | ≥ 1.34         | SDK AWS (futuro S3 para recibos) |
| pytest-django                 | ≥ 4.8          | Tests                            |

**Modelo de usuario personalizado:** `AUTH_USER_MODEL = "accounts.CustomUser"` (hereda `AbstractUser`).

**Base de datos:** PostgreSQL 16 en producción/Docker. SQLite soportado mediante `USE_SQLITE=1` para desarrollo local sin Docker.

### 4.2 Apps y responsabilidades

| App        | Prefijo URL                                  | Responsabilidad                                   |
| ---------- | -------------------------------------------- | ------------------------------------------------- |
| `accounts` | `/api/auth/`, `/api/profile/`, `/api/admin/` | Usuarios, autenticación JWT, perfiles, donaciones |
| `commerce` | `/api/commerce/`                             | Merchants, stores, categorías, causas por tienda  |
| `cashback` | `/api/cashback/`                             | Campañas, compras, transacciones de cashback      |
| `causes`   | `/api/causes/`                               | Causas (ONG / proyectos beneficiarios)            |

### 4.3 Modelos de datos

#### `accounts.CustomUser`

```
CustomUser (AbstractUser)
├── email          EmailField  UNIQUE
└── role           CharField   [CONSUMER | MERCHANT | ADMIN]
```

#### `commerce`

```
Merchant
├── owner          FK → CustomUser (role=MERCHANT)
├── name           CharField
├── cuit           CharField
└── status         CharField (default=ACTIVE)

Category
├── name           CharField UNIQUE
├── slug           SlugField UNIQUE
└── participates_in_cashback  BooleanField

Store
├── merchant       FK → Merchant
├── display_name   CharField
├── address        CharField
├── qrcode_slug    SlugField UNIQUE
├── description    TextField
├── logo_url       URLField
├── website_url    URLField
├── instagram_url  URLField
├── active         BooleanField
└── categories     M2M → Category

StoreSupportedCause
├── store          FK → Store
├── cause          FK → causes.Cause
└── added_at       DateTimeField
    [UNIQUE: (store, cause)]
```

#### `cashback`

```
Campaign
├── name           CharField
├── cause          FK → causes.Cause (PROTECT)
├── stores         M2M → Store (through=CampaignStore)
├── percentage     DecimalField [0-100]
├── starts_at      DateTimeField
├── ends_at        DateTimeField
└── active         BooleanField

CampaignStore  (tabla intermedia)
├── campaign       FK → Campaign
├── store          FK → Store
└── cashback_percentage  DecimalField NULLABLE
    [override por tienda; null = usar % global de campaña]
    [UNIQUE: (campaign, store)]

Purchase
├── user           FK → CustomUser
├── store          FK → Store
├── amount         DecimalField
├── source         [QR | LINK | RECEIPT]
├── status         [PENDING | APPROVED | REJECTED]
├── selected_cause FK → causes.Cause (nullable)
└── created_at     DateTimeField

CashbackTransaction
├── user           FK → CustomUser
├── purchase       FK → Purchase
├── campaign       FK → Campaign (nullable SET_NULL)
├── cause          FK → causes.Cause (nullable SET_NULL)
├── percentage     DecimalField
├── amount         DecimalField
└── status         [PENDING | SETTLED | PAID]

ReceiptUpload  (modelo existente, sin endpoint aún)
├── purchase       FK → Purchase
├── image_path     CharField
└── ocr_status     [PENDING | OK | FAILED]
```

#### `causes`

```
Cause
├── title          CharField
├── slug           SlugField UNIQUE (auto-generado)
├── category       [Deporte | Educación | Salud | Ambiente]
├── summary        TextField
├── image_url      URLField
├── is_active      BooleanField
├── is_featured    BooleanField
├── created_at     DateTimeField
└── updated_at     DateTimeField
```

### 4.4 Endpoints REST

#### Autenticación (`/api/auth/`)

| Método | Endpoint             | Auth    | Descripción                                   |
| ------ | -------------------- | ------- | --------------------------------------------- |
| POST   | `/api/auth/register` | Público | Registrar usuario (CONSUMER por defecto)      |
| POST   | `/api/auth/login`    | Público | Login por email+password → access+refresh JWT |
| POST   | `/api/auth/refresh`  | Público | Renovar access token                          |

#### Perfil (`/api/`)

| Método | Endpoint                  | Auth        | Descripción                                       |
| ------ | ------------------------- | ----------- | ------------------------------------------------- |
| GET    | `/api/profile/`           | Autenticado | Perfil + métricas (total donado, causas, compras) |
| PATCH  | `/api/profile/`           | Autenticado | Editar perfil (first_name, last_name, username)   |
| GET    | `/api/profile/donations/` | Autenticado | Historial de donaciones/cashback del usuario      |

#### Administración (`/api/admin/`)

| Método | Endpoint            | Auth  | Descripción                               |
| ------ | ------------------- | ----- | ----------------------------------------- |
| GET    | `/api/admin/users/` | ADMIN | Listar usuarios (filtro `?role=`)         |
| POST   | `/api/admin/users/` | ADMIN | Crear usuario + merchant entity (atómico) |

#### Commerce (`/api/commerce/`)

| Método               | Endpoint                                       | Auth                 | Descripción                                                             |
| -------------------- | ---------------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| GET                  | `/api/commerce/merchants/`                     | Autenticado          | Listar merchants (ADMIN: todos; MERCHANT: el suyo)                      |
| POST                 | `/api/commerce/merchants/`                     | MERCHANT/ADMIN       | Crear merchant                                                          |
| GET/PUT/PATCH/DELETE | `/api/commerce/merchants/{id}/`                | MERCHANT/ADMIN       | CRUD merchant                                                           |
| GET                  | `/api/commerce/stores/`                        | Autenticado          | Listar tiendas (activas; filtros: `search`, `category`, `participates`) |
| POST                 | `/api/commerce/stores/`                        | MERCHANT/ADMIN       | Crear tienda                                                            |
| GET/PUT/PATCH/DELETE | `/api/commerce/stores/{id}/`                   | MERCHANT/ADMIN       | CRUD tienda                                                             |
| GET                  | `/api/commerce/categories/`                    | Autenticado          | Listar categorías                                                       |
| GET                  | `/api/commerce/stores/{id}/causes/`            | Autenticado          | Causas soportadas por tienda                                            |
| POST                 | `/api/commerce/stores/{id}/causes/`            | MERCHANT owner/ADMIN | Agregar causa a tienda                                                  |
| DELETE               | `/api/commerce/stores/{id}/causes/{cause_id}/` | MERCHANT owner/ADMIN | Quitar causa de tienda                                                  |

#### Cashback (`/api/cashback/`)

| Método               | Endpoint                                | Auth           | Descripción                      |
| -------------------- | --------------------------------------- | -------------- | -------------------------------- |
| GET                  | `/api/cashback/campaigns/`              | Autenticado    | Listar campañas                  |
| POST                 | `/api/cashback/campaigns/`              | ADMIN          | Crear campaña                    |
| GET/PUT/PATCH/DELETE | `/api/cashback/campaigns/{id}/`         | ADMIN          | CRUD campaña                     |
| GET                  | `/api/cashback/purchases/`              | Autenticado    | Listar compras (scope por rol)   |
| POST                 | `/api/cashback/purchases/`              | CONSUMER       | Registrar compra                 |
| POST                 | `/api/cashback/purchases/{id}/approve/` | MERCHANT/ADMIN | Aprobar compra → genera cashback |
| GET                  | `/api/cashback/transactions/`           | Autenticado    | Listar transacciones de cashback |

#### Causes (`/api/causes/`)

| Método    | Endpoint              | Auth    | Descripción                                                                   |
| --------- | --------------------- | ------- | ----------------------------------------------------------------------------- |
| GET       | `/api/causes/`        | Público | Listar causas activas (filtros: `is_featured`, `category`, `search`, `limit`) |
| GET       | `/api/causes/{slug}/` | Público | Detalle de causa                                                              |
| POST      | `/api/causes/`        | ADMIN   | Crear causa                                                                   |
| PUT/PATCH | `/api/causes/{slug}/` | ADMIN   | Editar causa                                                                  |
| DELETE    | `/api/causes/{slug}/` | ADMIN   | Eliminar causa (PROTECTED si tiene campañas)                                  |

### 4.5 Autenticación y autorización

**Mecanismo:** JWT via `djangorestframework-simplejwt`.  
El token incluye claims personalizados: `role` y `username`.

**Login:** Acepta `username` o `email` en el campo de login (CustomTokenObtainPairSerializer mapea email → username internamente).

**Clases de permiso custom:**

| Clase        | Condición                                |
| ------------ | ---------------------------------------- |
| `IsConsumer` | `user.role == "CONSUMER"`                |
| `IsMerchant` | `user.role == "MERCHANT"`                |
| `IsAdmin`    | `user.role == "ADMIN"` o `user.is_staff` |
| `ReadOnly`   | Métodos seguros (GET, HEAD, OPTIONS)     |

**Política de scoping por rol:**

- **CONSUMER:** ve solo sus propias compras y transacciones.
- **MERCHANT:** ve compras de sus tiendas; no puede acceder a recursos ajenos.
- **ADMIN:** acceso total sin filtros de ownership.

### 4.6 Lógica de negocio central

#### Flujo de aprobación de compra y generación de cashback

```
Consumer crea Purchase (status=PENDING, selected_cause=X)
         ↓
Merchant/Admin llama POST /purchases/{id}/approve/
         ↓
Sistema busca CampaignStore activa para la tienda
   [active=True, starts_at ≤ now ≤ ends_at]
   [orden: mayor percentage primero]
         ↓
¿Hay campaña activa?
   NO  → Purchase.status=APPROVED, sin cashback
   SÍ  → Calcula cashback = amount × effective_pct / 100
         effective_pct = cashback_percentage override ó percentage global
         Crea CashbackTransaction (cause = cause de la campaña)
         Purchase.status=APPROVED
```

**Deduplicación:** Se verifica `cashbacktransaction_set.exists()` antes de crear la transacción para evitar doble cashback.

**Validación de solapamiento de campañas:** El serializer de Campaign valida en `validate()` que no exista otra campaña activa con fechas superpuestas para las mismas tiendas.

#### Cálculo de métricas de perfil

- `total_donated`: suma de `CashbackTransaction.amount` del usuario.
- `causes_count`: número de causas distintas en las transacciones del usuario.
- `purchases_count`: total de compras del usuario.

### 4.7 Seeds y datos iniciales

Ejecutados con `python manage.py runseeds`.  
Orden de ejecución: `accounts → causes → commerce → cashback`.

| Seed     | Datos creados                                                 |
| -------- | ------------------------------------------------------------- |
| accounts | admin@example.com, merchant@example.com, consumer@example.com |
| causes   | 4 causas (Deporte, Educación, Salud, Ambiente)                |
| commerce | 1 merchant, 1 store, categorías base                          |
| cashback | 1 campaña activa (5% cashback)                                |

### 4.8 Tests

Cobertura de tests existente:

| Módulo     | Tests cubiertos                                                                                 |
| ---------- | ----------------------------------------------------------------------------------------------- |
| `accounts` | GET/PATCH `/api/profile/`, GET `/api/profile/donations/`, autenticación                         |
| `cashback` | Aprobación de compras, deduplicación de cashback, validación de status, ownership, campañas     |
| `commerce` | `StoreSupportedCause` CRUD, restricciones de ownership, causas inactivas, validación de compras |

**Ejecución:** `pytest` desde `apps/api/`.

---

## 5. Frontend — React Web

### 5.1 Stack tecnológico

| Dependencia      | Versión | Rol                     |
| ---------------- | ------- | ----------------------- |
| React            | 18.3    | UI                      |
| React Router DOM | 6.28    | Enrutamiento SPA        |
| TypeScript       | 5.6     | Tipado estático         |
| Vite             | 5.4     | Build tool / dev server |
| TailwindCSS      | 3.4     | Estilos utilitarios     |
| Lucide React     | 0.548   | Iconografía             |

**Sin gestor de estado global** (no Redux, no Zustand). El estado se maneja localmente con `useState`/`useEffect` por página.

### 5.2 Estructura de carpetas

```
src/
├── App.tsx              ← Router raíz
├── main.tsx             ← Entry point
├── components/          ← Componentes reutilizables de UI
│   ├── layout/          ← Header, Footer, Nav
│   ├── ui/              ← Primitivos (Button, Card, etc.)
│   └── causes/          ← Componentes específicos de causas
├── features/causes/     ← Feature slice de causas
├── layouts/
│   ├── AppLayout.tsx    ← Layout autenticado (verifica JWT)
│   ├── AuthLayout.tsx   ← Layout para login/signup
│   └── PublicLayout.tsx ← Layout público con header/footer
├── lib/
│   ├── api.ts           ← Capa de comunicación con la API
│   ├── auth.ts          ← Gestión de tokens (localStorage)
│   ├── env.ts           ← Variables de entorno
│   └── role.ts          ← Helpers de roles
├── pages/
│   ├── index.tsx        ← Landing page
│   ├── login.tsx
│   ├── signup.tsx
│   ├── for-business.tsx
│   ├── for-consumers.tsx
│   ├── for-teams.tsx
│   ├── how-it-works.tsx
│   ├── home/            ← Dashboard autenticado
│   ├── stores/          ← Listado y detalle de tiendas
│   ├── profile/         ← Perfil de usuario
│   ├── purchases/       ← Historial de compras (consumer)
│   ├── merchant/        ← Gestión de compras (merchant)
│   ├── causes/          ← Causas (pública + autenticada)
│   └── admin/           ← Panel admin (merchants, stores, campañas, causas)
└── styles/
    ├── globals.css
    └── tokens.css       ← Design tokens CSS
```

### 5.3 Enrutamiento

Toda la aplicación es una SPA. Rutas definidas en `App.tsx`:

#### Rutas públicas (bajo `PublicLayout`)

| Ruta             | Página                                  |
| ---------------- | --------------------------------------- |
| `/`              | Landing page                            |
| `/login`         | Login                                   |
| `/signup`        | Registro                                |
| `/how-it-works`  | Cómo funciona                           |
| `/for-consumers` | Para consumidores                       |
| `/for-teams`     | Para equipos                            |
| `/for-business`  | Para comercios (alias `/for-merchants`) |
| `/causas`        | Listado público de causas               |
| `/causas/:slug`  | Detalle de causa                        |

#### Rutas autenticadas (bajo `/app` + `AppLayout`)

| Ruta                      | Página                     | Rol esperado |
| ------------------------- | -------------------------- | ------------ |
| `/app/home`               | Dashboard con causas       | Todos        |
| `/app/profile`            | Perfil + métricas          | Todos        |
| `/app/stores`             | Listado de tiendas         | Todos        |
| `/app/stores/:id`         | Detalle + registrar compra | Todos        |
| `/app/purchases`          | Mis compras                | CONSUMER     |
| `/app/merchant/purchases` | Aprobar compras pendientes | MERCHANT     |
| `/app/causes`             | Mis causas / impacto       | Todos        |
| `/app/settings`           | Placeholder                | Todos        |

#### Rutas admin (bajo `/app/admin` + `AdminLayout`)

| Ruta                            | Página                     |
| ------------------------------- | -------------------------- |
| `/app/admin/merchants`          | Listado de merchants       |
| `/app/admin/merchants/new`      | Crear merchant + usuario   |
| `/app/admin/stores`             | Listado de tiendas         |
| `/app/admin/stores/new`         | Crear tienda               |
| `/app/admin/stores/:id/causes`  | Gestionar causas de tienda |
| `/app/admin/campaigns`          | Listado de campañas        |
| `/app/admin/campaigns/new`      | Crear campaña              |
| `/app/admin/campaigns/:id/edit` | Editar campaña             |
| `/app/admin/causes`             | Listado de causas          |
| `/app/admin/causes/new`         | Crear causa                |
| `/app/admin/causes/:slug/edit`  | Editar causa               |

### 5.4 Layouts

- **`PublicLayout`**: header con navegación pública, footer. No requiere auth.
- **`AppLayout`**: verifica token JWT en localStorage. Si no existe, redirige a `/login`. Incluye nav lateral o top-nav de app.
- **`AdminLayout`**: layout anidado dentro de `AppLayout`. Verifica rol `ADMIN`.

### 5.5 Autenticación en el cliente

Gestión de tokens en `lib/auth.ts`:

- Tokens guardados en `localStorage` bajo la key `auth.tokens` como JSON `{access, refresh}`.
- `setTokens()` / `getTokens()` / `clearTokens()` — operaciones básicas.
- `isAuthenticated()` — comprueba si existe un access token.
- `setUserEmail()` / `getUserEmail()` — persiste el email del usuario para UX (key `auth.email`).

> **Consideración de seguridad:** Los tokens en `localStorage` son vulnerables a XSS. Para producción se debería evaluar `httpOnly cookies` para el refresh token.

### 5.6 Capa de API

`lib/api.ts` expone funciones genéricas:

```typescript
get<T>(path); // GET con JWT automático
post<T>(path, body); // POST con JSON body
patch<T>(path, body); // PATCH con JSON body
del<T>(path); // DELETE
```

- Base URL tomada de `env.VITE_API_URL`.
- Adjunta automáticamente `Authorization: Bearer <token>` si hay token.
- Extrae mensajes de error de respuestas DRF (`detail`, `field errors`, `non_field_errors`).

**Tipos exportados principales:** `ApiStore`, `ApiCategory`, `ApiStoreSupportedCause`, y otros para merchants, campañas, compras, causas.

---

## 6. Variables de entorno

### `apps/api/.env`

```env
DJANGO_SECRET_KEY=<secreto-real>
DJANGO_DEBUG=0
POSTGRES_DB=cashback
POSTGRES_USER=cashback
POSTGRES_PASSWORD=<password>
POSTGRES_HOST=db
POSTGRES_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
LOAD_SEEDS=false
USE_SQLITE=0
```

### `apps/web/.env`

```env
VITE_API_URL=http://localhost:8000
```

---

## 7. Diagrama de flujo principal

### Flujo completo de una compra con cashback

```
[CONSUMER]                    [API]                    [MERCHANT]
    │                           │                           │
    ├─ GET /api/commerce/stores/──►                        │
    │◄── lista tiendas con causas─┤                        │
    │                           │                           │
    ├─ POST /api/cashback/purchases/                        │
    │  { store, amount, source,  │                          │
    │    selected_cause }        │                          │
    │◄── 201 { id, status=PENDING}                         │
    │                           │                           │
    │                           │◄─ GET /cashback/purchases/─┤
    │                           │    (status=PENDING)        │
    │                           ├──► lista compras pendientes─►
    │                           │                           │
    │                           │◄─ POST /purchases/{id}/approve/
    │                           │                           │
    │                           │  [busca CampaignStore activa]
    │                           │  [calcula cashback]       │
    │                           │  [crea CashbackTransaction]
    │                           ├──► 200 { cashback_total } ─►
    │                           │                           │
    ├─ GET /api/profile/donations/─►                       │
    │◄── historial con cashback──┤                         │
```

---

## 8. Estado actual y pendientes

### Implementado y verificado

- [x] Registro y login con JWT (email o username)
- [x] Roles: CONSUMER, MERCHANT, ADMIN con permisos granulares
- [x] CRUD de Merchants, Stores, Categories
- [x] Causas soportadas por tienda (StoreSupportedCause)
- [x] CRUD de Causas con categorías
- [x] Campañas de cashback con override por tienda y validación de solapamiento
- [x] Flujo de compra: crear → aprobar → generar cashback automático
- [x] Deduplicación de cashback
- [x] Perfil con métricas (total donado, causas, compras)
- [x] Frontend completo para todos los flujos anteriores
- [x] Panel admin completo en frontend
- [x] Docker Compose funcional con seeds automáticos

### Pendientes / Deuda técnica

| Área                      | Descripción                                                     | Prioridad |
| ------------------------- | --------------------------------------------------------------- | --------- |
| Settings UI               | Pantalla `/app/settings` es placeholder                         | Media     |
| Paginación                | Sin paginación en listados de la API                            | Media     |
| CRUD completo             | Solo Create + Read, sin Update/Delete en la mayoría de recursos | Media     |
| ReceiptUpload             | Modelo existe, sin endpoint ni UI                               | Baja      |
| Refresh token automático  | El frontend no renueva el access token automáticamente          | Alta      |
| Protección de rutas admin | `AdminLayout` debería verificar rol, no solo autenticación      | Alta      |
| Nginx proxy               | Carpeta `infra/nginx/` reservada pero sin configurar            | Media     |

---

## 9. Hallazgos de la auditoría

### Seguridad

| Severidad | Hallazgo                                                              | Recomendación                                 |
| --------- | --------------------------------------------------------------------- | --------------------------------------------- |
| Alta      | `DJANGO_SECRET_KEY` tiene default `insecure-secret` en docker-compose | Obligar variable sin default en producción    |
| Alta      | `DJANGO_DEBUG=1` por default en docker-compose                        | Cambiar a `0` en producción                   |
| Media     | Tokens JWT almacenados en `localStorage` (vulnerable a XSS)           | Evaluar httpOnly cookies para refresh token   |
| Media     | Refresh token no se renueva automáticamente en el frontend            | Implementar interceptor de 401 con renovación |
| Baja      | `POSTGRES_PASSWORD` con default en docker-compose                     | Sin default en producción                     |

### Arquitectura y calidad de código

| Categoría      | Hallazgo                                                                 | Recomendación                                                   |
| -------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------- |
| Rendimiento    | Sin paginación en ningún listado de la API                               | Implementar `PageNumberPagination` en DRF                       |
| Consistencia   | `CauseViewSet` usa `lookup_field = "slug"` pero otros ViewSets usan `pk` | Documentar estándar de lookup                                   |
| Escalabilidad  | Sin Redis / caché configurado                                            | Añadir Redis para sesiones y caché en producción                |
| Observabilidad | Sin logging estructurado configurado en Django                           | Configurar `LOGGING` en settings                                |
| Seguridad API  | `ReceiptUpload.image_path` es un `CharField` en lugar de `FileField`     | Usar almacenamiento seguro (S3 + presigned URLs) al implementar |
| Testing        | Sin tests de integración end-to-end (Playwright/Cypress)                 | Añadir tests E2E para flujos críticos                           |
| CI/CD          | Sin pipelines de CI configurados                                         | Configurar GitHub Actions para lint + test en cada PR           |
| Frontend state | Sin manejo de expiración de token en el cliente                          | Decodificar `exp` del JWT y refrescar antes de expirar          |

### Bugs conocidos (ya corregidos en milestone actual)

| #   | Descripción                                                                   | Fix                                                 |
| --- | ----------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | Seeds se ejecutaban en orden incorrecto (commerce antes que causes)           | Reordenado: accounts → causes → commerce → cashback |
| 2   | `@rollup/rollup-win32-x64-msvc` en `dependencies` rompía build Docker (Linux) | Movido a `optionalDependencies`                     |
| 3   | Warning de `version: '3.9'` en docker-compose.yml                             | Removido (obsoleto en compose v2)                   |
