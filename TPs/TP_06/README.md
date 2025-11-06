# EcoHarmony Park

Sistema de gestión y venta de entradas para EcoHarmony Park, un bioparque donde la tecnología se une con la naturaleza.

## 📱 Características

- Compra de entradas online con diferentes métodos de pago
- Registro y autenticación de usuarios
- Visualización de disponibilidad por fecha
- Envío de correos electrónicos de confirmación
- Interfaz responsiva para dispositivos móviles y de escritorio

## 💻 Tecnologías utilizadas
<p align="center">
  <a href="https://react.dev/" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" width="50" height="50"/>
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" width="50" height="50"/>
  </a>
  <a href="https://mantine.dev/" target="_blank">
    <img src="https://mantine.dev/_next/static/media/mantine-logo.075997af.svg" alt="Mantine" width="50" height="50"/>
  </a>
  <a href="https://vitejs.dev/" target="_blank">
    <img src="https://vitejs.dev/logo.svg" alt="Vite" width="50" height="50"/>
  </a>
  <a href="https://vitest.dev/" target="_blank">
    <img src="https://vitest.dev/logo.svg" alt="Vitest" width="50" height="50"/>
  </a>
  <a href="https://www.emailjs.com/" target="_blank">
    <img src="https://www.emailjs.com/logo.png" alt="EmailJS" width="50" height="50"/>
  </a>
</p>

## 🛠️ Instalación y ejecución

```bash
# Clonar el repositorio
git clone https://github.com/julianbasilieri/TDD-ICS

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Ejecutar tests
npm run test
```

## 📊 Testing

El proyecto cuenta con tests unitarios y de integración utilizando Vitest:

```bash
# Ejecutar todos los tests
npm run test

# Tests en modo watch
npm run test:watch

# Tests con reporte de cobertura
npm run test:coverage

# Tests con interfaz visual
npm run test:ui
```

## 🧑‍💻 Variables de entorno

Para el funcionamiento del envío de correos, se requieren las siguientes variables:
```env
VITE_EMAILJS_SERVICE_ID="your_service_id"
VITE_EMAILJS_TEMPLATE_ID_BOLETERIA="your_boleteria_template_id"
VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO="your_mercadopago_template_id"
VITE_EMAILJS_PUBLIC_KEY="your_public_key"
```

## 📧 Configuración de EmailJS

1. Crear una cuenta en [EmailJS](https://www.emailjs.com/)
2. Crear un servicio de email
3. Crear dos templates: uno para reservas en boletería y otro para pagos con Mercado Pago
4. Copiar los IDs correspondientes al archivo .env

## 🏗️ Estructura del Proyecto

```
src/
├── components/       # Componentes reutilizables
├── pages/           # Páginas de la aplicación
├── services/        # Servicios (tickets, transacciones, emails)
├── assets/          # Recursos estáticos
└── main.tsx         # Punto de entrada
```

## 🔑 Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| VITE_EMAILJS_SERVICE_ID | ID del servicio de EmailJS |
| VITE_EMAILJS_TEMPLATE_ID_BOLETERIA | ID del template para reservas en boletería |
| VITE_EMAILJS_TEMPLATE_ID_MERCADOPAGO | ID del template para pagos con Mercado Pago |
| VITE_EMAILJS_PUBLIC_KEY | Clave pública de EmailJS |
