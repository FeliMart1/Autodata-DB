# Frontend - Sistema Autodata

Sistema web moderno para gestión de datos automotrices con flujo de trabajo estructurado, validaciones, y trazabilidad completa.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Copiar archivo de configuración
cp .env.example .env

# Iniciar desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 📦 Scripts Disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 🛠️ Stack Tecnológico

- **React 18** - Framework UI
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Radix UI** - Componentes accesibles
- **React Query** - Server state
- **React Router** - Navegación
- **Axios** - HTTP client
- **Recharts** - Gráficos

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
│   ├── ui/        # Componentes UI base
│   ├── layout/    # Layout components
│   ├── modelos/   # Componentes de modelos
│   ├── equipamiento/
│   ├── precios/
│   └── historial/
├── pages/         # Páginas principales
├── context/       # React Context providers
├── hooks/         # Custom hooks
├── services/      # API services
├── types/         # TypeScript types
├── utils/         # Utilidades
└── styles/        # Estilos globales
```

## 🎨 Características Principales

### Sistema de Roles

- **Entrada de Datos**: Importación y carga inicial
- **Revisión**: Validación y correcciones
- **Aprobación**: Aprobación final
- **Admin**: Acceso total

### Flujo de Trabajo

1. **Importación** - Carga masiva desde Excel/CSV
2. **Datos Mínimos** - Información básica del modelo
3. **Equipamiento** - 140+ campos de equipamiento
4. **Revisión** - Validación por segundo usuario
5. **Aprobación** - Aprobación final
6. **Base Definitiva** - Modelo en producción

### Componentes UI

- ✅ Buttons con variants y loading states
- ✅ Inputs con validación visual
- ✅ DataTables con sorting y paginación
- ✅ Badges para estados
- ✅ Tabs para navegación
- ✅ Dialogs/Modales
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Alert messages

### Funcionalidades Avanzadas

- **Autoguardado**: Guarda cambios automáticamente cada 3 segundos
- **Búsqueda inteligente**: Búsqueda global con debounce
- **Filtros**: Múltiples filtros combinables
- **Historial**: Trazabilidad completa de cambios
- **Export**: Exportar a Excel
- **Gráficos**: Visualización de datos con Recharts
- **Dark Mode**: Tema claro/oscuro

## 🔐 Autenticación

```typescript
// Login
await authService.login({ email, password });

// Obtener usuario actual
const user = await authService.getCurrentUser();

// Logout
await authService.logout();
```

## 📊 Servicios API

### Modelos

```typescript
modeloService.getAll(filters);
modeloService.getById(id);
modeloService.create(data);
modeloService.update(id, data);
modeloService.cambiarEstado(id, { nuevo_estado, observaciones });
modeloService.getHistorial(id);
```

### Equipamiento

```typescript
equipamientoService.getByModelo(idModelo);
equipamientoService.create(data);
equipamientoService.update(idModelo, data);
```

### Precios

```typescript
precioService.getPreciosByModelo(idModelo);
precioService.createPrecioModelo(data);
```

### Import

```typescript
importService.previewFile(file);
importService.importData(data);
importService.downloadTemplate();
```

## 🎯 Rutas Principales

| Ruta | Descripción | Roles |
|------|-------------|-------|
| `/login` | Inicio de sesión | Público |
| `/dashboard` | Panel principal | Todos |
| `/import` | Importar modelos | Entrada, Admin |
| `/modelos` | Lista de modelos | Todos |
| `/modelos/:id` | Detalle del modelo | Todos |

## 🔧 Configuración

### Variables de Entorno

```env
VITE_API_URL=http://localhost:5000/api
```

### Tailwind Config

El proyecto usa un sistema de colores personalizado basado en HSL:

- `primary`: Azul principal
- `secondary`: Gris secundario
- `success`: Verde para éxitos
- `warning`: Amarillo para advertencias
- `destructive`: Rojo para errores
- `info`: Azul info

### TypeScript

TypeScript en modo strict con paths aliases configurados:

```typescript
import { Button } from '@components/ui/Button';
import { modeloService } from '@services/modeloService';
import { Modelo } from '@types/index';
```

## 📝 Convenciones de Código

### Componentes

```typescript
// Usar función flecha con export
export function MyComponent({ prop }: Props) {
  return <div>{prop}</div>;
}

// Props interface nombrada con sufijo Props
interface MyComponentProps {
  prop: string;
}
```

### Hooks

```typescript
// Nombrar con prefijo use
export function useCustomHook() {
  const [state, setState] = useState();
  return { state, setState };
}
```

### Services

```typescript
// Exportar objeto con métodos
export const myService = {
  getAll: async () => {...},
  getById: async (id) => {...},
};
```

## 🎨 Componentes de Ejemplo

### Button

```tsx
<Button variant="default" size="lg" isLoading={loading}>
  Guardar
</Button>
```

### Input

```tsx
<Input
  label="Nombre"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  error={errors.nombre}
  required
/>
```

### DataTable

```tsx
<DataTable
  columns={columns}
  data={data}
  searchPlaceholder="Buscar..."
  onRowClick={(row) => navigate(`/detail/${row.id}`)}
/>
```

### Badge

```tsx
<Badge estado={ModeloEstado.APROBADO} />
<Badge variant="success">Custom Badge</Badge>
```

## 🐛 Debugging

### React DevTools

Instalar extensión React DevTools para inspeccionar componentes y estado.

### Redux DevTools

Si usas Redux/Zustand, instalar Redux DevTools.

### Network Inspector

Revisar llamadas API en Network tab del navegador.

## 📦 Build & Deploy

```bash
# Build para producción
npm run build

# Preview del build
npm run preview

# Archivos generados en ./dist
```

## 🤝 Contribución

1. Seguir estructura de carpetas establecida
2. Usar TypeScript para todos los archivos
3. Crear componentes reutilizables cuando sea posible
4. Documentar props interfaces
5. Seguir convenciones de naming

## 📄 Documentación Adicional

Ver `FRONTEND_SPECIFICATION.md` para especificación técnica completa con:

- Arquitectura detallada
- Flujos de usuario completos
- Wireframes descriptivos
- Guía de componentes
- Patrones de diseño
- Best practices

## 🔗 Links Útiles

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/)
- [React Query](https://tanstack.com/query/latest)

---

**Versión**: 1.0  
**Última actualización**: Diciembre 2025
