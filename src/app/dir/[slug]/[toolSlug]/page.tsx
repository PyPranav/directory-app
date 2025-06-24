import { ExternalLink } from "lucide-react";
import type { Metadata } from 'next';
import Image from "next/image";
import MarkdownPreview from "~/app/_components/MarkdownPreview";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { api, HydrateClient } from "~/trpc/server";

type toolDetailPageProps = { params: Promise<{ slug: string, toolSlug: string }> }

export async function generateMetadata({ params }: toolDetailPageProps): Promise<Metadata> {
    const { slug, toolSlug } = await params;
    const tool = await api.tools.getBySlugs({
        categorySlug: slug,
        toolSlug
    });
    if (!tool) return {
        title: "not found",
        description: ""
    };

    return {
        title: `${tool.name} Tool | ${tool.Categories.name} Category`,
        description: tool.metadataDescription ?? `${tool.name} Tool under the ${tool.Categories.name} Category`
    }

}

export default async function ToolDetailPage({ params }: toolDetailPageProps) {
    const { slug, toolSlug } = await params;
    const tool = await api.tools.getBySlugs({
        categorySlug: slug,
        toolSlug
    });
    // Defensive: fallback if tool or category is missing
    if (!tool) return <main className="p-8 text-center text-lg">Tool not found.</main>;
    const category = tool.Categories;
    return (
        <HydrateClient>
            <main className="flex justify-center px-2 py-8 bg-background flex-1 ">
                <Card className="w-full max-w-3xl shadow-lg">
                    <CardHeader className="flex flex-row items-center gap-4 border-b pb-4">
                        {/* Logo */}
                        {tool.logo_url && (
                            <div className="h-16 w-16 flex-shrink-0 rounded-lg border bg-white flex items-center justify-center overflow-hidden">
                                <Image
                                    src={tool.logo_url}
                                    alt={`${tool.name} logo`}
                                    className="h-full w-full object-contain"
                                    unoptimized
                                    width={100}
                                    height={100}
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            {/* Tool Name */}
                            <CardTitle className="text-3xl font-bold mb-1 line-clamp-2">{tool.name}</CardTitle>
                            {/* Category Badge */}
                            {category?.name && (
                                <Badge variant="secondary" className="text-base px-3 py-1 mt-1">{category.name}</Badge>
                            )}
                        </div>
                        {/* Created Date */}
                        {tool.created_at && (
                            <div className="text-sm text-gray-400 whitespace-nowrap ml-4 self-start min-w-[140px] text-right">
                                {new Date(tool.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="prose max-w-none px-6 py-8 max-h-[60vh] overflow-y-auto">
                        <MarkdownPreview content={tool.description ?? ""} />
                    </CardContent>
                    {tool.website && (
                        <CardFooter className="flex justify-end px-6 pb-6 pt-0">
                            <a
                                href={tool.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-blue-600 hover:underline text-base font-medium px-4 py-2 rounded-md border border-blue-100 bg-blue-50 transition-colors shadow-sm"
                            >
                                Visit Website <ExternalLink size={18} />
                            </a>
                        </CardFooter>
                    )}
                </Card>
            </main>
        </HydrateClient>
    );
}
