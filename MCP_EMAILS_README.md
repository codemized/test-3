# Sistema de Emails con MCP (Model Context Protocol)

## 📧 Integración del MCP de Emails

Este proyecto utiliza el **Model Context Protocol (MCP)** para gestionar emails de forma dinámica y en tiempo real.

## 🔧 Configuración

### Estructura de la API

La aplicación incluye un endpoint API que se conecta con el MCP de emails:

```
/app/api/emails/route.ts
```

Este endpoint proporciona:
- `GET` - Obtiene todos los emails del MCP
- `PATCH` - Marca emails como leídos

### Formato de Datos

Los emails siguen esta estructura:

```typescript
interface Email {
  id: number;
  from: string;
  to?: string;
  subject: string;
  body: string;
  date: string; // ISO 8601 format
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
  attachments?: string[];
}
```

## 🚀 Características

### Funcionalidades Implementadas

1. **Carga Dinámica de Emails**
   - Los emails se cargan automáticamente al iniciar la aplicación
   - Botón de actualización manual para refrescar la lista

2. **Estados de Lectura**
   - Marca automáticamente los emails como leídos al seleccionarlos
   - Sincronización con el servidor mediante PATCH request

3. **Prioridades**
   - `normal` - Emails regulares
   - `high` - Emails importantes
   - `urgent` - Emails críticos que requieren atención inmediata

4. **Archivos Adjuntos**
   - Visualización de archivos adjuntos en el detalle del email
   - Lista de nombres de archivos

5. **Formato de Fechas**
   - Conversión automática de ISO 8601 a formato legible
   - Formato: `YYYY.MM.DD`

## 🔌 Conexión con MCP Externo

### Opción 1: MCP Local

Si tienes un servidor MCP de emails corriendo localmente, modifica la función `fetchEmailsFromMCP` en `/app/api/emails/route.ts`:

```typescript
async function fetchEmailsFromMCP() {
  const response = await fetch('http://localhost:3001/mcp/emails');
  const data = await response.json();
  return data.emails;
}
```

### Opción 2: Servicio MCP Externo

Para conectar con un servicio MCP externo:

```typescript
async function fetchEmailsFromMCP() {
  const response = await fetch('https://your-mcp-service.com/api/emails', {
    headers: {
      'Authorization': `Bearer ${process.env.MCP_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await response.json();
  return data.emails;
}
```

### Opción 3: SDK de MCP

Si usas el SDK oficial de MCP:

```typescript
import { MCPClient } from '@modelcontextprotocol/sdk';

const mcpClient = new MCPClient({
  apiKey: process.env.MCP_API_KEY,
  endpoint: process.env.MCP_ENDPOINT
});

async function fetchEmailsFromMCP() {
  const emails = await mcpClient.emails.list();
  return emails;
}
```

## 🔐 Variables de Entorno

Crea un archivo `.env.local` con las siguientes variables:

```env
MCP_API_KEY=tu-api-key-aqui
MCP_ENDPOINT=https://tu-mcp-endpoint.com
MCP_TIMEOUT=5000
```

## 📝 Endpoints API

### GET /api/emails

Obtiene todos los emails del MCP.

**Response:**
```json
{
  "success": true,
  "emails": [...],
  "timestamp": "2024-03-15T10:30:00.000Z"
}
```

### PATCH /api/emails

Marca un email como leído.

**Request Body:**
```json
{
  "emailId": 1
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email marked as read"
}
```

## 🎨 Interfaz de Usuario

La aplicación incluye:

- **Lista de Emails**: Vista lateral con todos los emails
  - Indicadores de prioridad (colores)
  - Punto de no leído animado
  - Preview del contenido
  - Fecha formateada

- **Vista Detallada**: Panel principal con email seleccionado
  - Header completo (From, To, Fecha, Prioridad)
  - Cuerpo del mensaje
  - Archivos adjuntos
  - Botones de acción (Responder, Reenviar, Eliminar)

- **Indicadores de Estado**:
  - Contador de no leídos
  - Botón de actualizar
  - Estado de carga
  - Mensajes de error

## 🔄 Flujo de Datos

1. **Inicio**: `useEffect` carga emails al montar el componente
2. **Fetch**: Llamada a `/api/emails` (GET)
3. **Display**: Renderiza lista de emails
4. **Click**: Usuario selecciona un email
5. **Update**: Si no está leído, marca como leído
6. **Sync**: PATCH a `/api/emails` para sincronizar estado

## 🐛 Manejo de Errores

La aplicación maneja los siguientes errores:

- Error de conexión con el servidor
- Timeout del MCP
- Errores de autenticación
- Errores al marcar como leído

Todos los errores se muestran en la interfaz con un mensaje claro.

## 🚀 Próximas Mejoras

- [ ] Envío de emails
- [ ] Búsqueda y filtrado
- [ ] Carpetas/Etiquetas
- [ ] Paginación
- [ ] WebSocket para actualizaciones en tiempo real
- [ ] Soporte para respuestas y reenvíos
- [ ] Descarga de adjuntos
- [ ] Modo offline con cache

## 📚 Recursos

- [Model Context Protocol Documentation](https://modelcontextprotocol.io)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [React Hooks](https://react.dev/reference/react)

## 💡 Notas de Desarrollo

La aplicación actualmente usa datos simulados en el endpoint API. Para conectar con un MCP real:

1. Instala el SDK o cliente necesario
2. Configura las credenciales en `.env.local`
3. Modifica `fetchEmailsFromMCP()` con la implementación real
4. Prueba la conexión con el MCP
5. Ajusta el formato de datos si es necesario

---

**Versión**: 1.0.0  
**Última actualización**: 2024-03-15
