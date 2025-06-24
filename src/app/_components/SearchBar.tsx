"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SearchBarProps {
  initialSearch?: string;
  defaultRoute?:string;
  placeHolder?:string;
}

export default function SearchBar({initialSearch = "" , defaultRoute, placeHolder}: SearchBarProps) {
  const [search, setSearch] = useState(initialSearch);
  const router = useRouter();
  
  const handleSearch = () => {
    if (search.trim()) {
      router.push(`?q=${encodeURIComponent(search.trim())}`);
    } else {
      router.push(defaultRoute??'/categories');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <div className="mb-6 flex w-full gap-2">
        <input
          type="text"
          placeholder={placeHolder??"Search categories..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 rounded border px-3 py-2 text-lg"
        />
        <button
          onClick={handleSearch}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Search
        </button>
      </div>
      
    </>
  );
} 