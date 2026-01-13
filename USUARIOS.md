# 👥 CREDENCIALES DE USUARIOS - Sistema Autodata

## Usuarios Creados

### 1. Santiago Martínez (Administrador)
- **Username:** `santiago.martinez`
- **Password:** `Admin2024!`
- **Email:** santiago.martinez@autodata.com
- **Rol:** `admin` (acceso total al sistema)
- **Permisos:** 
  - Gestión de usuarios
  - Todas las funcionalidades
  - Configuración del sistema

---

### 2. Claudio Bustillo (Aprobador)
- **Username:** `claudio.bustillo`
- **Password:** `Aprobador2024!`
- **Email:** claudio.bustillo@autodata.com
- **Rol:** `aprobacion` (aprobación final)
- **Permisos:**
  - Aprobar modelos finales
  - Rechazar y devolver a revisión
  - Ver historial completo
  - Marcar como definitivo

---

### 3. Yanina Dotti (Revisor)
- **Username:** `yanina.dotti`
- **Password:** `Revisor2024!`
- **Email:** yanina.dotti@autodata.com
- **Rol:** `revision` (revisión y corrección)
- **Permisos:**
  - Revisar modelos con datos mínimos
  - Revisar equipamiento cargado
  - Devolver para corrección
  - Enviar a aprobación final

---

### 4. Noel Capurro (Entrada de Datos)
- **Username:** `noel.capurro`
- **Password:** `Entrada2024!`
- **Email:** noel.capurro@autodata.com
- **Rol:** `entrada_datos` (carga inicial)
- **Permisos:**
  - Importar modelos y marcas
  - Cargar datos mínimos
  - Cargar equipamiento (140+ campos)
  - Enviar a revisión

---

## Estructura de Roles

```
┌─────────────────────────────────────────────┐
│         ADMIN (santiago.martinez)           │
│         - Acceso total al sistema           │
└─────────────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼──────────┐     ┌─────────▼──────────┐
│   ENTRADA_DATOS  │     │     REVISION        │
│  (noel.capurro)  │────▶│   (yanina.dotti)    │
│                  │     │                     │
│ • Importar       │     │ • Revisar           │
│ • Cargar datos   │     │ • Corregir          │
│ • Equipamiento   │     │ • Validar           │
└──────────────────┘     └─────────┬───────────┘
                                   │
                         ┌─────────▼──────────┐
                         │    APROBACION      │
                         │ (claudio.bustillo) │
                         │                    │
                         │ • Aprobar final    │
                         │ • Publicar         │
                         └────────────────────┘
```

## Flujo de Estados por Rol

### Entrada de Datos (noel.capurro):
1. Importa modelos → `IMPORTADO`
2. Completa datos mínimos → `REQUISITOS_MINIMOS`
3. Carga equipamiento → `EN_REVISION`

### Revisión (yanina.dotti):
1. Recibe modelos `EN_REVISION`
2. Puede:
   - Devolver a corrección → `PARA_CORREGIR`
   - Enviar a aprobación → `PENDIENTE_APROBACION`

### Aprobación (claudio.bustillo):
1. Recibe modelos `PENDIENTE_APROBACION`
2. Puede:
   - Rechazar → `PARA_CORREGIR`
   - Aprobar → `DEFINITIVO`

### Admin (santiago.martinez):
- Acceso a todo
- Gestiona usuarios
- Ve auditoría completa

---

## Notas de Seguridad

⚠️ **IMPORTANTE:** Estas son contraseñas iniciales para desarrollo. 

**En producción:**
- Forzar cambio de contraseña en primer login
- Implementar política de contraseñas fuertes
- Habilitar autenticación de dos factores (2FA)
- Implementar bloqueo por intentos fallidos
- Registrar todos los accesos en auditoría

---

## Base de Datos

**Tabla:** `Usuario`

**Campos:**
- UsuarioID (PK, Identity)
- Username (Unique)
- Password (Bcrypt hash)
- Nombre
- Email (Unique)
- Rol (admin, aprobacion, revision, entrada_datos)
- Activo (Bit)
- FechaCreacion
- FechaUltimoAcceso

---

**Fecha de creación:** ${new Date().toLocaleDateString('es-UY')}
