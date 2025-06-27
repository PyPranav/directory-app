import type { Metadata } from "next";
import Link from "next/link";
import SearchBar from "~/app/_components/SearchBar";
import ToolCard from "~/app/_components/ToolCard";

import { api, HydrateClient } from "~/trpc/server";

interface CategoryToolPageProps {
  searchParams: Promise<{ q?: string }>;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CategoryToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await api.categories.getBySlug({ slug });

  if (!category)
    return {
      title: "Category Not found",
    };
  return {
    title: `${category.name} Category`,
    description: category.metadataDescription ?? `${category.name} Category`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${slug}`,
    },
  };
}

export default async function CategoryToolPage(props: CategoryToolPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const slug = params.slug;
  const query = searchParams.q;
  const category = await api.categories.getBySlug({ slug });
  console.log({ category });

  if (!category) return <>Category not found</>;
  const tools = await api.tools.getByCategory({
    name: query ?? "",
    category: category?.id,
  });

  console.log(category);

  return (
    <HydrateClient>
      <main className="p-10">
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
              ],
            }),
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: `${category.name} Tools`,
              description:
                category.metadataDescription ??
                `${category.name} tools listing`,
              url: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${category.slug}`,
            }),
          }}
        />
        <h1 className="mb-5 text-2xl font-bold">Tools in {category?.name}</h1>
        <SearchBar
          initialSearch={query}
          defaultRoute={`/dir/${category.slug}`}
          placeHolder="Search tools..."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          {tools?.map((tool) => (
            <Link
              key={tool.id}
              href={
                slug
                  ? `/dir/${slug}/${tool.slug}`
                  : `/dir/${category.slug}/${tool.slug}`
              }
            >
              <ToolCard tool={tool} category={category} />
            </Link>
          ))}
        </div>
      </main>
    </HydrateClient>
  );
}
