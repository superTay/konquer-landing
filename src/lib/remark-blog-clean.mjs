/**
 * Limpieza editorial de los posts del blog (solo afecta a src/content/blog):
 *
 * 1. Quita el bloque ```json (JSON-LD): se inyecta en el <head> desde la
 *    página, no debe verse como texto en el cuerpo.
 * 2. Quita la sección "## Enlaces internos (interlinks)": es apparatus
 *    editorial del plan de contenidos, no contenido para el lector.
 * 3. Reescribe enlaces internos entre posts de /slug a /blog/slug
 *    (los posts se escribieron con enlaces raíz-relativos).
 * 4. Elimina separadores --- sobrantes al final del documento.
 */

// Rutas de primer nivel del sitio que NO son posts del blog.
const SITE_PATHS = new Set([
  'precios',
  'sobre-nosotros',
  'newsletter',
  'blog',
  'legal',
]);

function nodeText(node) {
  if (typeof node.value === 'string') return node.value;
  return (node.children ?? []).map(nodeText).join('');
}

function rewriteLinks(node) {
  if (node.type === 'link' && typeof node.url === 'string') {
    const match = node.url.match(/^\/([a-z0-9-]+)\/?$/);
    if (match && !SITE_PATHS.has(match[1])) {
      node.url = `/blog/${match[1]}`;
    }
  }
  for (const child of node.children ?? []) rewriteLinks(child);
}

export function remarkBlogClean() {
  return (tree, file) => {
    const path = String(file?.path ?? '').replace(/\\/g, '/');
    if (!path.includes('/content/blog/')) return;

    // 1. Bloques de código json (JSON-LD) fuera del cuerpo visible
    tree.children = tree.children.filter(
      (node) => !(node.type === 'code' && node.lang === 'json'),
    );

    // 2. Sección "Enlaces internos" (hasta el siguiente encabezado del mismo nivel)
    const start = tree.children.findIndex(
      (node) =>
        node.type === 'heading' &&
        nodeText(node).toLowerCase().startsWith('enlaces internos'),
    );
    if (start !== -1) {
      const depth = tree.children[start].depth;
      let end = tree.children.length;
      for (let i = start + 1; i < tree.children.length; i++) {
        if (tree.children[i].type === 'heading' && tree.children[i].depth <= depth) {
          end = i;
          break;
        }
      }
      tree.children.splice(start, end - start);
    }

    // 3. Enlaces internos entre posts → /blog/slug
    rewriteLinks(tree);

    // 4. Separadores huérfanos al final
    while (
      tree.children.length &&
      tree.children[tree.children.length - 1].type === 'thematicBreak'
    ) {
      tree.children.pop();
    }
  };
}
