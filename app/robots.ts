import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/autow/', '/share/'],
      },
    ],
    sitemap: 'https://business-dashboard.autow-services.co.uk/sitemap.xml',
  };
}
