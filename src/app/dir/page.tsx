import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/categories`,
  },
};

export default function DirPage() {
  redirect("/categories");
  return null;
}
