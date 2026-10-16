// Canales de contacto de la landing. Todos los CTA llevan aquí hasta que
// haya agenda online (entonces se añade su enlace y se cambia el CTA principal).
export const WHATSAPP_NUMBER = "34624536640";
export const EMAIL = "info@konquerai.com";
export const LINKEDIN_URL = "https://www.linkedin.com/in/christian-marzal-della-rovere";

export const whatsappUrl = (message = "Hola, quiero saber más sobre KonquerAI") =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

export const emailUrl = (subject = "Quiero saber más sobre KonquerAI") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
