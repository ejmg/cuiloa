export const dynamic = "force-dynamic";
import { getPgClient } from "@/lib/db";
import { sql } from "@pgtyped/runtime";
import { IGetTransactionQuery } from "./route.types";
import { transactionFromBytes, ibcRegistry } from "@/lib/protobuf";
import { HashResultValidator } from "@/lib/validators/search";
import { z } from "zod";

export async function GET(req: Request) {
  console.log("Success: GET /api/transaction");
  try {
    const url = new URL(req.url);
    const queryParam = url.searchParams.get("q")?.trim() ?? "";
    const hash = HashResultValidator.parse(queryParam);
    console.log(`Querying db for transaction event with hash ${hash}`);

    // NOTE: Easy thing to look at perf near future: building a CTE with JSON-ified values to collect into a single row
    // Creating a view that collects all event attributes on a given transaction is probably better long term.
    const getTransaction = sql<IGetTransactionQuery>`
      WITH events_by_type (tx_id, type, attrs_array) AS (
        SELECT ea.tx_id, ea.type, json_agg(json_build_object('key', ea.key, 'value', ea.value)) as "attrs_array"
        FROM blocks b JOIN tx_results tr ON b.rowid=tr.block_id
        JOIN event_attributes ea ON tr.rowid=ea.tx_id
        WHERE ea.tx_id IS NOT NULL AND tr.tx_hash=$hash!
        GROUP BY ea.type, ea.tx_id
        ORDER BY ea.type
      )
      SELECT
        tx.tx_hash,
        b.height,
        tx.tx_result,
        tx.created_at,
        json_agg(json_build_object('type', e.type, 'attributes',e.attrs_array)) as "events!"
      FROM tx_results tx
      LEFT JOIN blocks b ON b.rowid=tx.block_id
      JOIN events_by_type e ON e.tx_id=tx.rowid
      WHERE tx.tx_hash=$hash!
      GROUP BY tx.tx_hash, b.height, tx.tx_result, tx.created_at;
    `;

    console.log(`Acquiring PgClient and querying for Transaction with hash ${hash}.`);

    const client = await getPgClient();
    const [transaction,,] = await getTransaction.run({ hash }, client);
    client.release();

    console.log("pgClient finished querying, transaction:");
    console.dir(transaction, { depth: 2 });

    // NOTE: At this point, it might be better to simply pass tx_result in the response and decode the Transaction
    //       on the client?
    //       The reasoning is that there are two calls to .fromBinary() on tx_result's data before ultimately re-encoding it to a JSON serializable value.
    //       This then gets de-serialized back into a JSON Value, then to a Transaction, and then back into a JSON string.
    const { tx_result, ...tx } = transaction;
    const penumbraTx = transactionFromBytes(tx_result);

    return new Response(JSON.stringify([tx, penumbraTx.toJson({ typeRegistry: ibcRegistry })]));
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return new Response("Invalid transaction query: Hash must be 64 hexadecimal characters with optional 0x prefix", { status: 422 });
    }
    return new Response("Could not find transaction result with provided hash.", { status: 404 });
  }
}
