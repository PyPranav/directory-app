import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import MarkdownPreview from "~/app/_components/MarkdownPreview";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

type toolDetailPageProps = {
  params: Promise<{ slug: string; toolSlug: string }>;
};

export async function generateMetadata({
  params,
}: toolDetailPageProps): Promise<Metadata> {
  const { slug, toolSlug } = await params;
  const tool = await api.tools.getBySlugs({
    categorySlug: slug,
    toolSlug,
  });
  if (!tool)
    return {
      title: "not found",
      description: "",
    };

  return {
    title: `${tool.name} Tool | ${tool.Categories.name} Category`,
    description:
      tool.metadataDescription ??
      `${tool.name} Tool under the ${tool.Categories.name} Category`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${slug}/${toolSlug}`,
    },
    openGraph: {
      title: `${tool.name} Tool | ${tool.Categories.name} Category`,
      description: 
      tool.metadataDescription ??
      `${tool.name} Tool under the ${tool.Categories.name} Category`,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${slug}/${toolSlug}`,
      images: [
        {
          url: tool.logo_url ?? `${process.env.NEXT_PUBLIC_BASE_URL}/favicon.ico`,
          width: 1200,
          height: 630,
          alt: `${tool.name} Tool`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} Tool | ${tool.Categories.name} Category`,
      description: tool.metadataDescription ??
      `${tool.name} Tool under the ${tool.Categories.name} Category`,
      images: [tool.logo_url ?? `${process.env.NEXT_PUBLIC_BASE_URL}//favicon.ico`],
    },
  };
}

export default async function ToolDetailPage({ params }: toolDetailPageProps) {
  const { slug, toolSlug } = await params;
  const tool = await api.tools.getBySlugs({
    categorySlug: slug,
    toolSlug,
  });
  // Defensive: fallback if tool or category is missing
  if (!tool)
    return <main className="p-8 text-center text-lg">Tool not found.</main>;
  const category = tool.Categories;
  return (
    <HydrateClient>
      <main className="bg-background flex flex-col items-center justify-center px-2 py-8">
        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "All Categories",
                  item: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: category.name,
                  item: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${category.slug}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: tool.name,
                  item: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${category.slug}/${tool.slug}`,
                },
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: tool.name,
              description: tool.metadataDescription ?? tool.description,
              applicationCategory: category.name,
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${category.slug}/${tool.slug}`,
              image: tool.logo_url,
              ...(tool.website && {
                offers: { "@type": "Offer", url: tool.website },
              }),
              datePublished: tool.created_at,
            }),
          }}
        />
        <Card className="flex w-full max-w-3xl flex-1 shadow-lg">
          <CardHeader className="flex flex-row items-center gap-4 border-b pb-4">
            {/* Logo */}
            {tool.logo_url && (
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-white">
                <Image
                  src={tool.logo_url}
                  alt={`${tool.name} logo`}
                  className="h-full w-full object-contain"
                  unoptimized
                  width={100}
                  height={100}
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              {/* Tool Name */}
              <CardTitle className="mb-1 line-clamp-2 text-3xl font-bold">
                {tool.name}
              </CardTitle>
              {/* Category Badge */}
              {category?.name && (
                <Link href={`/dir/${category.slug}`}>
                  <Badge
                    variant="secondary"
                    className="mt-1 px-3 py-1 text-base hover:text-blue-700 hover:underline"
                  >
                    {category.name}
                  </Badge>
                </Link>
              )}
            </div>
            {/* Created Date */}
            {tool.created_at && (
              <div className="ml-4 min-w-[40px] self-start text-right text-sm whitespace-nowrap text-gray-400">
                {new Date(tool.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </CardHeader>
          <CardContent className="prose max-h-[60vh] max-w-none overflow-y-auto px-6 py-8">
            <MarkdownPreview content={tool.description ?? ""} />
          </CardContent>
          {tool.website && (
            <CardFooter className="flex justify-end px-6 pt-0 pb-6">
              <a
                href={tool.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-blue-100 bg-blue-50 px-4 py-2 text-base font-medium text-blue-600 shadow-sm transition-colors hover:underline"
              >
                Visit Website <ExternalLink size={18} />
              </a>
            </CardFooter>
          )}
        </Card>
      </main>
    </HydrateClient>
  );
}
