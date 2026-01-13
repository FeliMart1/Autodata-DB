# Autodata Backend API

Backend API REST para gestión del ciclo de vida de modelos de autos - Autodata Uruguay.

## 📋 Características

- **CRUD completo** de Marcas y Modelos
- **Workflow de estados**: IMPORTADO → MINIMOS → PARA_CORREGIR → APROBADO → PUBLICADO
- **Gestión de equipamientos** (~40 atributos por modelo)
- **Precios con vigencia** (modelo y versión)
- **Relaciones completas**: Marca → Modelo → Versión → Equipamiento → Precios
- **Validación** de campos mínimos requeridos
- **Auditoría** y trazabilidad

## 🛠️ Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **ORM/Query Builder**: Knex.js + Objection.js
- **Base de datos**: SQL Server (MSSQL)
- **Validación**: Joi
- **Logger**: Winston
- **Jobs programados**: node-cron

## 📦 Instalación

### 1. Clonar y instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y configura:

```env
# Servidor SQL Server
DB_HOST=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=TuPassword
DB_DATABASE=Autodata
DB_INSTANCE=SQLEXPRESS

# Puerto del servidor
PORT=3000

# JWT Secret
JWT_SECRET=cambiar_por_secreto_seguro

# Entorno
NODE_ENV=development
```

### 3. Validar base de datos

Antes de iniciar el servidor, ejecuta estos scripts SQL en SSMS:

```bash
# 1. Validar estructura
sql/00_validar_estructura.sql

# 2. Crear vista principal
sql/01_crear_vista_modelo_detalle.sql

# 3. Insertar estados del workflow
sql/02_seed_estados.sql
```

### 4. Iniciar servidor

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 🚀 Endpoints API

### Health Check

```
GET /api/health
```

### Marcas

```
GET    /api/marcas           # Listar todas
GET    /api/marcas/:id       # Obtener por ID
POST   /api/marcas           # Crear
PUT    /api/marcas/:id       # Actualizar
DELETE /api/marcas/:id       # Eliminar
```

### Modelos

```
GET    /api/modelos                    # Listar con filtros y paginación
GET    /api/modelos/:id                # Obtener por ID (con relaciones)
POST   /api/modelos                    # Crear nuevo modelo
PUT    /api/modelos/:id                # Actualizar modelo
DELETE /api/modelos/:id                # Eliminar modelo
```

**Filtros disponibles en GET /api/modelos:**
- `?page=1&limit=50` - Paginación
- `?estado=MINIMOS` - Filtrar por estado
- `?marcaId=5` - Filtrar por marca
- `?search=civic` - Búsqueda en descripción/código

### Workflow de Modelos

```
POST /api/modelos/:id/mark-minimos    # Marcar como MINIMOS (valida campos)
POST /api/modelos/:id/send-review     # Enviar a revisión (PARA_CORREGIR)
POST /api/modelos/:id/approve         # Aprobar y publicar
```

## 📊 Modelos de Datos

### Marca
- MarcaID (PK)
- CodigoMarca, Descripcion, ShortName
- Origen, CodigoOrigen

### Modelo
- ModeloID (PK), MarcaID (FK)
- Datos básicos: Código, Descripción, ShortName
- Especificaciones: CC, HP, Traccion, Caja, Turbo, Puertas, Pasajeros
- Segmentación: Autodata, GM, Audi, SBI, Citroen
- Estado: EstadoID (FK → ModeloEstado)

### VersionModelo
- VersionID (PK), ModeloID (FK)
- CodigoVersion, Descripcion, Equipamiento

### EquipamientoModelo
- 40+ campos booleanos (ABS, Airbags, Climatizador, etc.)

### PrecioModelo / PrecioVersion
- Precio, Moneda
- FechaVigenciaDesde, FechaVigenciaHasta
- Fuente

## 🔄 Workflow de Estados

```
IMPORTADO → MINIMOS → PARA_CORREGIR → APROBADO → PUBLICADO
```

**Validaciones:**
- Para pasar a MINIMOS, debe tener: Familia, OrigenCodigo, CombustibleCodigo, Anio, Tipo, CC, HP

## 📁 Estructura del Proyecto

```
autodata-backend/
├── src/
│   ├── index.js              # Entry point
│   ├── app.js                # Express app setup
│   ├── config/
│   │   ├── db.js             # Knex config
│   │   └── logger.js         # Winston logger
│   ├── models/               # Objection models
│   │   ├── Marca.js
│   │   ├── Modelo.js
│   │   ├── ModeloEstado.js
│   │   ├── VersionModelo.js
│   │   ├── EquipamientoModelo.js
│   │   ├── PrecioModelo.js
│   │   └── PrecioVersion.js
│   ├── controllers/          # Request handlers
│   │   ├── marcasController.js
│   │   └── modelosController.js
│   └── routes/               # Route definitions
│       ├── index.js
│       ├── marcasRoutes.js
│       └── modelosRoutes.js
├── sql/                      # Scripts SQL
│   ├── 00_validar_estructura.sql
│   ├── 01_crear_vista_modelo_detalle.sql
│   └── 02_seed_estados.sql
├── logs/                     # Logs (auto-generado)
├── knexfile.js
├── package.json
└── .env
```

## 🧪 Testing

### Con curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Listar marcas
curl http://localhost:3000/api/marcas

# Crear marca
curl -X POST http://localhost:3000/api/marcas \
  -H "Content-Type: application/json" \
  -d '{"CodigoMarca":"TOY","Descripcion":"Toyota","ShortName":"Toyota"}'

# Listar modelos con filtro
curl "http://localhost:3000/api/modelos?page=1&limit=10&estado=MINIMOS"
```

### Con Postman/Insomnia:

Importa esta colección base:
- Base URL: `http://localhost:3000/api`
- Endpoints: Ver sección "Endpoints API"

## 🔐 Autenticación (Próximamente)

En desarrollo:
- JWT authentication
- Roles: admin, editor, revisor, lector
- Tabla ops.Usuarios

## 📝 Próximos Pasos

- [ ] Implementar autenticación JWT
- [ ] Endpoint de importación CSV
- [ ] Job automático para importar archivo de Claudio (2×/semana)
- [ ] Endpoint de equipamiento con vigencia
- [ ] Historial de cambios (auditoría completa)
- [ ] Documentación Swagger/OpenAPI
- [ ] Tests unitarios (Jest)

## 🐛 Troubleshooting

### Error de conexión a SQL Server

```
Error: Failed to connect to localhost:1433
```

**Soluciones:**
1. Verifica que SQL Server esté corriendo: `services.msc` → SQL Server (SQLEXPRESS)
2. Comprueba que TCP/IP esté habilitado en SQL Server Configuration Manager
3. Verifica el Server name en `.env` (puede ser `localhost`, `.\SQLEXPRESS`, o `(local)\SQLEXPRESS`)
4. Si usas Windows Authentication, ajusta la conexión en `knexfile.js`:

```javascript
connection: {
  server: 'localhost\\SQLEXPRESS',
  database: 'Autodata',
  options: {
    trustedConnection: true,
    encrypt: false,
    trustServerCertificate: true
  }
}
```

### Errores de columnas no encontradas

Ejecuta: `sql/00_validar_estructura.sql` para verificar que las tablas tengan los nombres correctos.

## 📄 Licencia

ISC

## 👥 Autores

Autodata Uruguay
