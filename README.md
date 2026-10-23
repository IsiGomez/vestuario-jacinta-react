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

El proyecto corresponde al **frontend** de la tienda Jacinta de vestuario, desarrollado con **React** y **Bootstrap**. No tiene backend: una capa de datos en JavaScript simula la base de datos (con operaciones CRUD) y guarda la información en `localStorage`.

Incluye un **panel de administración** completo (productos, categorías, usuarios, órdenes, reportes) y la estructura de navegación de la tienda pública.

> **Estado actual:** el panel de administración está terminado. Las vistas públicas de la tienda (home, catálogo, carrito, checkout, etc.) tienen sus rutas creadas y están en desarrollo.

## Tecnologías utilizadas

- **[React](https://react.dev/)** — componentes reutilizables con props y estado
- **[Vite](https://vite.dev/)** — servidor de desarrollo y build
- **[React Router 7](https://reactrouter.com/)** — navegación entre vistas y rutas protegidas por rol
- **[Bootstrap 5](https://getbootstrap.com/) + [React-Bootstrap](https://react-bootstrap.github.io/)** — grillas y componentes responsivos
- **[Bootstrap Icons](https://icons.getbootstrap.com/)** — iconografía
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)** — contraseñas guardadas como hash
- **[Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)** — pruebas unitarias (entorno `jsdom`)
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter)** — linter
- **[Google Fonts](https://fonts.google.com/)** — tipografías [Poppins](https://fonts.google.com/specimen/Poppins) (texto general) y [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) (encabezados)

## Cómo ejecutar el proyecto

Requisitos: **Node.js 20.19 o superior** y npm.

```bash
git clone https://github.com/isigomez/vestuario-jacinta-react.git
cd vestuario-jacinta-react
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

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
| `admin@duoc.cl` | `1234` | Administrador |

Inicia sesión en `/login` y entra al panel desde **Panel admin** en la barra de navegación (o en `/admin`).

## Estructura del proyecto

```
vestuario-jacinta-react/
├── index.html
├── vite.config.js / vitest.config.js
├── public/assets/          # Logo, íconos, imágenes de productos y blog, videos
└── src/
    ├── main.jsx / App.jsx
    ├── components/          # Campo, InputRun, RegionComunaSelect, TarjetaResumen, MiniaturaImagen…
    ├── context/             # AuthProvider (sesión)
    ├── hooks/               # useAuth
    ├── layouts/             # TiendaLayout y AdminLayout
    ├── routes/              # Router, rutas de tienda y admin, RutaProtegida
    ├── pages/
    │   ├── admin/           # Dashboard, productos, categorías, usuarios, órdenes, reportes, perfil
    │   ├── tienda/          # Vistas públicas (en desarrollo)
    │   └── pruebas/         # Páginas auxiliares de desarrollo
    ├── data/                # Datos simulados con CRUD: productos, categorías, usuarios, órdenes, regiones/comunas
    ├── utils/               # validaciones, formato, reportes y storage
    ├── styles/              # base, layouts, components, pages
    └── test/                # setup y pruebas unitarias
```

## Funcionalidades implementadas

**Panel de administración (`/admin`, solo rol Administrador)**
- Dashboard con ventas totales, órdenes por estado, gráfico de los últimos 6 meses, productos críticos y más vendidos
- CRUD de **productos** con colores, imágenes, stock y stock crítico; listado de productos críticos
- CRUD de **categorías** (no permite eliminar una categoría con productos asociados)
- CRUD de **usuarios**, con historial de compras por cliente
- **Órdenes / boletas**: listado, filtro, cambio de estado y detalle de boleta
- **Reportes** generales y de productos
- Perfil del administrador

**Transversal**
- Inicio de sesión con contraseñas hasheadas (bcrypt) y rutas protegidas por rol
- Formularios con validación por campo: RUN chileno (dígito verificador), nombre, apellidos, correo, contraseña, fecha de nacimiento, dirección y selección en cascada Región → Comuna
- Datos persistentes en `localStorage` (claves `jacinta_productos`, `jacinta_categorias`, `jacinta_usuarios`, `jacinta_ordenes` y `jacinta_sesion`)
- Diseño responsivo con Bootstrap (menú colapsable, tablas con scroll horizontal, grillas)

**En desarrollo**
- Vistas de la tienda: home, productos y detalle, categorías, ofertas, nosotros, blog y contacto
- Carrito, checkout y vistas de compra exitosa / con error
- Registro de usuarios

## Pruebas unitarias

Se usa **Vitest** con **React Testing Library** (`describe`, `it`, `expect`). La configuración está en `vitest.config.js` y `src/test/setup.js`, que limpia `localStorage`, desmonta los componentes y restaura los mocks entre pruebas.

```bash
npx vitest run
npx vitest run --coverage
```

| Archivo | Pruebas | Qué verifica |
| :--- | :---: | :--- |
| `src/test/utils/formato.test.js` | 10 | Formato de precios (CLP), RUN y fechas |
| `src/test/utils/storage.test.js` | 13 | Lectura, escritura, JSON corrupto, errores de almacenamiento e ids |

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
