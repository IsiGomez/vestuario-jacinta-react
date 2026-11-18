# MANUAL DE USUARIO

Vestuario Jacinta permite consultar prendas, preparar compras y administrar productos,
usuarios, categorías y órdenes. Para utilizarlo, abre la dirección de la tienda en un
navegador con conexión a internet.

## 1. Acceso y navegación

Desde el menú de la tienda puedes entrar a Inicio, Productos, Categorías, Nosotros,
Blog, Contacto y Carrito. Puedes consultar el catálogo y comprar sin iniciar sesión.

Las opciones del menú cambian según la cuenta:

| Función | Invitado | Cliente | Vendedor | Administrador |
| :--- | :---: | :---: | :---: | :---: |
| Consultar catálogo y preparar compras | Sí | Sí | Sí | Sí |
| Editar el perfil propio | No | Sí | Sí | Sí |
| Crear y editar productos | No | No | Sí | Sí |
| Eliminar productos sin ventas | No | No | No | Sí |
| Consultar categorías en el panel | No | No | Sí | Sí |
| Crear, editar y eliminar categorías | No | No | No | Sí |
| Consultar órdenes y cambiar sus estados | No | No | Sí | Sí |
| Consultar stock crítico y reportes de productos | No | No | Sí | Sí |
| Administrar usuarios y consultar su historial | No | No | No | Sí |
| Consultar Dashboard y reportes generales | No | No | No | Sí |

## 2. Crear cuenta

1. Selecciona **Crear cuenta**.
2. Completa RUN, nombre, apellidos, correo, teléfono, región, comuna y dirección.
3. Ingresa una contraseña de entre 8 y 24 caracteres y repítela en la confirmación.
4. La fecha de nacimiento es opcional.
5. Envía el formulario. Si hay datos inválidos, corrige los campos indicados.

La cuenta se crea como cliente. No se permite repetir el RUN o correo de otra cuenta.
Después del registro se intenta iniciar sesión automáticamente; si aparece la pantalla
de acceso, ingresa con el correo y la contraseña registrados.

## 3. Iniciar y cerrar sesión

1. Selecciona **Iniciar sesión**.
2. Escribe tu correo y contraseña.
3. Confirma el ingreso.

El cliente entra a la tienda; el administrador al Dashboard y el vendedor al listado
de productos. Administradores y vendedores también pueden abrir **Panel admin** desde
el menú de la tienda.

La sesión se conserva al recargar la página. Si vence y no puede renovarse, vuelve a
iniciar sesión. Para salir, selecciona **Cerrar sesión**.

Si se cargaron los datos de prueba originales y no se cambiaron sus contraseñas,
están disponibles estas cuentas:

| Correo | Contraseña | Acceso |
| :--- | :--- | :--- |
| admin@duoc.cl | 1234 | Administrador |
| vendedor@duoc.cl | 1234 | Vendedor |
| cliente@duoc.cl | 1234 | Cliente |

## 4. Editar el perfil

1. Abre **Mi perfil** desde la tienda o **Perfil** desde el panel.
2. Actualiza los datos personales y de dirección.
3. Para cambiar la contraseña, escribe una nueva de entre 8 y 24 caracteres.
4. Para conservar la contraseña actual, deja ese campo vacío.
5. Guarda los cambios.

El perfil permite modificar los datos propios, pero no cambiar el rol de la cuenta.

## 5. Consultar productos y categorías

1. Abre **Productos** para consultar el catálogo o **Categorías** para buscar por grupo.
2. Selecciona una prenda para ver su descripción, precio, imágenes, tallas y colores.
3. Elige talla, color y cantidad.
4. Selecciona la opción para agregarla al carrito.

La tienda muestra los productos activos. Los agotados no permiten agregar unidades.
El stock se comparte entre todas las tallas y colores de un mismo producto.

## 6. Usar el carrito

1. Abre **Carrito**.
2. Revisa los productos, tallas, colores, cantidades y precios.
3. Usa **+** y **−** para ajustar las unidades disponibles.
4. Usa **Eliminar** para quitar una línea completa.
5. Revisa el resumen y continúa al checkout.

El carrito se guarda en el navegador y se separa entre invitados y cuentas. Al cambiar
de cuenta puede mostrarse un carrito distinto. Agregar productos al carrito todavía
no reserva stock; la disponibilidad se comprueba al confirmar la compra.

## 7. Confirmar una compra

1. Con productos en el carrito, entra al checkout.
2. Completa o revisa el nombre completo y el correo. Con sesión iniciada se precargan
   los datos disponibles del perfil.
3. Selecciona **Despacho a domicilio** o **Retiro en tienda**.
4. Para despacho, completa dirección, región y comuna. Para retiro no se solicitan
   esos campos de domicilio.
5. Agrega indicaciones en **Notas** si las necesitas; son opcionales.
6. Revisa cantidades, subtotal, envío y total. El envío es gratis.
7. Pulsa **Confirmar compra** y espera la respuesta.

Si la orden se crea, aparece la confirmación con su identificador y se vacía el carrito.
Anota el identificador, especialmente si compraste como invitado: las órdenes de
invitados se consultan desde el panel del personal.

Si cambió el stock, una prenda fue desactivada o los datos no son válidos, el sistema
muestra un mensaje. Revisa el carrito o corrige los campos antes de volver a confirmar.

La confirmación registra una orden **Pendiente** y reserva sus unidades. No realiza un
cobro bancario ni solicita datos de tarjeta. El personal actualiza el estado desde el
panel. El total actual corresponde a la suma de los productos; no se muestra un
desglose adicional de IVA.

## 8. Administrar productos

Disponible para administradores y vendedores, excepto la eliminación.

1. Entra a **Productos** en el panel.
2. Usa **Nuevo producto** para crear una prenda o **Editar** para modificarla.
3. Completa nombre, categoría, género, tipo, precio, stock, stock crítico,
   descripción y colores.
4. Marca **Visible en la tienda** para publicarla o desmarca la opción para ocultarla.
5. Guarda los cambios.

El género y el tipo determinan las opciones de colores del formulario. Las tallas
se asignan automáticamente como S, M, L y XL. No se permite repetir la combinación
de género y tipo: edita el producto existente para cambiar sus datos o colores.

Solo el administrador puede **Eliminar** productos. Si ya aparecen en una orden,
no pueden eliminarse; se pueden desactivar para conservar el historial.

### Stock crítico y reporte de productos

- **Stock crítico** muestra productos activos cuyo stock es menor o igual al límite
  configurado. Desde el listado puedes entrar a editarlos.
- **Reportes de productos** muestra el número de productos activos, unidades,
  valor del inventario, cantidad de productos críticos y distribución por categoría.

## 9. Administrar categorías

1. Abre **Categorías** en el panel.
2. Como administrador, usa las acciones para crear, editar o eliminar una categoría.
3. Completa nombre y descripción y guarda.

Las categorías con productos asociados no pueden eliminarse. El vendedor puede
consultar el listado, pero no modificarlo.

## 10. Administrar usuarios

Disponible únicamente para el administrador.

1. Abre **Usuarios**.
2. Usa la opción de nuevo usuario para registrar una cuenta o **Editar** para modificarla.
3. Completa los datos y selecciona el rol: Cliente, Vendedor o Administrador.
4. Guarda los cambios. Al editar, deja la contraseña vacía si deseas conservarla.
5. Desde el listado puedes abrir el historial de compras del usuario.

La acción **Eliminar** desactiva la cuenta y conserva su historial. La cuenta
desactivada no puede iniciar sesión. El administrador no puede desactivar su propia
cuenta ni cambiar su propio rol.

El historial muestra órdenes, fechas, importes y estados, además del total gastado
en órdenes pagadas. Usa **Ver boleta** para consultar una orden.

## 11. Gestionar órdenes y boletas

Disponible para administradores y vendedores.

1. Abre **Órdenes** en el panel.
2. Consulta el número de orden, fecha, cliente, total y estado.
3. Usa el filtro para mostrar un estado específico.
4. Cambia el estado desde el selector de la orden.
5. Selecciona **Ver boleta** para abrir su detalle.

| Estado | Efecto |
| :--- | :--- |
| Pendiente | La orden está registrada y sus unidades están reservadas. |
| Pagada | La orden se considera pagada; mantiene las unidades reservadas. |
| Pago fallido | Las unidades reservadas se devuelven al stock. |

Pasar de Pendiente a Pagada no vuelve a descontar unidades. Al cambiar de Pago fallido
a Pendiente o Pagada se intenta reservarlas nuevamente; si ya no alcanza el stock,
el sistema rechaza el cambio y muestra el motivo.

La boleta muestra datos del cliente y entrega, productos, tallas, colores, cantidades,
precios y total. Conserva el nombre y el precio registrados al crear la compra.
Usa **Imprimir** para abrir las opciones del navegador y, si están disponibles,
imprimirla o guardarla como PDF.

## 12. Consultar el Dashboard y los reportes de ventas

Disponible únicamente para el administrador.

- **Dashboard:** ventas totales, resumen de órdenes, productos críticos, clientes,
  ventas de los últimos seis meses, productos más vendidos y órdenes recientes.
- **Reportes:** ventas totales, órdenes pagadas, ticket promedio, pagos fallidos y
  productos más vendidos.

Los importes de ventas y los productos más vendidos consideran las órdenes Pagadas.
Las órdenes Pendientes y con Pago fallido no se suman como ventas pagadas.

## 13. Información y contacto

**Nosotros** presenta información de la tienda. **Blog** permite abrir las publicaciones
para leer su contenido.

En **Contacto** se muestran teléfono y correo. También puedes completar nombre,
correo y mensaje en el formulario. Este formulario valida los datos y muestra una
confirmación en pantalla, pero actualmente no envía correos ni registra consultas
en el servidor. Para comunicarte, utiliza los enlaces de teléfono o correo publicados.

## 14. Problemas frecuentes

| Mensaje o situación | Qué hacer |
| :--- | :--- |
| Correo o contraseña incorrectos | Revisa ambos datos e intenta ingresar otra vez. |
| RUN o correo ya registrado | Usa los datos de tu cuenta existente o corrige el formulario. |
| Sesión vencida | Vuelve a iniciar sesión. |
| Acceso denegado | Entra con una cuenta que tenga permiso para esa sección. |
| Producto agotado o stock insuficiente | Reduce la cantidad o retira el producto del carrito. |
| No se puede eliminar una categoría o producto | Conserva el historial y revisa sus asociaciones; un producto puede desactivarse. |
| Failed to fetch o error de conexión | Comprueba tu conexión, recarga y vuelve a intentar. Si continúa, informa al administrador del sistema. |
| No se pudo realizar el pago | Regresa al carrito y comprueba si la orden se registró antes de repetir la compra. |
