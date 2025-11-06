# Documentación de Tests

## Ejecución

Para ejecutar los tests, utiliza los siguientes comandos:

```bash
# Ejecutar todos los tests una vez
npm run test

# Ejecutar tests en modo observador
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage

# Ejecutar tests con interfaz gráfica
npm run test:ui
```

## Servicios

### userService

Ubicación de tests:

- src/services/__tests__/userService.test.ts
- src/__tests__/userService.test.ts (duplicado funcional)

Casos:

- Registro de usuario existente: asegura que no se permite duplicar email.
- Login con credenciales válidas: se valida solo por email + contraseña correcta; se guarda currentUser (sin contraseña).

Mocking:

- localStorage (getItem, setItem, clear).
- crypto.randomUUID (cuando sea necesario en otros servicios).

### transactionService

Ubicación de tests:

- src/services/__tests__/transactionService.test.ts
- src/__tests__/transactionService.test.ts (duplicado funcional)

Casos:

- saveTransaction: genera ID (mocked) y persiste en localStorage.
- getAllTransactions: retorna [] si no hay datos y el arreglo si existen.

Mocking:

- localStorage.
- crypto.randomUUID (en tests de services/__tests__).

### ticketService

Ubicación:

- src/__tests__/ticketService.test.ts

Casos:

- initializeAvailability: genera mapa de disponibilidad para el próximo mes.
  - Verifica días cerrados (lunes).
  - Verifica días especiales: Navidad y Año Nuevo como cerrados.
- getAvailability: true/false según fecha guardada.
- getAvaibilityDays: retorna JSON completo almacenado.

Mocking:

- localStorage.
- Fecha fija en una prueba para resultados deterministas.

## Utilidades

### ticketCalculations

Archivo: src/__tests__/ticketCalculations.test.ts

Funciones probadas:

- calcularPrecioPorTicket:
  - Edades límite: <0 (0), 0–3 gratis, 4–15 descuento, 16–59 precio completo, 60+ descuento, >110 inválido (0).
  - Tipos de ticket: regular (5000 base), vip (10000 base) con reglas de descuento.
- calcularTotal:
  - Manejo de cantidades 0, negativas, >10 (retorna 0).
  - Ignora edades negativas.
  - Suma parcial si faltan edades.
  - Combina reglas de gratuidad y descuentos.

### dateUtils

Archivo: src/__tests__/dateUtils.test.ts

Funciones:

- fromISODate: convierte yyyy-MM-dd a Date válida.
- addDays: suma días manejando cambio de mes/año.
- createDateFromStr: parsea fecha yyyy-MM-dd a Date.

## Mocking General

- localStorage simulado en cada suite para aislamiento.
- crypto.randomUUID en tests de transacciones (cuando aplica).
- No se mockea fetch actualmente (initialize de userService no se testea en esta versión).

## Cobertura Actual

Enfoque en:

- Flujo básico de autenticación (registro y login).
- Persistencia de transacciones.
- Lógica de disponibilidad de tickets.
- Cálculo de precios y fechas.

## Tests Eliminados / No Presentes

- EmailService (referencia eliminada).
- Tests de componentes (TicketPurchasePage, AuthPage) no existen en la versión actual.
