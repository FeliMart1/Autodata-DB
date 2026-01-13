# Sistema CodigoAutodata - Implementación Completa

## 📋 Resumen

El sistema **CodigoAutodata** es un identificador único de 8 dígitos para cada vehículo en la base de datos. Se compone de:

```
CodigoAutodata = CodigoMarca (4 dígitos) + CodigoModelo (4 dígitos)
```

### Ejemplo:
- **Audi** = Marca número 7 → CodigoMarca: `0007`
- **Q3 Advanced 1.4 TFSI** = Modelo número 276 → CodigoModelo: `0276`
- **CodigoAutodata** = `00070276`

---

## ✅ Implementación Completa

### 1. Base de Datos

#### Tabla Marca
- ✅ Campo `CodigoMarca` modificado a `CHAR(4)` NOT NULL
- ✅ Formato: 4 dígitos con padding de ceros (0001, 0002, ..., 9999)
- ✅ Generación automática secuencial

#### Tabla Modelo
- ✅ Campo `CodigoModelo` modificado a `CHAR(4)` NOT NULL
- ✅ Campo `CodigoAutodata` agregado: `CHAR(8)` NOT NULL
- ✅ Índice único en `CodigoAutodata`
- ✅ Formato: CodigoMarca + CodigoModelo

### 2. Backend (Node.js)

#### Archivo: `src/utils/codigoAutodata.js`
Utilidades creadas:
```javascript
formatToCodigo4(num)                    // Formatea número a 4 dígitos
generarCodigoAutodata(marca, modelo)   // Genera código de 8 dígitos
descomponerCodigoAutodata(codigo)     // Separa en marca y modelo
validarCodigoAutodata(codigo)         // Valida formato
obtenerProximoCodigoMarca(db)         // Obtiene siguiente código disponible
obtenerProximoCodigoModelo(db)        // Obtiene siguiente código disponible
existeCodigoAutodata(db, codigo)      // Verifica existencia
```

#### Controladores Actualizados

**marcasController.js:**
- ✅ `create()` genera automáticamente CodigoMarca secuencial
- ✅ `getAll()` incluye CodigoMarca en respuesta
- ✅ `getById()` incluye CodigoMarca

**modelosController.js:**
- ✅ `create()` genera automáticamente CodigoModelo y CodigoAutodata
- ✅ `getAll()` incluye CodigoAutodata, CodigoMarca, CodigoModelo
- ✅ `getById()` incluye todos los códigos
- ✅ **Nuevo endpoint:** `getByCodigoAutodata()` busca por código de 8 dígitos

#### Rutas Nuevas

**`GET /api/modelos/codigo/:codigoAutodata`**
- Busca un modelo por su CodigoAutodata único
- Retorna modelo completo con versiones y precios
- Ejemplo: `GET /api/modelos/codigo/00070276`

---

## 📊 Estructura de Datos

### Marca
```json
{
  "MarcaID": 1,
  "CodigoMarca": "0001",
  "Marca": "Toyota",
  "PaisOrigen": "Japón",
  "FechaCreacion": "2024-12-11T10:15:30.000Z"
}
```

### Modelo
```json
{
  "ModeloID": 1,
  "MarcaID": 1,
  "CodigoModelo": "0001",
  "CodigoAutodata": "00010001",
  "Modelo": "Corolla 2024",
  "MarcaNombre": "Toyota",
  "CodigoMarca": "0001",
  "Estado": "IMPORTADO",
  "Anio": 2024
}
```

---

## 🔧 Uso del Sistema

### 1. Crear una nueva Marca

```javascript
POST /api/marcas
{
  "marca": "Audi",
  "paisOrigen": "Alemania"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Marca creada exitosamente",
  "data": {
    "MarcaID": 7,
    "CodigoMarca": "0007",  // ← Generado automáticamente
    "Marca": "Audi",
    "PaisOrigen": "Alemania"
  }
}
```

### 2. Crear un nuevo Modelo

```javascript
POST /api/modelos
{
  "marcaId": 7,
  "modelo": "Q3 Advanced 1.4 TFSI Full",
  "anio": 2024,
  "combustible": "Nafta",
  "tipo": "SUV"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Modelo creado exitosamente",
  "data": {
    "ModeloID": 276,
    "MarcaID": 7,
    "CodigoModelo": "0276",      // ← Generado automáticamente
    "CodigoAutodata": "00070276", // ← Generado automáticamente
    "Modelo": "Q3 Advanced 1.4 TFSI Full",
    "MarcaNombre": "Audi",
    "CodigoMarca": "0007",
    "Estado": "IMPORTADO"
  }
}
```

### 3. Buscar por CodigoAutodata

```javascript
GET /api/modelos/codigo/00070276
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "ModeloID": 276,
    "CodigoAutodata": "00070276",
    "CodigoMarca": "0007",
    "CodigoModelo": "0276",
    "DescripcionModelo": "Q3 Advanced 1.4 TFSI Full",
    "MarcaNombre": "Audi",
    "versiones": [...],
    "precios": [...]
  }
}
```

### 4. Listar Modelos con Códigos

```javascript
GET /api/modelos?limit=10&page=1
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "ModeloID": 1,
      "CodigoAutodata": "00010001",
      "CodigoMarca": "0001",
      "CodigoModelo": "0001",
      "Modelo": "Corolla 2024",
      "MarcaNombre": "Toyota"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 41,
    "pages": 5
  }
}
```

---

## 🎯 Ventajas del Sistema

1. **Identificación Única:** Cada vehículo tiene un código único de 8 dígitos
2. **Trazabilidad:** El código revela inmediatamente la marca y modelo
3. **Escalabilidad:** Soporta hasta 9999 marcas y 9999 modelos por marca
4. **Simplicidad:** Formato fijo, fácil de validar y comunicar
5. **Compatibilidad:** Se mantiene compatibilidad con IDs internos

---

## 📝 Validaciones Implementadas

### CodigoMarca (4 dígitos)
- ✅ Generación automática secuencial
- ✅ Formato: `0001` hasta `9999`
- ✅ Único por marca
- ✅ NOT NULL en base de datos

### CodigoModelo (4 dígitos)
- ✅ Generación automática secuencial
- ✅ Formato: `0001` hasta `9999`
- ✅ NOT NULL en base de datos

### CodigoAutodata (8 dígitos)
- ✅ Generación automática al crear modelo
- ✅ Formato: `MMMMAAAA` (Marca + Modelo)
- ✅ Único en toda la base de datos
- ✅ Índice único para búsquedas rápidas
- ✅ NOT NULL en base de datos

---

## 🔍 Ejemplos Reales

### Modelos Existentes

| CodigoAutodata | Marca | CodigoMarca | Modelo | CodigoModelo |
|----------------|-------|-------------|--------|--------------|
| `00010001` | Toyota | 0001 | Corolla 2024 | 0001 |
| `00010002` | Toyota | 0001 | Yaris | 0002 |
| `00020004` | Honda | 0002 | Civic | 0004 |
| `00030005` | Ford | 0003 | Ranger | 0005 |
| `00040006` | Chevrolet | 0004 | Tracker | 0006 |

---

## 🚀 Próximos Pasos

### Frontend
- [ ] Mostrar CodigoAutodata en listados
- [ ] Agregar búsqueda por CodigoAutodata
- [ ] Mostrar códigos en formularios de creación
- [ ] Badge visual para CodigoAutodata

### Backend
- [ ] Endpoint de búsqueda avanzada por rango de códigos
- [ ] Validación de códigos en import CSV
- [ ] Generación de reportes por código
- [ ] API de verificación masiva de códigos

---

## 📦 Archivos Modificados

```
sql/
  └── add-codigo-autodata.sql          # Script de migración DB

src/
  ├── utils/
  │   └── codigoAutodata.js            # ✨ NUEVO: Utilidades
  ├── controllers/
  │   ├── marcasController.js          # ✏️ Actualizado
  │   └── modelosController.js         # ✏️ Actualizado  
  └── routes/
      └── modelosRoutes.js             # ✏️ Actualizado (nuevo endpoint)
```

---

## ✅ Estado Final

- **Base de Datos:** ✅ Migrada y actualizada
- **Backend API:** ✅ Completamente implementado
- **Generación Automática:** ✅ Funcional
- **Validaciones:** ✅ Implementadas
- **Búsqueda por Código:** ✅ Endpoint disponible
- **Documentación:** ✅ Completa

**El sistema CodigoAutodata está 100% funcional y listo para usar.**
