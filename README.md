# Vestuario Jacinta · React

Tienda online de ropa desarrollada como parte de la **Evaluación Parcial 2 (30%)** de la asignatura **DSY1104 – Desarrollo Fullstack II** (DuocUC).

Basado en el caso **"Vestuarios Jacinta"**: una tienda chilena de ropa casual y urbana para toda la familia que busca renovar su sistema de ventas online. Esta versión es la migración a **React** de la plantilla HTML/CSS/JS entregada en la Evaluación Parcial 1.

---

## Integrantes del Equipo

* **Isidora Gómez**
* **Lukas Calvo**

---

## Links

- Página de Vestuario Jacinta (React): <a href="https://isigomez.github.io/vestuario-jacinta-react/">Clic aqui</a>
- Versión anterior en HTML (Evaluación Parcial 1): <a href="https://isigomez.github.io/vestuario-jacinta/">Clic aqui</a>

---

## Descripción

El proyecto corresponde al **frontend** de la tienda Jacinta de vestuario, desarrollado con **React** y **Bootstrap**. Autenticación, usuarios y categorías están conectados al backend Spring Boot. Productos, carrito, órdenes y reportes todavía usan datos locales en `localStorage`.
 
Incluye la **tienda pública** (home, catálogo, categorías, carrito, checkout, blog, registro e inicio de sesión) y un **panel de administración** completo (productos, categorías, usuarios, órdenes, reportes).

> **Estado actual:** autenticación JWT, usuarios, perfil y categorías integrados con la API. El flujo de compra y la gestión de productos y ventas siguen pendientes de integración con el backend.

## Tecnologías utilizadas

- **[React](https://react.dev/)** — componentes reutilizables con props y estado
- **[Vite](https://vite.dev/)** — servidor de desarrollo y build
- **[React Router 7](https://reactrouter.com/)** — navegación entre vistas y rutas protegidas por rol
- **[Bootstrap 5](https://getbootstrap.com/) + [React-Bootstrap](https://react-bootstrap.github.io/)** — grillas y componentes responsivos
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** — iconografía
- **Spring Boot + JWT** — autenticación y permisos; contraseñas hasheadas con BCrypt en el backend
- **[Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** — pruebas unitarias (entorno `jsdom`)
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter)** — linter
- **[Google Fonts](https://fonts.google.com/)** — tipografías [Poppins](https://fonts.google.com/specimen/Poppins) (texto general) y [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (encabezados)

## Cómo ejecutar el proyecto

Requisitos: **Node.js 20.19 o superior** y npm.

```bash
git clone https://github.com/isigomez/vestuario-jacinta-react.git
cd vestuario-jacinta-react
npm install
cp .env.example .env
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`. Iniciar también el backend y configurar `VITE_API_URL=http://localhost:8080/api` en `.env`. Reiniciar Vite si cambia esa URL.

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción en `dist/` |
| `npm run preview` | Sirve la build de producción |
| `npm run lint` | Revisa el código con Oxlint |
| `npm test` | Pruebas unitarias en modo watch |
| `npx vitest run --coverage` | Pruebas con reporte de cobertura |

### Credenciales de prueba

| Correo | Contraseña | Tipo |
| :--- | :--- | :--- |
| `admin@duoc.cl` | `admin1234` | Administrador |

El backend crea esta cuenta al iniciar si el correo no existe; no modifica cuentas existentes.

Inicia sesión en `/login` y entra al panel desde **Panel admin** en la barra de navegación (o en `/admin`).

## Estructura del proyecto
 
```
vestuario-jacinta-react/
├── index.html
├── vite.config.js / vitest.config.js
├── public/assets/          # Logo, íconos, imágenes de productos y blog, videos
└── src/
    ├── main.jsx / App.jsx
    ├── components/          # EncabezadoPagina, TarjetaProducto, Campo, InputRun, RegionComunaSelect, TarjetaResumen, MiniaturaImagen, Footer…
    ├── context/             # AuthProvider (sesión) y CarritoContext (carrito)
    ├── services/            # Cliente API, autenticación, usuarios y categorías
    ├── hooks/               # useAuth, useRecurso
    ├── layouts/             # TiendaLayout y AdminLayout
    ├── routes/              # Router, rutas de tienda y admin, RutaProtegida
    ├── pages/
    │   ├── admin/           # Dashboard, productos, categorías, usuarios, órdenes, reportes, perfil
    │   ├── tienda/          # Vistas públicas: inicio, productos, categorías, carrito, checkout, blog, contacto…
    │   └── pruebas/         # Páginas auxiliares de desarrollo
    ├── data/                # Datos locales: productos, categorías del catálogo local, órdenes, blogs, regiones/comunas
    ├── utils/               # validaciones, formato, reportes y storage
    ├── styles/              # base, layouts, components, pages
    └── test/                # setup y pruebas unitarias
```

## Funcionalidades implementadas
 
**Tienda pública**
- **Inicio** con banner, videos de novedades y los productos con menor stock
- **Productos** y **detalle de producto** (selección de color y talla), y **categorías** con su listado de productos
- **Carrito** persistente (por usuario o invitado) con control de cantidades respetando el stock disponible
- **Checkout** con datos de entrega y envío, y vistas de **compra exitosa** y **compra con error**
- **Blog** con detalle de artículos, **Nosotros** y **Contacto** (formulario con validación)
- **Registro** e **inicio de sesión** de clientes
- Todas las páginas comparten el componente reutilizable `EncabezadoPagina`, que muestra el título y subtítulo de cada vista en un banner

**Panel de administración (`/admin`, acceso según rol)**

El administrador gestiona usuarios y categorías; el vendedor consulta categorías y accede a las rutas de productos y ventas. Los permisos de productos y ventas siguen pendientes de integración por B.
- Dashboard con ventas totales, órdenes por estado, gráfico de los últimos 6 meses, productos críticos y más vendidos
- CRUD de **productos** con colores, imágenes, stock y stock crítico; listado de productos críticos
- CRUD de **categorías** (no permite eliminar una categoría con productos asociados)
- CRUD de **usuarios**, con historial de compras por cliente
- **Órdenes / boletas**: listado, filtro, cambio de estado y detalle de boleta
- **Reportes** generales y de productos
- Perfil propio para clientes, vendedores y administradores

**Transversal**
- Inicio de sesión mediante JWT, restauración y renovación de sesión, contraseñas hasheadas con BCrypt en el backend y rutas protegidas por rol
- Formularios con validación por campo: RUN chileno (dígito verificador), nombre, apellidos, correo, teléfono, contraseña, fecha de nacimiento, dirección y selección en cascada Región → Comuna
- Usuarios y categorías persistidos en H2; tokens en `localStorage` (`jacinta_access_token` y `jacinta_refresh_token`). Productos, órdenes, blogs, categorías del catálogo local y carrito mantienen sus claves locales.
- Diseño responsivo con Bootstrap (menú colapsable, tablas con scroll horizontal, grillas)

Se usa **Vitest** con **React Testing Library** (`describe`, `it`, `expect`). Son **34 archivos de prueba y 315 pruebas** que cubren utilidades, capa de datos, componentes y páginas del panel de administración. La configuración está en `vitest.config.js` y `src/test/setup.js`, que limpia `localStorage`, desmonta los componentes y restaura los mocks entre pruebas.
 
```bash
npx vitest run
npx vitest run --coverage
```
 
| Carpeta | Archivos | Pruebas | Qué verifica |
| :--- | :---: | :---: | :--- |
| `src/test/utils/` | 5 | 93 | Validaciones, formato, reportes, storage, roles y permisos |
| `src/test/data/` | 4 | 69 | CRUD local de productos, categorías, órdenes y regiones/comunas |
| `src/test/components/` | 4 | 23 | InputRun, MiniaturaImagen, RegionComunaSelect y TarjetaResumen |
| `src/test/pages/admin/` | 14 | 95 | Dashboard, CRUD asíncrono, órdenes, boletas, reportes y perfil |
| `src/test/services/` | 3 | 8 | Cliente API, renovación de tokens y servicio de usuarios |
| `src/test/hooks/` | 1 | 1 | Permisos expuestos por useAuth |
| `src/test/context/` | 1 | 3 | Restauración y cierre de sesión |
| `src/test/routes/` | 2 | 5 | Rutas protegidas y menú por rol |
 
## Paleta de diseño
 
| Uso | Muestra | Código |
| :--- | :---: | :--- |
| Fondo principal | <img src="https://img.shields.io/badge/-%20-f4efea?style=flat-square" alt="f4efea"> | `#f4efea` |
| Acento (botones) | <img src="https://img.shields.io/badge/-%20-d98a7d?style=flat-square" alt="d98a7d"> | `#d98a7d` |
| Acento secundario | <img src="https://img.shields.io/badge/-%20-8c9a7b?style=flat-square" alt="8c9a7b"> | `#8c9a7b` |
| Texto principal / color primario | <img src="https://img.shields.io/badge/-%20-2e2b5f?style=flat-square" alt="2e2b5f"> | `#2e2b5f` |
| Texto secundario | <img src="https://img.shields.io/badge/-%20-6b6880?style=flat-square" alt="6b6880"> | `#6b6880` |
| Éxito | <img src="https://img.shields.io/badge/-%20-6c8c4c?style=flat-square" alt="6c8c4c"> | `#6c8c4c` |
| Peligro | <img src="https://img.shields.io/badge/-%20-b34742?style=flat-square" alt="b34742"> | `#b34742` |
