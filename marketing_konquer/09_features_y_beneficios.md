# 09 — Features y beneficios

> Inventario completo del producto traducido a beneficios en lenguaje de obra. Organizado por módulo. Cada feature lleva el qué (técnico breve) + el beneficio (cómo se vende). Es la fuente de verdad para fichas de producto, comparativas, ads y descripciones.

> **Regla de oro:** en marketing nunca se nombra la feature técnica sola. Siempre acompañada del beneficio.

---

## 1. Presupuestos

### Crear presupuesto hablándole a la IA (web y móvil)

**Qué hace:** chat con texto, voz o foto. Le describes la obra y la IA arma el presupuesto.

**Beneficio:** "Le hablas a la app como se lo cuentas al cliente — 'pintar tres habitaciones, una con gotelé' — y te monta el presupuesto. Cero plantillas de Excel, cero 'no sé por dónde empezar'."

---

### Presupuesto desde el móvil, en la propia obra

**Qué hace:** flujo completo en móvil con scanner ML Kit.

**Beneficio:** "Saca el presupuesto mientras estás midiendo. Cierra ventas en caliente, antes de salir del piso."

---

### Catálogo de "Trabajos Frecuentes" reutilizables

**Qué hace:** CRUD de trabajos guardados con descripción larga, precio y unidad.

**Beneficio:** "Guarda los trabajos que repites cada semana — 'pintar techo con plástica blanca, 8€/m²' — y los insertas con un clic. Evita reescribir lo mismo 50 veces al mes."

---

### Plantillas precargadas por oficio

**Qué hace:** 20 tarifas tipo por oficio (pintura, albañilería, fontanería, electricidad) cargadas el primer día.

**Beneficio:** "Empieza a usar la app el día 1 sin tener que configurar nada. Solo eliges tu oficio."

---

### PDF profesional automático con tu logo

**Qué hace:** generador de PDF con plantilla por oficio + datos fiscales + logo + pie configurable.

**Beneficio:** "Da imagen de empresa seria sin pagar diseñador. PDF profesional en segundos, con tu logo, tu IBAN, tus condiciones."

---

### Envío del presupuesto al cliente por email desde la app

**Qué hace:** integración email con adjunto PDF automático.

**Beneficio:** "Un botón y listo. No pasas por Gmail, no te equivocas de adjunto, queda registrado en la app."

---

### Edición posterior y regeneración del PDF

**Qué hace:** edición de partidas con regeneración automática del PDF.

**Beneficio:** "Si el cliente pide cambios, editas partidas y el PDF se actualiza solo. No tienes que rehacer nada a mano."

---

### Estados: Borrador / Enviado / Aceptado / Rechazado

**Qué hace:** workflow de estados con histórico.

**Beneficio:** "De un vistazo sabes qué tienes pendiente de respuesta y qué has cerrado. Cero presupuestos olvidados."

---

### Conversión presupuesto → factura con un clic

**Qué hace:** clonación automática con herencia de partidas, IVA, datos.

**Beneficio:** "Cuando el cliente acepta, la factura se crea heredando partidas, IVA y datos. Cero doble tecleo."

---

### Visor PDF integrado

**Qué hace:** iframe a Google Drive con toolbar propia.

**Beneficio:** "No descargas, no abres otra app. Lo ves dentro de KonquerAI."

---

### IVA automático según el caso

**Qué hace:** lógica fiscal en `src/utils/fiscal.ts` con tipos 21% / 10% (reformas vivienda) / 0% (inversión sujeto pasivo).

**Beneficio:** "No tienes que pensar qué tipo aplicar. La app sabe cuándo es 21%, cuándo es 10% (reformas en vivienda particular) y cuándo es 0% (subcontratación). Cumples con la AEAT sin saber la normativa."

---

## 2. Facturación emitida (lo que cobras)

### Crear factura manual o desde presupuesto aceptado

**Beneficio:** "Si vino de un presupuesto, todo viene relleno. Si es factura suelta, formulario simple. En 1 minuto está hecha."

---

### Numeración correlativa automática

**Beneficio:** "Cumple obligación fiscal sin pensarlo. Se acabaron las facturas con número repetido y los problemas con Hacienda."

---

### Cálculo automático de IVA + IRPF (15% / 7% nuevos autónomos)

**Beneficio:** "El total final cuadra siempre con Hacienda. Cero errores de cálculo. Aplica 7% automáticamente si eres autónomo de menos de 3 años."

---

### Bloqueo de IVA mixto

**Qué hace:** `validarIVAHomogeneo` impide emitir facturas con tipos mezclados.

**Beneficio:** "Evita el error fiscal más típico del autónomo: mezclar tipos de IVA en la misma factura. La app no te deja."

---

### Estados completos: Borrador → Emitida → Enviada → Cobrada (+ Anulada / Rectificada)

**Beneficio:** "Sabes en todo momento qué te deben, qué te han pagado y qué está pendiente."

---

### Marcar como cobrada con fecha

**Beneficio:** "Foto real de la tesorería. Lo que has cobrado hoy, esta semana, este mes."

---

### Rectificativas y anulaciones

**Beneficio:** "Cuando el cliente pide modificación o se anula la factura, queda trazado correctamente para Hacienda."

---

### Envío al cliente por email desde la app

**Beneficio:** "Adjunta el PDF automáticamente y queda registrado. Cero olvidos."

---

### Series personalizadas (prefijos por año, tipo, etc.)

**Beneficio:** "Adaptable a cómo numeras tú toda la vida. Si usas A-2026/001 o REF-001, lo respetamos."

---

## 3. Facturación recibida (lo que pagas)

### Recepción automática de facturas por email

**Qué hace:** forwarding al token personal de KonquerAI; el sistema procesa automáticamente.

**Beneficio:** "Tus proveedores te mandan la factura al correo de siempre, y aparece sola en la app, ya extraída. Adiós a la carpeta 'Facturas pendientes' con 200 PDFs."

---

### Escaneo con la cámara del móvil

**Qué hace:** scanner ML Kit + OCR.

**Beneficio:** "Foto al ticket en papel y la IA extrae proveedor, importe, IVA y fecha. Sin teclear nada."

---

### OCR automático con IA (proveedor, importe, fecha, nº factura, IVA)

**Beneficio:** "Funciona con fotos hechas en el bar, en obra, con manchas, arrugadas. La IA limpia el ruido y saca los datos."

---

### Categorización automática

**Qué hace:** clasificación en Material, Herramientas, Subcontrata, Servicios, Alquiler.

**Beneficio:** "Tu asesor recibe los gastos ya clasificados. Le mandas el ZIP del trimestre y no te pide nada."

---

### Bandeja "Por revisar" vs "Revisadas"

**Beneficio:** "Solo tienes que aprobar lo que la IA detectó. 3 segundos por documento. Cero pereza."

---

### Asignación de cada gasto a una obra concreta

**Qué hace:** dropdown obra en factura recibida.

**Beneficio:** "Sabes exactamente cuánto te costó la reforma de Pepe, no un total mensual borroso."

---

### Distinción factura vs albarán

**Beneficio:** "Los albaranes no se confunden con facturas. Clave para no pagar dos veces el mismo material."

---

### Marcar como pagada

**Beneficio:** "Tesorería real: lo que debes ahora mismo, lo que ya está pagado."

---

## 4. Albaranes y conciliación (almacén ↔ facturación)

### Emparejado automático albarán ↔ factura

**Qué hace:** algoritmo de matching por proveedor + importe + fecha.

**Beneficio:** "El sistema propone cuándo un albarán de Leroy Merlin se corresponde con tu factura mensual. **Detecta cobros duplicados antes de pagarlos.**"

---

### Alerta de albaranes huérfanos (sin factura en +45 días)

**Beneficio:** "Te avisa de mercancía recibida que el proveedor 'se olvidó' de facturar (o que ya facturó y tú no encuentras). Recuperas dinero que ya estabas dando por perdido."

---

### Pestañas Sin factura / Sin albarán / Emparejados / Cerrado

**Beneficio:** "Flujo claro tipo 'bandeja de entrada de almacén'. Sabes en cada momento qué te falta."

---

### Filtro por proveedor + contador mensual

**Beneficio:** "Este mes con Saltoki tienes X cerrados. Con Leroy Y. Visibilidad por proveedor."

---

### Deshacer emparejados

**Beneficio:** "Reversible si te equivocaste. Cero miedo a tocar."

---

## 5. Clientes y proveedores

### Ficha de cliente con histórico (facturas, presupuestos, LTV, pendiente cobro)

**Beneficio:** "Antes de llamar a Pepe, sabes que te debe 3.400€ y cuántas obras le has hecho. Cero llamadas a ciegas."

---

### Ficha de proveedor con histórico de documentos

**Beneficio:** "'¿Cuánto le he comprado a Saltoki este año?' — al instante."

---

### Top 5 clientes / Top 5 proveedores (ranking anual)

**Beneficio:** "Sabes quién es el cliente que te hace ganar dinero y quién el que te quita tiempo. Decisiones comerciales basadas en datos, no en sensaciones."

---

### Detección de clientes/proveedores sin asignar (badges en sidebar)

**Beneficio:** "Documentos huérfanos saltan a la vista para limpiarlos. Cero descuidos."

---

### Fusionar duplicados de cliente/proveedor

**Beneficio:** "'Construcciones García SL' y 'Garcia Construcciones' se unifican en una sola ficha. Histórico consolidado, sin liarte."

---

### Crear cliente/proveedor desde el móvil en 5 segundos

**Beneficio:** "En la obra, mientras hablas con el dueño. Sin volver a casa para meterlo."

---

## 6. Rentabilidad por obra (la joya de la corona)

> **Importante:** este módulo es nuestro diferenciador #1. **Ni Holded, ni Quipu, ni Anfix, ni Billin lo tienen así.** Hay que destacarlo en todo el marketing.

### Margen real por obra: presupuestado − gastos imputados

**Beneficio:** "'¿Esa obra de Pepe la gané o la perdí?' — respuesta con número exacto. El 90% de los autónomos NO lo sabe. Tú sí."

---

### Ranking de obras por margen % con semáforo verde/ámbar/rojo

**Beneficio:** "Identifica las obras que te matan los márgenes. De un vistazo sabes qué clientes y qué tipos de trabajo dejarte y cuáles buscar más."

---

### Activas vs Terminadas

**Beneficio:** "Las activas estiman cierre. Las terminadas son cierre real. Comparas previsión vs realidad."

---

### Imputación de gastos a obra (desde factura recibida → dropdown obra)

**Beneficio:** "Asigna costes a la obra correcta para que el margen sea real. La app lo hace casi solo: ya te propone la obra más probable."

---

### CTA "Documentos sin imputar"

**Beneficio:** "Te empuja a no dejar gastos sueltos sin asignar — que son los que falsean el margen real."

---

### Mejor obra del mes (KPI)

**Beneficio:** "Motivación visible: esta es la que mejor te ha funcionado este mes. Busca más como esa."

---

## 7. Dashboard / Informes accionables

### 4 KPIs grandes en la home

**Qué muestra:** Pendiente de cobro, Cobrado mes, Pipeline activo, IVA del trimestre.

**Beneficio:** "En 3 segundos sabes el estado del negocio. Sin Excel, sin gestoría, sin abrir 5 pantallas."

---

### Tendencia 6 meses ingresos vs gastos

**Beneficio:** "Gráfico simple: ¿voy mejor o peor que el trimestre pasado? Sin tener que sacar la calculadora."

---

### Conversión 90 días (% presupuestos que cierran)

**Beneficio:** "De cada 10 presupuestos que mandas, cuántos ganas. Mide la eficacia comercial. Sabes cuánto presupuestar para llegar a tu objetivo."

---

### Días medios de cobro

**Beneficio:** "'Estoy cobrando a 45 días, me ahoga la caja' — dato accionable. Sabes cuándo subir presión o pedir adelantos."

---

### IVA del trimestre listo para la gestoría

**Beneficio:** "Hoy sabes cuánto vas a pagar el día 20 del próximo trimestre. Sin sorpresas."

---

### Bandeja "Tareas para hoy" (vencidas, por revisar)

**Beneficio:** "Te ahorra abrir 5 pantallas. La app te dice qué hacer hoy: 3 facturas por revisar, 2 cobros que reclamar."

---

### Exportar trimestre fiscal a CSV/ZIP

**Beneficio:** "Lo mandas a la asesoría con un clic, todo cuadrado. Tu gestoría te llama menos."

---

### Onboarding checklist (4 pasos)

**Beneficio:** "El primer día sabes exactamente qué hacer para arrancar. Cero página en blanco."

---

### Saludo personalizado

**Beneficio:** "Detalle de cercanía. La app te habla a ti, no a un usuario genérico."

---

## 8. Mi Empresa (configuración)

### Datos fiscales y de empresa (NIF, dirección, teléfono, web, logo)

**Beneficio:** "Una vez configurado, todos los PDFs lo llevan. Cero retocar cada factura."

---

### Pie de página personalizado (IBAN, condiciones, plazos, garantía)

**Beneficio:** "Profesionalidad sin diseñador gráfico. Tu IBAN en cada factura, tus condiciones en cada presupuesto."

---

### Catálogo de servicios con precio/unidad

**Beneficio:** "Tu tarifario, accesible desde cualquier presupuesto. Sin reinventarlo cada vez."

---

### Trabajos frecuentes (CRUD)

**Beneficio:** "Guarda descripciones largas tipo 'picar revestimiento existente, sanear, dar imprimación y dos manos de pintura plástica blanca mate'. Y las metes con un clic."

---

### Plantilla PDF por oficio

**Beneficio:** "El presupuesto se ve 'de pintor' si eres pintor, 'de electricista' si eres electricista. Estética del oficio."

---

### IVA por defecto configurable

**Beneficio:** "Si trabajas mayormente con reformas a particulares, 10% por defecto. Tú decides."

---

## 9. Captura y cámara (móvil)

### Scanner con detección automática de bordes (ML Kit)

**Beneficio:** "Saca foto al ticket arrugado en la furgoneta y queda como escaneada. Sin recortar manualmente."

---

### Audio para chat de presupuestos

**Beneficio:** "Habla, no escribe. Diferenciador real en obra con guantes."

---

### Conversión HEIC → JPEG automática

**Beneficio:** "El iPhone funciona sin que sepas qué es HEIC. Cero conversiones manuales."

---

### Caché offline (Drift, stale-while-revalidate)

**Beneficio:** "En la obra sin cobertura sigues viendo presupuestos y facturas."

---

### Bottom sheet de acciones rápidas (FAB)

**Beneficio:** "Crear factura/presupuesto en 1 toque. El botón gordo abajo a la derecha."

---

### Swipe en listados

**Beneficio:** "Marcar como pagada / aceptar deslizando. Gestos nativos del móvil. Cero formularios."

---

## 10. Notificaciones y sincronización

### Notificaciones in-app (factura recibida, presupuesto aceptado, etc.)

**Beneficio:** "No tienes que estar mirando si llegó algo. La app te avisa."

---

### Realtime entre web y móvil

**Beneficio:** "Lo que tocas en el móvil aparece al instante en el portátil de la oficina. Y al revés."

---

### Bandeja de notificaciones agrupada por fecha

**Beneficio:** "Histórico fácil de revisar. Lo de esta semana, lo del mes pasado."

---

### Badges contadores en navegación

**Beneficio:** "Saltan los pendientes — Por revisar, Sin proveedor, Conciliación — sin tener que abrir las pantallas."

---

## 11. Cuenta, auth y admin

### Login email/contraseña + Reset password

**Beneficio:** "Estándar, sencillo. Olvidaste la contraseña, la recuperas en 30 segundos."

---

### Signup con wizard de onboarding

**Beneficio:** "El alta no es solo crear cuenta, es estar listo para facturar."

---

### Sesión persistente segura

**Beneficio:** "No te tienes que loguear cada día. Tu sesión se mantiene segura."

---

### Invitación de usuarios (admin)

**Beneficio:** "Si más adelante metes a un ayudante o a la asesora, los invitas con un email."

---

### Panel admin de usuarios y observabilidad

**Beneficio:** "Para nuestro soporte interno. Si necesitas ayuda, vemos lo que ves tú y resolvemos rápido."

---

### Borrado de cuenta (GDPR + Apple)

**Beneficio:** "Tus datos son tuyos. Si pides borrarlos, los borramos. Cumple normativa europea."

---

## 12. Características transversales (UX)

- **Idioma 100% español de obra**: "Por cobrar", "Por pagar", "Mi empresa". Cero anglicismos.
- **Mobile-first real**: dpads 48dp, pensado para uso con guantes y mala luz.
- **Sin emojis ni jerga**: estética seria y profesional.
- **Cero fricción**: cada pantalla obvia sin manual.
- **Datos financieros exactos**: redondeo bancario, decimales precisos, cumple normativa fiscal.
- **PWA web**: instalable como app en escritorio, funciona sin tienda.
- **Apps nativas iOS y Android (Flutter)**, listas para App Store y Play Store.

---

## 13. Roadmap comercial — features futuras

> Mencionar en venta para reforzar "esto está vivo". Sin fechas concretas.

### Planificadas y documentadas en el código

| Feature | Beneficio comercial |
|---------|---------------------|
| Self-accept link (cliente firma/acepta presupuesto pulsando un enlace tipo DocuSign light) | "Cierra ventas más rápido. El cliente acepta desde su móvil sin imprimir/firmar/escanear." |
| Push notifications nativas (FCM) | "Te suena el móvil cuando llega factura o cliente acepta. Negocio vivo en el bolsillo." |
| Recordatorios automáticos por tiempo (facturas vencidas, presupuestos sin respuesta, recordatorios fiscales 303/130/390/190) | "Hacienda nunca te pilla. Es uno de los miedos n.º 1 del autónomo." |
| Resumen mensual automático en notificación | "'Este mes facturaste 12.400€, gastaste 4.200€, balance 8.200€' — sin abrir la app." |
| Deep links nativos (konquerai://factura/123) | "Tocar una notificación te lleva exactamente al sitio." |
| Filtros y swipe en notificaciones | "Cuando tengas 100+ notificaciones acumuladas." |
| Vistas y RPCs en BD para KPIs unificados | "KPIs siempre coherentes entre web y móvil, sin desfases." |
| TicketBAI / Verifactu | "Obligatorio en España a partir de 2026/2027. Listo cuando entre en vigor." |

### Ideas comerciales nuevas (roadmap)

| Feature | Beneficio comercial |
|---------|---------------------|
| Subida y escaneo de nóminas | "Imputa el coste real del personal a cada obra. Cierra el círculo de rentabilidad real." |
| Cotizaciones a la Seguridad Social (cuota mensual RETA, mutua) | "Gasto fijo que tampoco entra hoy. Te da el coste real del negocio." |
| **Conciliación bancaria automática (Open Banking PSD2 — TrueLayer/GoCardless)** | "Marca facturas cobradas/pagadas automáticamente cuando entra/sale el dinero del banco. **Es la killer feature contra Holded y Quipu.**" |
| Firma digital de presupuestos tipo DocuSign | "Firma legalmente vinculante con timestamp, IP, geolocalización. Diferenciador en obras grandes y clientes corporativos." |
| Calendario de obras y disponibilidad | "Plan semanal: 'lunes Pepe, martes y miércoles obra Casa Sánchez'." |
| Partes de trabajo diarios (horas por operario por obra) | "Imputa horas reales a cada obra → margen real con mano de obra incluida." |
| Control de stock básico de almacén | "Material en furgoneta/almacén. Suma con factura recibida, resta cuando se imputa." |
| Modelos fiscales pre-rellenados (303, 130, 390, 190) | "Generación con datos del trimestre lista para presentar. Reduce coste de gestoría." |
| Recordatorios SMS/WhatsApp al cliente cuando factura vence | "Cobrar antes sin perseguir. Aumenta cashflow." |
| Plantillas de email personalizadas por tipo | "Mensaje profesional sin tener que escribirlo cada vez." |
| Marketplace de plantillas PDF | "Más diseños premium de presupuesto/factura. Upsell para gama alta." |
| Multi-usuario con roles (operario, administrativo, jefe de obra) | "Cuando el autónomo crece a microempresa, no tiene que cambiar de app." |
| Integración con asesoría/gestoría (export directo + acceso lectura) | "La gestoría deja de pedirte papeles. Acelera adopción si la gestoría lo recomienda." |
| App "Cliente final" (cliente ve sus presupuestos/facturas con PIN) | "Profesionaliza brutalmente tu imagen. Pocos competidores lo tienen." |
| Generación de informes para banco (cuenta de resultados, balance simple) | "Cuando pidas un préstamo o leasing, KonquerAI te da el dossier." |
| Marketing/CRM ligero (clientes inactivos +6m, recordatorios "ofrécele mantenimiento") | "Reactivación comercial. Más ingresos del mismo cliente." |
| Catálogo de proveedores con tarifas | "Comparar precios de Saltoki vs Leroy vs Bricomart por producto." |
| Modo "Sustituto" (gestor visualiza + actúa en nombre del autónomo) | "Para gestorías como canal de venta B2B." |

---

## 14. Resumen ejecutivo para pitch

**KonquerAI = Holded para autónomos de obra, pero más simple y con IA.**

### Tres líneas de valor

1. **"Lo de Hacienda lo lleva la app"** — facturación + IVA + recordatorios trimestrales automáticos.
2. **"Sabe si ganas o pierdes en cada obra"** — rentabilidad real con costes imputados. **Único en su nicho.**
3. **"Hablas, no escribes"** — IA + voz + cámara para que la app trabaje por ti, no al revés.

### Diferenciador frente a competidores (Holded, Quipu, Anfix, Billin)

Especialización vertical en construcción + UX brutalmente simple + IA generativa en el core + acompañamiento humano.

---

> **Archivos relacionados**: `00_brand_strategy.md` (los 3 pilares estratégicos), `04_value_proposition.md` (cómo se traducen en mensajes), `05_offer.md` (cómo se empaquetan en la oferta comercial), `06_homepage_copy.md` (cómo se presentan en web).
