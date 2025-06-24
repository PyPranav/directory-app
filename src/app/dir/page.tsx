import { redirect } from "next/navigation";

export default function DirPage() {
  redirect("/categories");
  return null;
}