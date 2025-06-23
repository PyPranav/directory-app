import Link from "next/link";

import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const categories = await api.categories.getAll({});
  const session = await auth();

  console.log(categories);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {categories.map((category) => (
          <div key={category.id}>
            {category.name}: {category.slug}
          </div>
        ))}
      </main>
    </HydrateClient>
  );
}
