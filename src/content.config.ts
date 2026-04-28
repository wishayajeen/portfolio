import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const diary = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/diary' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tag: z.string(),
    readTime: z.string(),
  }),
});

export const collections = {
  diary,
};
