# Plan de Desarrollo - Sistema Autodata

**Fecha de inicio:** 10 de Diciembre, 2025  
**Estado actual:** Infraestructura base completada, login funcional

---

## 📊 Estado Actual del Proyecto

### ✅ Completado (Fase 0)
- [x] Estructura completa del frontend (React + TypeScript + Vite)
- [x] Estructura del backend (Node.js + Express)
- [x] Componentes UI base (14 componentes)
- [x] Sistema de autenticación básico
- [x] Conexión a SQL Server
- [x] Configuración de desarrollo (ESLint, Tailwind, etc.)
- [x] Login funcional con usuario temporal

### 🚧 En Progreso
- Ninguna tarea actualmente

### ⏳ Pendiente
- Todo el desarrollo funcional del sistema

---

## 🎯 Plan de Desarrollo por Fases

### **FASE 1: BASE DE DATOS Y FUNDAMENTOS** (3-4 días)

#### Tarea 1.1: Crear Estructura de Base de Datos
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 4-6 horas

**Subtareas:**
1. Crear tabla `Usuario`
   - UsuarioID (PK)
   - Username (único)
   - Password (hash bcrypt)
   - Nombre, Email
   - Rol (entrada_datos, revision, aprobacion, admin)
   - Activo (bit)
   - FechaCreacion, FechaModificacion

2. Crear tabla `Marca`
   - MarcaID (PK)
   - Marca (nombre)
   - PaisOrigen
   - LogoURL
   - Activo
   - Timestamps

3. Crear tabla `Modelo`
   - ModeloID (PK)
   - MarcaID (FK)
   - Modelo (nombre)
   - Familia, Origen, Combustible, Año
   - Tipo, CC, HP, Traccion, Caja
   - Puertas, Pasajeros
   - Estado (enum: importado, datos_minimos, etc.)
   - ResponsableActualID (FK Usuario)
   - Timestamps

4. Crear tabla `ModeloEstado` (tracking de cambios de estado)
   - ModeloEstadoID (PK)
   - ModeloID (FK)
   - EstadoAnterior
   - EstadoNuevo
   - UsuarioID (FK)
   - Observaciones
   - FechaCambio

5. Crear tabla `ModeloHistorial` (auditoría completa)
   - HistorialID (PK)
   - ModeloID (FK)
   - UsuarioID (FK)
   - Campo (nombre del campo modificado)
   - ValorAnterior
   - ValorNuevo
   - Accion (crear, editar, eliminar)
   - FechaModificacion

6. Crear tabla `EquipamientoModelo`
   - EquipamientoID (PK)
   - ModeloID (FK)
   - 140+ campos de equipamiento (bit o int)
   - Timestamps

7. Crear tabla `PrecioModelo`
   - PrecioModeloID (PK)
   - ModeloID (FK)
   - Precio (decimal)
   - Moneda (VARCHAR)
   - VigenciaDesde (date)
   - VigenciaHasta (date, nullable)
   - Observaciones
   - UsuarioID (FK)
   - Timestamps

8. Crear tabla `VersionModelo`
   - VersionID (PK)
   - ModeloID (FK)
   - NombreVersion
   - Descripcion
   - Activo
   - Timestamps

9. Crear tabla `PrecioVersion`
   - Similar a PrecioModelo pero para versiones

10. Crear tabla `VentasModelo`
    - VentasID (PK)
    - ModeloID (FK)
    - Periodo (YYYYMM)
    - Cantidad
    - UsuarioID (FK)
    - Timestamps

**Scripts SQL:**
- `sql/03_crear_tablas_completas.sql`
- `sql/04_seed_usuario_admin.sql`

**Validación:**
- Todas las tablas creadas sin errores
- Foreign keys funcionando
- Constraints aplicados correctamente
- Usuario admin insertado correctamente

---

#### Tarea 1.2: Seeders de Datos Iniciales
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 2 horas

**Subtareas:**
1. Crear script para insertar usuario admin real
2. Insertar marcas principales (20-30 marcas)
3. Crear datos de ejemplo para testing (opcional)

**Scripts SQL:**
- `sql/05_seed_marcas_principales.sql`
- `sql/06_seed_datos_ejemplo.sql`

---

#### Tarea 1.3: Actualizar Backend para Tablas Reales
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 3-4 horas

**Archivos a modificar:**
1. `src/controllers/authController.js`
   - Eliminar lógica de usuario temporal
   - Usar tabla Usuario real
   - Hashear contraseñas correctamente

2. Crear `src/models/` (opcional, usar Knex query builder)
   - `Usuario.js`
   - `Marca.js`
   - `Modelo.js`
   - `EquipamientoModelo.js`
   - `PrecioModelo.js`

3. Actualizar `src/middleware/auth.js`
   - Cargar usuario desde BD en cada request

**Validación:**
- Login funciona con usuario de BD
- Token JWT válido
- Middleware auth funcionando

---

### **FASE 2: MÓDULOS BÁSICOS - MARCAS** (2 días)

#### Tarea 2.1: Backend - API de Marcas
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 3 horas

**Endpoints a crear/actualizar:**
```
GET    /api/marcas              - Listar todas (con paginación)
GET    /api/marcas/:id          - Obtener una marca
POST   /api/marcas              - Crear marca
PUT    /api/marcas/:id          - Actualizar marca
DELETE /api/marcas/:id          - Eliminar (soft delete)
GET    /api/marcas/search?q=    - Buscar marcas
```

**Archivos:**
- `src/controllers/marcasController.js` (actualizar)
- `src/routes/marcasRoutes.js` (verificar)

**Validaciones:**
- Nombre de marca único
- Validar campos requeridos
- Solo admin puede crear/editar/eliminar

---

#### Tarea 2.2: Frontend - Página de Marcas
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 4 horas

**Componentes a crear:**
1. `frontend/src/pages/MarcasPage.tsx`
   - Lista de marcas con DataTable
   - Filtros y búsqueda
   - Botón "Nueva Marca"

2. `frontend/src/components/marcas/MarcaForm.tsx`
   - Formulario en Dialog/Modal
   - Campos: Nombre, País Origen, Logo URL
   - Validación con Zod

3. `frontend/src/components/marcas/MarcaCard.tsx`
   - Card visual de marca (opcional)

**Rutas:**
- `/marcas` - Lista de marcas

**Validación:**
- CRUD completo funcional
- Solo admin ve botones de edición
- Paginación funcionando

---

### **FASE 3: MÓDULOS BÁSICOS - MODELOS** (3-4 días)

#### Tarea 3.1: Backend - API de Modelos
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 5-6 horas

**Endpoints:**
```
GET    /api/modelos                    - Listar con filtros
GET    /api/modelos/:id                - Obtener uno
POST   /api/modelos                    - Crear modelo
PUT    /api/modelos/:id                - Actualizar datos mínimos
DELETE /api/modelos/:id                - Eliminar
PUT    /api/modelos/:id/estado         - Cambiar estado
GET    /api/modelos/:id/historial      - Obtener historial
GET    /api/modelos/estado/:estado     - Filtrar por estado
```

**Lógica especial:**
- Registrar en `ModeloHistorial` cada cambio
- Registrar en `ModeloEstado` cada cambio de estado
- Validar transiciones de estado permitidas
- Asignar responsable según estado

**Archivos:**
- `src/controllers/modelosController.js` (actualizar)
- `src/middleware/estadoValidator.js` (nuevo)

---

#### Tarea 3.2: Frontend - Lista de Modelos
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 4 horas

**Ya existe:** `frontend/src/pages/ModelosPage.tsx`

**Actualizar:**
- Conectar con API real
- Implementar filtros (marca, estado, año, tipo)
- Búsqueda con debounce funcional
- Paginación server-side
- Click en fila para ir a detalle

**Validación:**
- Filtros funcionando
- Paginación correcta
- Performance con 1000+ registros

---

#### Tarea 3.3: Frontend - Detalle de Modelo (Datos Mínimos)
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 5 horas

**Ya existe:** 
- `frontend/src/pages/ModeloDetailPage.tsx`
- `frontend/src/components/modelos/DatosMinimosForm.tsx`

**Actualizar:**
1. Conectar formulario con API
2. Implementar autoguardado real cada 3 segundos
3. Validaciones:
   - Campos requeridos: Familia, Combustible, Año, Tipo
   - Año entre 1900 y actual+1
   - CC y HP > 0
4. Manejo de estados:
   - ReadOnly si no tiene permisos
   - Mostrar botón "Enviar a Revisión"
5. Indicador visual de guardado

**Validación:**
- Autoguardado funciona
- Validaciones correctas
- ReadOnly según rol

---

### **FASE 4: IMPORTACIÓN** (2-3 días)

#### Tarea 4.1: Backend - Sistema de Importación
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 6 horas

**Endpoints:**
```
POST   /api/import/preview     - Previsualizar archivo
POST   /api/import/execute     - Ejecutar importación
GET    /api/import/template    - Descargar plantilla
```

**Lógica:**
1. `preview`: 
   - Parsear CSV/Excel
   - Validar cada fila
   - Retornar errores y datos válidos
   - No guardar en BD

2. `execute`:
   - Recibir array de datos válidos
   - Crear/actualizar marcas
   - Crear modelos con estado "importado"
   - Transacción (todo o nada)
   - Log de importación

**Validaciones:**
- Campos requeridos: marca, modelo
- Tipos de datos correctos
- Duplicados (opcional: skip o error)

**Archivos:**
- `src/controllers/importController.js` (actualizar)
- `src/utils/csvParser.js` (nuevo)
- `src/utils/excelParser.js` (nuevo)

---

#### Tarea 4.2: Frontend - Página de Importación
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 4 horas

**Ya existe:** `frontend/src/pages/ImportPage.tsx`

**Actualizar:**
1. Conectar con API real
2. Download template funcional
3. Preview con validación real
4. Tabla de errores con detalles
5. Botón de importar solo si no hay errores
6. Progress bar durante importación
7. Resumen de resultados

**Validación:**
- Import de 100 modelos < 10 segundos
- Errores mostrados claramente
- Rollback en caso de error

---

### **FASE 5: EQUIPAMIENTO** (2 días)

#### Tarea 5.1: Backend - API de Equipamiento
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 3 horas

**Endpoints:**
```
GET    /api/equipamiento/modelo/:id    - Obtener equipamiento
POST   /api/equipamiento/modelo/:id    - Crear equipamiento
PUT    /api/equipamiento/modelo/:id    - Actualizar equipamiento
```

**Lógica:**
- Crear registro si no existe
- Actualizar campos modificados
- Registrar en historial
- Validar que modelo existe

**Archivos:**
- `src/controllers/equipamientoController.js` (crear)
- `src/routes/equipamientoRoutes.js` (crear)

---

#### Tarea 5.2: Frontend - Formulario de Equipamiento
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 3 horas

**Ya existe:** `frontend/src/components/equipamiento/EquipamientoForm.tsx`

**Actualizar:**
1. Conectar con API
2. Cargar equipamiento existente
3. Guardar al hacer submit (NO autoguardado por cantidad)
4. Búsqueda de campos funcional
5. Marcar/desmarcar por categoría
6. Loading states

**Validación:**
- Guardado correcto de 140+ campos
- Performance aceptable
- Categorías colapsables funcionales

---

### **FASE 6: PRECIOS** (2 días)

#### Tarea 6.1: Backend - API de Precios
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 4 horas

**Endpoints:**
```
GET    /api/precios/modelo/:id          - Historial de precios
POST   /api/precios/modelo              - Crear precio
PUT    /api/precios/:id                 - Actualizar precio
DELETE /api/precios/:id                 - Eliminar precio
GET    /api/precios/version/:id         - Precios de versión
POST   /api/precios/version             - Crear precio versión
```

**Lógica especial:**
- Al crear precio nuevo, cerrar vigencia del anterior (VigenciaHasta = hoy)
- Validar que no haya solapamiento de fechas
- Solo usuarios autorizados pueden crear precios

**Archivos:**
- `src/controllers/preciosController.js` (crear)
- `src/routes/preciosRoutes.js` (crear)

---

#### Tarea 6.2: Frontend - Sección de Precios
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 4 horas

**Ya existe:** `frontend/src/components/precios/PreciosSection.tsx`

**Actualizar:**
1. Conectar con API
2. Mostrar historial en tabla
3. Gráfico de evolución con datos reales
4. Modal "Agregar Precio" funcional
5. Cards de resumen
6. Validación de fechas

**Validación:**
- Gráfico renderiza correctamente
- Vigencias se cierran automáticamente
- No permite fechas solapadas

---

### **FASE 7: FLUJO DE ESTADOS Y PERMISOS** (3 días)

#### Tarea 7.1: Backend - Lógica de Estados
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 5 horas

**Implementar:**
1. Validador de transiciones de estado
   ```javascript
   const transicionesPermitidas = {
     importado: ['datos_minimos'],
     datos_minimos: ['equipamiento_cargado'],
     equipamiento_cargado: ['en_revision'],
     en_revision: ['en_aprobacion', 'para_corregir'],
     para_corregir: ['datos_minimos'],
     en_aprobacion: ['aprobado', 'en_revision'],
     aprobado: ['definitivo'],
     definitivo: []
   };
   ```

2. Middleware de permisos por rol y estado
   ```javascript
   function puedeEditar(usuario, modelo) {
     if (usuario.rol === 'admin') return true;
     if (usuario.rol === 'entrada_datos') {
       return ['importado', 'datos_minimos', 'equipamiento_cargado', 'para_corregir'].includes(modelo.estado);
     }
     // ... más lógica
   }
   ```

3. Endpoint para cambiar estado con validaciones

**Archivos:**
- `src/middleware/estadoValidator.js`
- `src/middleware/permisoModelo.js`
- Actualizar `src/controllers/modelosController.js`

---

#### Tarea 7.2: Frontend - Botones de Acciones por Estado
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 4 horas

**En ModeloDetailPage:**
1. Botones dinámicos según estado actual:
   - Estado "equipamiento_cargado" → "Enviar a Revisión"
   - Estado "en_revision" → "Aprobar" / "Devolver para Corrección"
   - Estado "en_aprobacion" → "Aprobar Definitivamente" / "Rechazar"

2. Validar permisos del usuario actual

3. Dialogs de confirmación con observaciones

**Validación:**
- Solo aparecen botones permitidos
- Confirmaciones funcionan
- Estados se actualizan en UI

---

### **FASE 8: REVISIÓN Y APROBACIÓN** (2-3 días)

#### Tarea 8.1: Frontend - Página de Revisión
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 5 horas

**Crear:** `frontend/src/pages/RevisionPage.tsx`

**Contenido:**
1. Lista de modelos en estado "en_revision"
2. Filtros: marca, tipo, fecha
3. Vista de comparación (antes/después) opcional
4. Botones masivos:
   - Aprobar seleccionados
   - Rechazar seleccionados
5. Click en fila → Detalle del modelo

**Ruta:** `/revision`

**Permisos:** Solo roles "revision" y "admin"

---

#### Tarea 8.2: Frontend - Página de Aprobación
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 5 horas

**Crear:** `frontend/src/pages/AprobacionPage.tsx`

**Contenido:**
1. Lista de modelos en estado "en_aprobacion"
2. Vista detallada de cada modelo
3. Checklist de verificación
4. Botones:
   - Aprobar definitivamente
   - Rechazar (devolver a revisión)
5. Campo de observaciones obligatorio en rechazo

**Ruta:** `/aprobacion`

**Permisos:** Solo roles "aprobacion" y "admin"

---

### **FASE 9: HISTORIAL Y AUDITORÍA** (2 días)

#### Tarea 9.1: Backend - API de Historial
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 2 horas

**Endpoint ya existente:**
```
GET /api/modelos/:id/historial
```

**Mejorar:**
- Paginación
- Filtros por usuario, fecha, campo
- Ordenamiento

---

#### Tarea 9.2: Frontend - Sección de Historial
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 3 horas

**Ya existe:** `frontend/src/components/historial/HistorialSection.tsx`

**Actualizar:**
1. Conectar con API real
2. Tabla completa funcional
3. Timeline view
4. Export a Excel con XLSX
5. Filtros por fecha, usuario

**Validación:**
- Export funciona con 1000+ registros
- Timeline se ve correctamente
- Filtros aplicados

---

### **FASE 10: VENTAS** (2 días)

#### Tarea 10.1: Backend - API de Ventas
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 3 horas

**Endpoints:**
```
GET    /api/ventas/modelo/:id           - Ventas de un modelo
POST   /api/ventas                      - Registrar ventas
PUT    /api/ventas/:id                  - Actualizar
DELETE /api/ventas/:id                  - Eliminar
GET    /api/ventas/periodo/:periodo     - Ventas por periodo (YYYYMM)
GET    /api/ventas/estadisticas         - Stats generales
```

**Archivos:**
- `src/controllers/ventasController.js` (crear)
- `src/routes/ventasRoutes.js` (crear)

---

#### Tarea 10.2: Frontend - Página de Ventas
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 5 horas

**Crear:** `frontend/src/pages/VentasPage.tsx`

**Contenido:**
1. Tabla de ventas mensuales
2. Gráficos:
   - Ventas por mes (LineChart)
   - Top 10 modelos (BarChart)
   - Ventas por marca (PieChart)
3. Filtros:
   - Rango de fechas
   - Marca
   - Modelo
4. Formulario para cargar ventas
5. Export a Excel

**Ruta:** `/ventas`

---

### **FASE 11: DASHBOARD Y MÉTRICAS** (2 días)

#### Tarea 11.1: Backend - API de Dashboard
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 3 horas

**Endpoint:**
```
GET /api/dashboard/stats
```

**Retornar:**
- Total de modelos
- Modelos por estado (breakdown)
- Modelos por etapa
- Pendientes del usuario actual
- Modelos recientes (últimos 10)
- Actividad reciente (últimas 20 acciones)
- Estadísticas de ventas
- Métricas de tiempo (tiempo promedio por etapa)

**Archivos:**
- `src/controllers/dashboardController.js` (crear)

---

#### Tarea 11.2: Frontend - Dashboard Completo
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 4 horas

**Ya existe:** `frontend/src/pages/DashboardPage.tsx`

**Actualizar:**
1. Conectar con API real
2. StatCards con datos reales
3. Quick Actions por rol
4. Gráficos:
   - Modelos por estado (PieChart)
   - Evolución mensual (LineChart)
   - Distribución por marca (BarChart)
5. Tabla de modelos recientes
6. Timeline de actividad reciente

**Validación:**
- Datos se actualizan en tiempo real
- Gráficos renderan correctamente
- Performance < 2 segundos carga

---

### **FASE 12: GESTIÓN DE USUARIOS** (2 días)

#### Tarea 12.1: Backend - API de Usuarios
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 4 horas

**Endpoints:**
```
GET    /api/usuarios                - Listar usuarios (admin)
GET    /api/usuarios/:id            - Obtener usuario
POST   /api/usuarios                - Crear usuario
PUT    /api/usuarios/:id            - Actualizar usuario
DELETE /api/usuarios/:id            - Eliminar (soft delete)
PUT    /api/usuarios/:id/password   - Cambiar contraseña
PUT    /api/usuarios/:id/role       - Cambiar rol
```

**Permisos:** Solo admin

**Archivos:**
- `src/controllers/usuariosController.js` (crear)
- `src/routes/usuariosRoutes.js` (crear)

---

#### Tarea 12.2: Frontend - Página de Usuarios
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 4 hours

**Crear:** `frontend/src/pages/UsuariosPage.tsx`

**Contenido:**
1. DataTable con todos los usuarios
2. Botón "Nuevo Usuario"
3. Formulario en Dialog:
   - Username, Nombre, Email
   - Rol (select)
   - Contraseña inicial
4. Acciones:
   - Editar usuario
   - Cambiar rol
   - Desactivar/Activar
   - Reset password

**Ruta:** `/usuarios`

**Permisos:** Solo admin

---

### **FASE 13: CONFIGURACIÓN Y PERFIL** (1 día)

#### Tarea 13.1: Frontend - Página de Perfil
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 2 horas

**Crear:** `frontend/src/pages/ProfilePage.tsx`

**Contenido:**
1. Información del usuario
2. Cambiar contraseña
3. Preferencias (opcional):
   - Dark mode
   - Idioma
   - Notificaciones

**Ruta:** `/profile`

---

#### Tarea 13.2: Frontend - Página de Configuración
**Prioridad:** 🟢 BAJA  
**Tiempo estimado:** 3 horas

**Crear:** `frontend/src/pages/SettingsPage.tsx`

**Contenido (solo admin):**
1. Configuración general del sistema
2. Logs de errores
3. Backup de BD (botón)
4. Limpieza de datos antiguos

**Ruta:** `/settings`

---

### **FASE 14: TESTING Y OPTIMIZACIÓN** (3-5 días)

#### Tarea 14.1: Testing Manual
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** 8 horas

**Casos de prueba:**
1. Flujo completo: Import → Datos → Equipamiento → Revisión → Aprobación
2. Permisos por rol
3. Validaciones de formularios
4. Transiciones de estado
5. Import masivo (500+ registros)
6. Concurrencia (2 usuarios editando mismo modelo)

---

#### Tarea 14.2: Performance
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 4 horas

**Optimizaciones:**
1. Índices en BD (MarcaID, Estado, UsuarioID)
2. Lazy loading de componentes pesados
3. Virtualized scroll en tablas grandes
4. Caché de API calls con React Query
5. Optimizar queries SQL (joins, selects específicos)

---

#### Tarea 14.3: Bug Fixing
**Prioridad:** 🔴 CRÍTICA  
**Tiempo estimado:** Variable

**Proceso:**
1. Crear issues en GitHub para cada bug
2. Priorizar por severidad
3. Fix y test
4. Deploy

---

### **FASE 15: DOCUMENTACIÓN Y DEPLOY** (2 días)

#### Tarea 15.1: Documentación
**Prioridad:** 🟡 MEDIA  
**Tiempo estimado:** 4 horas

**Documentos:**
1. Manual de usuario (con screenshots)
2. Manual técnico (arquitectura, APIs)
3. Guía de instalación
4. Guía de mantenimiento
5. FAQ

---

#### Tarea 15.2: Deploy a Producción
**Prioridad:** 🟠 ALTA  
**Tiempo estimado:** 4 horas

**Pasos:**
1. Build del frontend (`npm run build`)
2. Configurar servidor (IIS, Apache, Nginx)
3. Configurar variables de entorno producción
4. Migración de BD a servidor producción
5. SSL certificate
6. Testing en producción
7. Monitoreo de logs

---

## 📅 Cronograma Estimado

| Fase | Duración | Inicio | Fin |
|------|----------|--------|-----|
| Fase 1: Base de Datos | 4 días | Día 1 | Día 4 |
| Fase 2: Marcas | 2 días | Día 5 | Día 6 |
| Fase 3: Modelos | 4 días | Día 7 | Día 10 |
| Fase 4: Importación | 3 días | Día 11 | Día 13 |
| Fase 5: Equipamiento | 2 días | Día 14 | Día 15 |
| Fase 6: Precios | 2 días | Día 16 | Día 17 |
| Fase 7: Estados y Permisos | 3 días | Día 18 | Día 20 |
| Fase 8: Revisión/Aprobación | 3 días | Día 21 | Día 23 |
| Fase 9: Historial | 2 días | Día 24 | Día 25 |
| Fase 10: Ventas | 2 días | Día 26 | Día 27 |
| Fase 11: Dashboard | 2 días | Día 28 | Día 29 |
| Fase 12: Usuarios | 2 días | Día 30 | Día 31 |
| Fase 13: Configuración | 1 día | Día 32 | Día 32 |
| Fase 14: Testing | 5 días | Día 33 | Día 37 |
| Fase 15: Deploy | 2 días | Día 38 | Día 39 |

**TOTAL: ~39 días laborables (~2 meses)**

---

## 🎯 Prioridades

### 🔴 CRÍTICAS (Hacer primero)
1. Base de datos completa
2. CRUD de Modelos
3. Flujo de estados
4. Permisos y roles
5. Testing

### 🟠 ALTAS (Hacer después)
1. Importación
2. Marcas
3. Equipamiento
4. Revisión/Aprobación

### 🟡 MEDIAS (Si hay tiempo)
1. Precios
2. Historial completo
3. Dashboard avanzado
4. Ventas

### 🟢 BAJAS (Opcionales)
1. Gestión de usuarios
2. Configuración
3. Perfil de usuario

---

## 📋 Checklist de Validación por Fase

### Fase 1: Base de Datos
- [ ] Todas las tablas creadas
- [ ] Foreign keys funcionando
- [ ] Constraints aplicados
- [ ] Usuario admin funcional
- [ ] Login con usuario de BD funciona

### Fase 3: Modelos
- [ ] CRUD completo funciona
- [ ] Filtros y búsqueda operativos
- [ ] Paginación correcta
- [ ] Autoguardado funciona
- [ ] Validaciones aplicadas

### Fase 4: Importación
- [ ] Import de 100+ modelos exitoso
- [ ] Validaciones correctas
- [ ] Errores mostrados claramente
- [ ] Rollback en caso de error

### Fase 7: Estados
- [ ] Solo transiciones permitidas funcionan
- [ ] Permisos por rol aplicados
- [ ] Historial de cambios registrado

### Fase 14: Testing
- [ ] Flujo completo end-to-end exitoso
- [ ] Sin errores de consola
- [ ] Performance aceptable
- [ ] Todos los roles probados

---

## 🛠️ Herramientas Necesarias

### Durante Desarrollo
- **Backend:** Node.js, npm, nodemon
- **Frontend:** Vite dev server
- **Base de Datos:** SQL Server Management Studio
- **Testing:** Thunder Client o Postman
- **Git:** Para control de versiones

### Para Producción
- **Servidor Web:** IIS, Nginx o Apache
- **Base de Datos:** SQL Server en servidor
- **SSL:** Let's Encrypt o certificado comercial
- **Monitoreo:** PM2, Winston logs
- **Backup:** Scripts automáticos de backup BD

---

## 📝 Notas Importantes

1. **Commits frecuentes:** Hacer commit después de cada tarea completada
2. **Testing continuo:** No avanzar sin probar funcionalidad anterior
3. **Documentación inline:** Comentar código complejo
4. **Backup diario:** De base de datos durante desarrollo
5. **Branch strategy:** Usar branches para features grandes
6. **Code review:** Si hay equipo, revisar código crítico

---

## 🚀 Próximos Pasos Inmediatos

### Para empezar HOY:

1. **Crear script SQL de tablas completas** (1-2 horas)
2. **Ejecutar script y validar estructura** (30 min)
3. **Actualizar authController para usar tabla Usuario real** (1 hora)
4. **Probar login con usuario de BD** (30 min)

**Comando para empezar:**
```bash
# Crear archivo SQL
code sql/03_crear_tablas_completas.sql
```

---

**Versión del plan:** 1.0  
**Última actualización:** 10 de Diciembre, 2025  
**Siguiente revisión:** Después de completar Fase 1
