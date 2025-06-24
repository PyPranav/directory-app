import Link from "next/link";

import { api, HydrateClient } from "~/trpc/server";
import CategoryCard from "../_components/CategoryCard";
import SearchBar from "../_components/SearchBar";
import type { Metadata } from "next";

interface CategoriesPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: 'Categories Listing Page',
  description: 'List of various tool categories available',
}

export default async function CategoriesPage(props: CategoriesPageProps) {
  const searchParams = await props.searchParams
  const categories = await api.categories.getAll({
    name: searchParams.q
  });

  return (
    <HydrateClient>

      <main className="p-10">
        <h1 className="text-2xl font-bold mb-5">Explore various categories</h1>
        <SearchBar initialSearch={searchParams.q} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
          {categories?.map(category => (
            <Link key={category.id} href={`dir/${category.slug}`}>
              <CategoryCard category={category} showAction={false} />
            </Link>
          ))}
        </div>
      </main>

    </HydrateClient>
  );
}
