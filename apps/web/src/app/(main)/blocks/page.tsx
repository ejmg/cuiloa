export const dynamic = "force-dynamic";
import { BlocksTable } from "@/components/BlocksTable";
import { getBlocks } from "@/components/BlocksTable/getBlocks";
import { getQueryClient } from "@/lib/utils";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";


const Page = () => {
  const queryClient = getQueryClient();

  const defaultQueryOptions = {
    pageIndex: 0,
    pageSize: 10,
  };

  const queryName = "BlocksTable";
  const endpoint = "api/blocks";
  const errorMessage = "Failed to query data while trying to generate blocks table, please try reloading the page.";

  queryClient.prefetchQuery({
    queryFn: () => getBlocks({ endpoint, pageIndex: 0}),
    queryKey: [queryName, defaultQueryOptions.pageIndex],
    staleTime: 0,
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="bg-primary/60 flex flex-col gap-5 pt-5">
      <h1 className="sm:text-2xl font-bold self-center">Recent Blocks</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BlocksTable
          className="self-center sm:w-2/3 w-full"
          queryName={queryName}
          defaultQueryOptions={defaultQueryOptions}
          endpoint={endpoint}
          errorMessage={errorMessage}/>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
