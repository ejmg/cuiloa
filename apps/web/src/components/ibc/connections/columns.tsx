"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type ConnectionsColumns = Record<number, {
    connection_id: string,
  }>;

export const columns : Array<ColumnDef<ConnectionsColumns>> = [
  {
    accessorKey: "connection_id",
    header: () => <div className="text-sm">Channel ID</div>,
    cell: ({ getValue }) => {
      const connectionId = getValue() as string;
      return <Link href={`/ibc/connection/${connectionId}`} className="text-link text-sm"><pre>{connectionId}</pre></Link>;
    },
  },
];
