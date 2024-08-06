export const dynamic = "force-dynamic";
import { sql } from "@pgtyped/runtime";
import { IGetBlocksByDescQuery, IGetBlocksCountQuery} from "./route.types";
import { getPgClient } from "@/lib/db";

export async function GET(req: Request) {
  console.log("GET req on /api/blocks/");
  try {
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page")?.trim() ?? "";

    const pageOffset = (parseInt(pageParam, 10)) * 10;
    const queryLimit = 10;

    console.log("pageOffset", pageOffset);

    const getBlocksByDesc = sql<IGetBlocksByDescQuery>`
      SELECT b.height, b.created_at FROM blocks b
      ORDER BY b.height DESC LIMIT $queryLimit! OFFSET $pageOffset!;
    `;
    const getBlocksCount = sql<IGetBlocksCountQuery>`SELECT COUNT(*)::int as "count!" FROM blocks;`;

    console.log("Acquiring DB Client and Querying database for recent blocks.");

    const client = await getPgClient();
    const blocks = await getBlocksByDesc.run({queryLimit, pageOffset}, client);
    const [{ count },,] = await getBlocksCount.run(undefined, client);

    console.log("Successfully queried Blocks.");
    console.log([count, blocks]);

    client.release();
    const pages = Math.floor((count / 10) + 1);

    return new Response(JSON.stringify({ pages, results: blocks }));
  } catch (error) {
    console.error("Error occurred while requesting Blocks", error);
    return new Response("Could not query blocks.", { status: 404});
  }
}
