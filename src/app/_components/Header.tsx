import Link from "next/link";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function Header() {
  return (
    <header className={cn("bg-background sticky top-0 z-1000 w-full border-b")}>
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <nav className="flex items-center gap-4">
          <Link href="/">
            <span className="text-lg font-semibold hover:underline">Tools</span>
          </Link>
          <Link href="/categories">
            <span className="text-lg font-semibold hover:underline">
              Categories
            </span>
          </Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/create">
            <Button variant="outline">Admin</Button>
          </Link>

          <Link href="/logout">
            <Button variant="outline">Logout</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
