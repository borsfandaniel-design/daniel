import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.swing7.me';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/login'], // Protejăm rutele private de indexarea motoarelor de căutare
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}