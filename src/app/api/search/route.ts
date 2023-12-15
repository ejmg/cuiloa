import db from "@/lib/db";
import { QueryKind, SearchValidator } from "@/lib/validators/search";

export async function POST(req: Request) {
  console.log("POST req on /api/search", req);
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";
    console.log(queryParam);

    const res = SearchValidator.safeParse(queryParam);
    if (!res.success) {
      return new Response("Invalid query", { status: 404 });
    }

    const searchQuery = res.data;
    // TODO: pagination will be more relevant when there are different types of values to search across for a given query...
    //       i.e. for a given block height, find any associated ABCI stuff
    // const pageParam = url.searchParams.get("page")?.trim() ?? "";
    // const pageOffset = (parseInt(pageParam, 10)) * 10;

    if (searchQuery.kind === QueryKind.BlockHeight) {
      const blocksQuery = db.blocks.findMany({
        select: {
          height: true,
          created_at: true,
        },
        where: {
          // value will be bigint when kind is BlockHeight
          height: searchQuery.value as bigint,
        },
      });
      return new Response(JSON.stringify([blocksQuery]));
    } else if (searchQuery.kind === QueryKind.TxHash) {
      const txQuery = await db.tx_results.findFirstOrThrow({
        select: {
          tx_hash: true,
          tx_result: true,
          created_at: true,
          events: {
            select: {
              type: true,
              attributes: {
                select: {
                  key: true,
                  value: true,
                },
              },
            },
            where: {
              NOT: {
                type: "tx",
              },
            },
          },
          blocks: {
            select: {
              height: true,
              chain_id: true,
            },
          },
        },
        where: {
          // value will be string when kind is TxHash
          tx_hash: searchQuery.value as string,
        },
      });
      return new Response(JSON.stringify([txQuery]));
    } else {
      // This should be impossible.
      return new Response("Error processing query.", { status: 500 });
    }
  } catch (error) {
    console.error("Error occurred while searching query.", error);
    return new Response("Could not search query.", { status: 404});
  }
}