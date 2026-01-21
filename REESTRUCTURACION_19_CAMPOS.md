# 📋 REESTRUCTURACIÓN DE BASE DE DATOS - 19 CAMPOS

## 📅 Fecha de Implementación
**20 de Enero, 2026**

---

## 🎯 Objetivo

Simplificar y optimizar la estructura de la base de datos de modelos, reduciendo a **19 campos esenciales** divididos en:
- **5 campos obligatorios** (Datos de Carga)
- **14 campos de Datos Mínimos**

Los equipamientos (aprox. 150 campos) se mantienen en una tabla separada `EquipamientoModelo`.

---

## 📊 Nueva Estructura de Tabla Modelo

### 🔴 Campos Obligatorios (5) - Datos de Carga

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 1 | **MarcaID** | INT | FK a tabla Marca | 15 |
| 2 | **Familia** | NVARCHAR(100) | Familia del modelo | "Civic", "Corolla" |
| 3 | **Modelo** | NVARCHAR(200) | Nombre del modelo | "Civic Type R 2024" |
| 4 | **Combustible** | NVARCHAR(50) | Tipo de combustible | "Nafta", "Diesel", "Híbrido" |
| 5 | **CategoriaVehiculo** | NVARCHAR(100) | Categoría del vehículo | "Auto", "SUV", "Camioneta" |

### 🟡 Datos Mínimos (14)

| # | Campo | Tipo | Descripción | Ejemplo |
|---|-------|------|-------------|---------|
| 6 | **SegmentacionAutodata** | NVARCHAR(100) | Segmento del vehículo | "C-Segment", "D-Segment" |
| 7 | **Carroceria** | NVARCHAR(100) | Tipo de carrocería | "Sedán", "SUV", "Hatchback" |
| 8 | **OrigenCodigo** | NVARCHAR(100) | Origen del vehículo | "Japonés", "Europeo", "Americano" |
| 9 | **Cilindros** | INT | Número de cilindros | 4, 6, 8 |
| 10 | **Valvulas** | INT | Número de válvulas | 16, 24 |
| 11 | **CC** | INT | Cilindrada (cm³) | 1998, 2500 |
| 12 | **HP** | INT | Potencia (caballos de fuerza) | 150, 250 |
| 13 | **TipoCajaAut** | NVARCHAR(100) | Tipo de caja automática | "CVT", "Secuencial 8AT" |
| 14 | **Puertas** | INT | Número de puertas | 2, 4, 5 |
| 15 | **Asientos** | INT | Número de asientos | 5, 7 |
| 16 | **TipoMotor** | NVARCHAR(100) | Tipo de motor | "Aspirado", "Turbo", "Eléctrico" |
| 17 | **TipoVehiculoElectrico** | NVARCHAR(100) | Tipo si es eléctrico | "BEV", "PHEV", "HEV" |
| 18 | **Importador** | NVARCHAR(100) | Empresa importadora | "Inchcape Motors" |
| 19 | **PrecioInicial** | DECIMAL(18,2) | Precio inicial del modelo | 35000.00 |

---

## 🔄 Campos Eliminados

Los siguientes campos fueron **eliminados** de la tabla Modelo:

- ❌ `Modelo1` (redundante con campo Modelo)
- ❌ `Tipo2_Carroceria` (renombrado a `Carroceria`)
- ❌ `Año` (no esencial para datos mínimos)
- ❌ `Tipo` (consolidado)
- ❌ `Tipo2` (consolidado)
- ❌ `TipoVehiculo` (consolidado con CategoriaVehiculo)
- ❌ `Turbo` (información en TipoMotor)
- ❌ `Traccion` (movido a equipamiento)
- ❌ `Caja` (consolidado con TipoCajaAut)
- ❌ `TipoCaja` (consolidado con TipoCajaAut)
- ❌ `Pasajeros` (reemplazado por Asientos)

---

## 📦 Tabla EquipamientoModelo

La tabla `EquipamientoModelo` contiene **~150 campos** organizados en categorías:

### Categorías de Equipamiento

1. **Dimensiones y Datos Técnicos** (15 campos)
   - Largo, Ancho, Altura, DistanciaEjes, PesoOrdenMarcha, etc.

2. **Mecánica** (9 campos)
   - Tracción, Suspensión, Caja, MarchasVelocidades, etc.

3. **Consumo y Emisiones** (4 campos)
   - CO2_g_km, ConsumoRuta, ConsumoUrbano, ConsumoMixto

4. **Garantía** (3 campos)
   - GarantiaAnios, GarantiaKm, GarantiasDiferenciales

5. **Vehículos Eléctricos/Híbridos** (12 campos)
   - TipoVehiculoElectrico, CapacidadBateria, AutonomiaMaxRange, etc.

6. **Confort e Interior** (15 campos)
   - SistemaClimatizacion, Direccion, Tapizado, etc.

7. **Seguridad** (16 campos)
   - ABS, ESP, Airbags, AsistenciaFrenado, etc.

8. **Multimedia** (13 campos)
   - PantallaMultimedia, Bluetooth, GPS, etc.

9. **Asientos** (18 campos)
   - NumeroAsientos, AsientoElectrico, AsientoCalefaccionado, etc.

10. **Iluminación** (11 campos)
    - FarosLED, FarosXenon, LucesNeblina, etc.

11. **Y más categorías...**

**Relación:** `ModeloID` (FK única a Modelo)

---

## 🚀 Scripts de Migración

### Ejecutar en Orden:

```sql
-- 1. Reestructurar tabla Modelo (elimina campos, renombra, agrega faltantes)
:r sql/08_reestructurar_modelos_19_campos.sql
GO

-- 2. Verificar tabla EquipamientoModelo (ya existe con estructura correcta)
-- Si necesitas recrearla:
-- :r sql/07_recrear_equipamiento_modelo.sql
-- GO
```

### Verificación Post-Migración:

```sql
-- Verificar columnas de Modelo
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Modelo'
ORDER BY ORDINAL_POSITION;

-- Contar modelos
SELECT COUNT(*) as TotalModelos FROM Modelo WHERE Activo = 1;

-- Verificar equipamientos
SELECT COUNT(*) as TotalEquipamientos FROM EquipamientoModelo;
```

---

## 💻 Cambios en el Código

### Backend (Node.js)

#### ✅ Archivos Modificados:

1. **`src/middleware/estadoValidation.js`**
   ```javascript
   // Campos actualizados (sin Modelo1, con Carroceria)
   const CAMPOS_DATOS_MINIMOS = [
     'SegmentacionAutodata',
     'Carroceria',  // Antes: Tipo2_Carroceria
     'OrigenCodigo',
     'Cilindros',
     'Valvulas',
     'CC',
     'HP',
     'TipoCajaAut',
     'Puertas',
     'Asientos',
     'TipoMotor',
     'TipoVehiculoElectrico',
     'Importador',
     'PrecioInicial'
   ];
   ```

2. **`src/controllers/modelosController.js`**
   ```javascript
   const camposPermitidos = [
     // 5 Obligatorios
     'MarcaID', 'DescripcionModelo', 'Familia', 'CombustibleCodigo', 'CategoriaVehiculo',
     // 14 Datos Mínimos
     'SegmentacionAutodata', 'Carroceria', 'OrigenCodigo', 'Cilindros', 'Valvulas', 
     'CC', 'HP', 'TipoCajaAut', 'Puertas', 'Asientos', 'TipoMotor', 
     'TipoVehiculoElectrico', 'Importador', 'PrecioInicial',
     // Control
     'Estado', 'UltimoComentario'
   ];
   ```

### Frontend (React + TypeScript)

#### ✅ Archivos Modificados:

1. **`frontend/src/types/index.ts`**
   ```typescript
   export interface Modelo {
     // ... otros campos ...
     
     // Datos de Carga (5 obligatorios)
     Familia?: string;
     CombustibleCodigo?: string;
     CategoriaVehiculo?: string;
     
     // Datos Mínimos (14)
     SegmentacionAutodata?: string;
     Carroceria?: string;  // Antes: Tipo2_Carroceria
     // ❌ Modelo1 eliminado
     OrigenCodigo?: string;
     Cilindros?: number;
     Valvulas?: number;
     CC?: number;
     HP?: number;
     TipoCajaAut?: string;
     Puertas?: number;
     Asientos?: number;
     TipoMotor?: string;
     TipoVehiculoElectrico?: string;
     Importador?: string;
     PrecioInicial?: number;
   }
   ```

2. **`frontend/src/components/modelos/FormularioDatosMinimos.tsx`**
   ```typescript
   // Eliminado campo Modelo1
   // Cambiado Tipo2_Carroceria por Carroceria
   
   const [formData, setFormData] = useState<Partial<Modelo>>({
     SegmentacionAutodata: modelo.SegmentacionAutodata || '',
     Carroceria: modelo.Carroceria || '',  // ✅ Actualizado
     OrigenCodigo: modelo.OrigenCodigo || '',
     // ... resto de campos ...
   });
   ```

3. **`frontend/src/pages/RevisarPage.tsx`**
   ```typescript
   // Cambiado de Modelo1 a Carroceria
   <p className="font-medium">{modeloSeleccionado.Carroceria || '-'}</p>
   ```

---

## ✅ Checklist de Verificación

### Base de Datos
- [x] Script de reestructuración creado (`08_reestructurar_modelos_19_campos.sql`)
- [ ] Script ejecutado en SQL Server
- [ ] Backup de datos creado (`Modelo_Backup_20260120`)
- [ ] Verificadas 19 columnas en tabla Modelo
- [ ] Tabla EquipamientoModelo con ~150 campos

### Backend
- [x] Middleware `estadoValidation.js` actualizado
- [x] Controller `modelosController.js` actualizado
- [x] Campo `Modelo1` eliminado de validaciones
- [x] Campo `Carroceria` agregado

### Frontend
- [x] Types de TypeScript actualizados
- [x] Formulario de Datos Mínimos actualizado
- [x] Página de Revisión actualizada
- [x] Campo `Modelo1` eliminado del formulario
- [x] Campo `Carroceria` reemplaza a `Tipo2_Carroceria`

### Testing
- [ ] Crear nuevo modelo con datos obligatorios
- [ ] Cargar datos mínimos (14 campos)
- [ ] Cargar equipamiento en tabla separada
- [ ] Consultar modelo con equipamiento
- [ ] Verificar flujo de estados

---

## 📝 Notas Importantes

### 🔒 Campos de Control (No eliminados)

Los siguientes campos de control y auditoría **se mantienen**:

- `Estado` (flujo de trabajo)
- `EtapaFlujo` (1-4)
- `ResponsableActualID`
- `CreadoPorID`, `FechaCreacion`
- `ModificadoPorID`, `FechaModificacion`
- `Activo`
- `CodigoModelo`, `CodigoAutodata` (identificadores únicos)

### 🔗 Relación Modelo-Equipamiento

```
Modelo (1) ←→ (0..1) EquipamientoModelo
```

- Un modelo puede tener **0 o 1** registro de equipamiento
- La relación es `ModeloID` (FK única)
- `ON DELETE CASCADE`: Si se elimina el modelo, se elimina su equipamiento

### 🎯 Beneficios

1. **Simplicidad**: Solo 19 campos esenciales en Modelo
2. **Organización**: Equipamiento separado en tabla dedicada
3. **Performance**: Queries más rápidos al consultar solo datos básicos
4. **Escalabilidad**: Fácil agregar más campos de equipamiento sin afectar Modelo
5. **Mantenimiento**: Código más limpio y fácil de mantener

---

## 🔄 Flujo de Trabajo

### Fase 1: Datos de Carga (Obligatorios)
Usuario ingresa 5 campos obligatorios:
- Marca (selección de catálogo)
- Familia
- Modelo
- Combustible
- Categoría de Vehículo

**Estado:** `creado` → `revision_minimos`

### Fase 2: Datos Mínimos
Usuario completa 14 campos de datos mínimos:
- Segmento, Carrocería, Origen
- Especificaciones del motor (Cilindros, Válvulas, CC, HP)
- Tipo de motor y caja
- Datos físicos (Puertas, Asientos)
- Otros (Importador, Precio)

**Estado:** `revision_minimos` → `minimos_aprobados`

### Fase 3: Equipamiento
Usuario carga ~150 campos de equipamiento en tabla separada.

**Estado:** `minimos_aprobados` → `revision_equipamiento` → `definitivo`

---

## 📞 Contacto

Para consultas sobre esta reestructuración:
- **Fecha**: 20 de Enero, 2026
- **Sistema**: Autodata Uruguay
- **Módulo**: Gestión de Modelos

---

## 📄 Archivos Relacionados

- [`sql/08_reestructurar_modelos_19_campos.sql`](sql/08_reestructurar_modelos_19_campos.sql) - Script principal
- [`sql/07_recrear_equipamiento_modelo.sql`](sql/07_recrear_equipamiento_modelo.sql) - Tabla equipamiento
- [`src/middleware/estadoValidation.js`](src/middleware/estadoValidacion.js) - Validaciones backend
- [`src/controllers/modelosController.js`](src/controllers/modelosController.js) - Controller
- [`frontend/src/types/index.ts`](frontend/src/types/index.ts) - Tipos TypeScript
- [`frontend/src/components/modelos/FormularioDatosMinimos.tsx`](frontend/src/components/modelos/FormularioDatosMinimos.tsx) - Formulario

---

**✅ Reestructuración completada y documentada**
