import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Posts del blog: markdown importado desde el plan de contenidos.
// El slug canónico viene del frontmatter (no del nombre de archivo).
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        slug: z.string(),
        date: z.coerce.date(),
        meta_description: z.string(),
        imagen: image(),
        imagen_alt: z.string(),
        ymyl: z.boolean().default(false),
        schema: z.string().optional(),
        silo: z.string().optional(),
        type: z.string().optional(),
        plan_row: z.number().optional(),
        status: z.string().optional(),
      })
      .passthrough(),
});

export const collections = { blog };
