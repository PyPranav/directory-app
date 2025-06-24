import { Skeleton } from "~/components/ui/skeleton";

const GridSkeleton = () => {
    return (
        <>
            <Skeleton className="h-8 w-1/2 mb-5" />
            <div className="mb-6 flex w-full gap-2">
                <Skeleton className="flex-1 h-10 rounded" />
                <Skeleton className="h-10 w-24 rounded" />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
                {Array(6).map((_:number, i) => (
                    <div key={i} className="group relative flex h-full flex-col transition-shadow">
                        <div className="flex flex-row items-start gap-4 p-4">
                            <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
                            <div className="flex-grow">
                                <Skeleton className="h-6 w-32 mb-2 rounded" />
                                <Skeleton className="h-4 w-24 mb-1 rounded" />
                                <Skeleton className="h-4 w-40 mb-2 rounded" />
                                <Skeleton className="h-4 w-20 mt-1 rounded" />
                            </div>
                        </div>
                        <div className="p-4 pt-0">
                            <Skeleton className="h-4 w-16 rounded opacity-45" />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default GridSkeleton;