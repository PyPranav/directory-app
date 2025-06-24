// src/app/sitemap.xml/route.ts
import { NextResponse } from 'next/server';
import { api } from "~/trpc/server";

export async function GET() {
  const categories = await api.categories.getAll({});
  const tools = await api.tools.getAll({});

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const urls = [
    `${baseUrl}/`,
    `${baseUrl}/categories`,
    `${baseUrl}/dir`,
    // ...other static routes
  ];

  categories?.forEach(cat => {
    urls.push(`${baseUrl}/dir/${cat.slug}`);
  });

  tools?.forEach(tool => {
    urls.push(`${baseUrl}/dir/${tool.Categories.slug}/${tool.slug}`);
  });

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      url => `<url><loc>${url}</loc></url>`
    )
    .join('\n  ')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}