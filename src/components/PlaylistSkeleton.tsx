import { Skeleton } from "./ui/skeleton";

export default function PlaylistSkeleton() {
  return (
    <>
      <div className="flex flex-row relative flex-wrap justify-start items-center w-full gap-4 p-5">
        <Skeleton className="w-5 h-5" />
        <Skeleton className="w-20 h-20 rounded-xl" />
        <div className="h-20 flex flex-col justify-between p-2">
          <div className="flex flex-wrap gap-x-6">
            <Skeleton className="w-20 h-5 " />
          </div>
          <div className="flex flex-wrap gap-x-6">
            <Skeleton className="h-5 w-70" />
          </div>
        </div>
      </div>
    </>
  );
}
