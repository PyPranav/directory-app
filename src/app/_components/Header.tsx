import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { cn } from '../../lib/utils';

export default function Header() {
  return (
    <header className={cn('w-full border-b bg-background')}> 
      <div className="flex items-center justify-between h-16 mx-auto px-4">
        <nav className="flex items-center gap-4">
          <Link href="/">
            <span className="font-semibold text-lg hover:underline">Tools</span>
          </Link>
          <Link href="/categories">
            <span className="font-semibold text-lg hover:underline">Categories</span>
          </Link>
        </nav>
        <div className='flex gap-2'>
          <Link href="/create" >
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