/* 
  TODO: This component 
  
  Could try extracting out a minimal data table representation that can then be modified for different query types (Blocks vs Transaction Results vs Transaction Results, etc) but
  starting with plain transaction events or block events will probably be the way to go for now.
*/

// TODO: see note above EventTable component about upgrading to tanstack-query >=v5
"use client";

import { DataTable } from "./dataTable";
import { columns } from "./columns";
import { TableEvents } from "@/lib/validators/table";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// TODO: resolve these typings and that with zod and how to navigate between them.
// NOTE: is it possible to derive a tuple type that encodes the valid combinations of event attributes and their types?
export type TransactionType = "tx" | "action_spend" | "action_output" | "action_delegate" | "action_undelegate" | "action_position_open"| "action_postion_close" | "action_swap" | "action_swap_claim" | "action_position_withdraw" | "action_spend" ;

export type TransactionKey = "amount" | "hash" | "height" | "note_commitment" | "nullifier" | "position_id" | "reserves_1" | "reserves_2" | "trading_fee" | "trading_p1" | "trading_p2" | "trading_pair" | "validator";

export interface Attribute {
  key: TransactionKey,
  value: string | number,
}

export interface Event {
  type: TransactionType,
  attributes: Attribute[],
}

export interface TransactionResult {
  height: number,
  createdAt: Date,
  chain_id: string,
  hash: string,
  // TODO: is string actually wanted here for the representation of this buffer 
  result: string,
  events: Event[],
};

// TODO: Need to upgrade tanstack to >=v5 so that I can enable an efficient server-side hydration that works with
//       NextJS's app dir model without resorting to extremely fragile and hard to debug artisinal rehydration patterns.
const EventTable = () => {
  const { data: eventData, isLoading} = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/events?page=${1}`);
      const result = TableEvents.safeParse(data);
      if ( result.success ) {
        return result.data;
      } else {
        throw result.error;
      }
    },
    queryKey: ["initialEventTableQuery"],
  });

  return (
    <div>
      { !isLoading ? (
        <div>
          {eventData ? (
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={eventData} />
            </div>
          ) : (
            <p>Could not load table.</p>
          )}
        </div>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
};

export default EventTable;