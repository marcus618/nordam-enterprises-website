import { config, fields, collection } from '@keystatic/core';

const isProduction = import.meta.env.PROD; 
const SITE_URL = 'https://www.nordamenterprises.com';

export default config({
  storage: isProduction
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'marcus618/nordam-enterprises-website', 
      },
  collections: {
    // 3. Projects Collection (matches z.array(z.string()) for images)
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        sortOrder: fields.integer({ label: 'Sort Order', defaultValue: 10 }),
        // This array field handles the list of images for the gallery/carousel
        images: fields.array(
            fields.image({
                label: 'Image',
                directory: 'public/images/projects',
                publicPath: '/images/projects/',
            }),
            {
                label: 'Project Gallery',
                // Returns the filename if available, otherwise "New Image"
                itemLabel: (props) => {
                    const value = props.value;
                    if (!value) return 'Empty Image';
                    // If it's a string path (already saved)
                    if (typeof value === 'string') return value.split('/').pop() || value;
                    // If it's an object (just uploaded)
                    return value.filename || 'New Image';
                } 
            }
        ),
        content: fields.document({
          label: 'Project Details',
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: 'public/images/projects',
            publicPath: '/images/projects/',
          },
        }),
      },
    }),
  },
});