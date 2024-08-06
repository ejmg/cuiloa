import { type FC } from "react";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Connection } from "@/components/ibc/Connection";
import { getIbcConnection } from "@/components/ibc/Connection/getIbcConnection";
import { getQueryClient } from "@/lib/utils";

interface PageProps {
  params: {
    id: string,
  }
}

const Page : FC<PageProps> = ({ params }) => {
  const { id: connectionId } = params;

  const queryClient = getQueryClient();

  const endpoint = "api/ibc/connection";
  const queryName = "IbcConnection";
  const errorMessage = "Failed to query IBC Connection by id. Please try again.";
  queryClient.prefetchQuery({
    queryFn: () => getIbcConnection({ endpoint, connectionId }),
    queryKey: ["IbcConnection", connectionId],
    meta: {
      errorMessage,
    },
  });

  return (
    <div className="bg-primary flex flex-col gap-5 pt-5 items-center ">
      <h1 className="font-medium">IBC Connection</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="sm:w-11/12 w-full">
          <Connection {...{endpoint, queryName, connectionId}}/>
        </div>
      </HydrationBoundary>
    </div>
  );
};

export default Page;
