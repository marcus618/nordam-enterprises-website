import { defineCollection, z } from 'astro:content';

const servicesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(), // Path to the image, e.g., /images/service-1.jpg
    sortOrder: z.number(),

  }),
});

const productsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    sortOrder: z.number(),

  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    images: z.array(z.string()), // An array of image paths
    sortOrder: z.number(),
  }),
});

export const collections = {
  'services': servicesCollection,
  'products': productsCollection,
  'projects': projectsCollection,
};