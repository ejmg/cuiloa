import { getBaseURL } from "@/lib/utils";
import { BlocksTableQuery } from "@/lib/validators/table";

export async function getBlocks ({ endpoint, pageIndex } : ({ endpoint: string, pageIndex: number })) {
  const baseUrl = getBaseURL();
  console.log(`Fetching: GET ${baseUrl}/${endpoint}/?page=${pageIndex}`);
  const res = await fetch(`${baseUrl}/${endpoint}?page=${pageIndex}`, { method: "GET" });
  const json = await res.json();

  console.log("Fetched result:", json);
  const result = BlocksTableQuery.safeParse(json);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error.message);
  }
}
