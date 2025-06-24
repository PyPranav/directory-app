import type { Categories, Tools } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";

const ToolCard = ({ tool, category }: { tool: Tools, category?: Categories }) => {
    return (<Card
        key={tool.id}
        className="group relative flex h-full flex-col transition-shadow hover:shadow-lg"
    >
        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
            <div className="relative h-12 w-12 flex-shrink-0 rounded-lg">
                {tool.logo_url && <Image
                    src={tool.logo_url}
                    alt={`${tool.name} logo`}
                    className="h-full w-full object-contain"
                    unoptimized
                    width={100}
                    height={100}
                />}
            </div>
            <div className="flex-grow">
                <CardTitle className="mb-1 text-xl font-bold">
                    {tool.name}
                </CardTitle>
                {tool.created_at && (
                    <div className="text-muted-foreground mb-1 text-xs">
                        Created on{" "}
                        {new Date(tool.created_at).toLocaleDateString(
                            undefined,
                            { year: "numeric", month: "short", day: "numeric" },
                        )}
                    </div>
                )}
                {tool.description ? null : (
                    <div className="text-muted-foreground mb-2 text-sm">
                        No description provided.
                    </div>
                )}
                {category?.name && (
                    <div className="text-xs text-blue-600 font-semibold mt-1">Category: {category.name}</div>
                )}

            </div>
        </CardHeader>
        <CardFooter>
            <p className="opacity-45">/{tool.slug}</p>
        </CardFooter>


    </Card>);
}

export default ToolCard;