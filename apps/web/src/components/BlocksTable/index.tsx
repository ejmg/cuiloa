"use client";

import { columns } from "./columns";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PaginatedDataTable } from "../ui/paginated-data-table";
import { PaginationState, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { getBlocks } from "./getBlocks";
import { cn } from "@/lib/utils";

export interface QueryOptions {
  pageIndex: number,
  pageSize: number,
}

interface BlocksTableProps {
  className?: string,
  queryName: string,
  defaultQueryOptions: QueryOptions,
  endpoint: string,
  errorMessage: string,
}


export function BlocksTable ({
  className,
  queryName,
  defaultQueryOptions,
  endpoint,
  errorMessage,
} : BlocksTableProps) {

  const [pagination, setPagination] = useState<PaginationState>({...defaultQueryOptions});

  const { data } = useSuspenseQuery({
    queryKey: [queryName, pagination.pageIndex],
    queryFn: () => getBlocks({ endpoint, pageIndex: pagination.pageIndex }),
    meta: {
      errorMessage,
    },
  });

  const { pages: pageCount, results: tableData } = data ?? { pages: 0, results: []};

  const table = useReactTable({
    data: tableData,
    columns,
    pageCount,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className={cn("", className)}>
      <PaginatedDataTable table={table} columns={columns}/>
    </div>
  );
};
