"use client";
import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function LoadingIndicator() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  // Listen for navigation start (when links are clicked)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as Element)?.closest("a");
      if (
        target?.href &&
        target?.href !== window.location.href &&
        target.target !== "_blank" &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        setLoading(true);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  if (!loading) return null;

  return (
    <div className="bg-muted/30 fixed top-0 left-0 z-50 h-1 w-full">
      <div className="bg-primary animate-loading-pulse h-full rounded-r-full" />

      <style jsx>{`
        @keyframes loading-pulse {
          0% {
            width: 0%;
            opacity: 0.4;
          }
          50% {
            width: 85%;
            opacity: 0.9;
          }
          100% {
            width: 100%;
            opacity: 1;
          }
        }
        .animate-loading-pulse {
          animation: loading-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
