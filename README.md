# Gases del Valle — Sitio web

Sitio web institucional para **Gases del Valle**, empresa dedicada a la carga y
suministro de gases industriales (oxígeno, nitrógeno, argón, CO₂, helio y mezclas
especiales), con foco en cervecerías y pequeñas y medianas producciones.

## Características

- **Diseño moderno y responsivo** con paleta industrial (azul profundo + cian gas).
- **Hero interactivo** con animación de partículas en canvas (moléculas de gas),
  cilindros flotantes y un manómetro animado.
- **Catálogo de gases** interactivo: cada tarjeta revela sus aplicaciones al pasar el cursor.
- **Secciones**: Nosotros, Gases, Servicios, Industrias, Proceso y Contacto.
- **Animaciones al hacer scroll** (reveal), contadores animados y barra de progreso.
- **Menú móvil** tipo hamburguesa y navegación con desplazamiento suave.
- **Formulario de contacto** con validación en el cliente.
- Accesible: respeta `prefers-reduced-motion` y usa etiquetas semánticas.

## Estructura

```
.
├── index.html          # Estructura y contenido
├── css/styles.css      # Estilos y diseño responsivo
├── js/main.js          # Interactividad (canvas, reveal, formulario, etc.)
├── assets/favicon.svg  # Ícono del sitio
└── README.md
```

## Uso local

No requiere build ni dependencias. Abrí `index.html` en el navegador, o servilo con
cualquier servidor estático:

```bash
python3 -m http.server 8000
# luego abrí http://localhost:8000
```

## Notas

- Los datos de contacto (teléfono, email, dirección) son de ejemplo — reemplazalos
  por los reales en `index.html`.
- El formulario simula el envío en el cliente. Para recibir mensajes reales,
  conectalo a un servicio (p. ej. Formspree, un endpoint propio o un backend).
- Las fuentes se cargan desde Google Fonts (Sora e Inter).
