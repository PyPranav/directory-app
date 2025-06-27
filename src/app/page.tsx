import Link from "next/link";

import type { Metadata } from "next";
import { api, HydrateClient } from "~/trpc/server";
import SearchBar from "./_components/SearchBar";
import ToolCard from "./_components/ToolCard";

interface HomePageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Tools",
  description: "List of all tools under various categories",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}`,
  },
};

export default async function Home({ searchParams }: HomePageProps) {
  const { q } = await searchParams;
  const tools = await api.tools.getAll({
    name: q ?? "",
  });

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
                  name: "All Tools",
                  item: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
                },
              ],
            }),
          }}
        />
        {/* ItemList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "All Tools",
              itemListElement: tools?.map((tool, idx) => ({
                "@type": "ListItem",
                position: idx + 1,
                name: tool.name,
                url: `${process.env.NEXT_PUBLIC_BASE_URL}/dir/${tool.Categories.slug}/${tool.slug}`,
              })),
            }),
          }}
        />
        <h1 className="mb-5 text-2xl font-bold">All Tools</h1>
        <SearchBar
          initialSearch={q}
          defaultRoute="/"
          placeHolder="Search tools..."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          {tools?.map((tool) => (
            <Link
              key={tool.id}
              href={`/dir/${tool.Categories.slug}/${tool.slug}`}
            >
              <ToolCard tool={tool} category={tool.Categories} />
            </Link>
          ))}
        </div>
      </main>
    </HydrateClient>
  );
}
