/**
 * Clasificación de las guías del blog por tema, para la página-índice
 * /guias/verifactu-e-iva-reformas/ y los enlaces de vuelta desde cada guía.
 * Se deduce del slug: no hace falta tocar el frontmatter de ninguna guía.
 */
export type TemaGuia = "verifactu" | "iva";

export function temasDeGuia(slug: string): TemaGuia[] {
  const temas: TemaGuia[] = [];
  if (slug.includes("verifactu") || slug === "guia-facturacion-reformas-2026") temas.push("verifactu");
  if (/(^|-)iva(-|$)/.test(slug) || slug === "guia-facturacion-reformas-2026") temas.push("iva");
  return temas;
}

export const HUB_URL = "/guias/verifactu-e-iva-reformas/";
