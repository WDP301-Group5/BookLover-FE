import { useQuery } from "@tanstack/react-query";
import {
  type ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  type Table,
  useReactTable,
} from "@tanstack/react-table";
import { useCallback, useState } from "react";

export type UseDataTableReturn<TData> = {
  data?: TData[];
  table: Table<TData>;
  loading: boolean;
};

type UseDataTableProps<TData> = {
  columns: ColumnDef<TData>[];
  service: () => Promise<TData[]> | TData[];
  queryKey?: unknown[];
};

export function useDataTable<TData>({
  columns,
  service,
  queryKey = ["data-table"],
}: UseDataTableProps<TData>): UseDataTableReturn<TData> {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Memoize service to prevent infinite re-renders
  // Wrap in try-catch to handle any errors gracefully
  const memoizedService = useCallback(async () => {
    try {
      const result = await service();
      // Ensure we always return an array - handle null, undefined, or non-array returns
      if (!result) return [];
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("[DataTable] Service error:", error);
      return [];
    }
  }, [service]);

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: memoizedService,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  // Manual trigger for data fetching - ensures we control when data loads
  const table = useReactTable({
    // Core
    columns,
    // Ensure data is always a valid array - handle null, undefined, or falsy values
    data: data ?? [],
    getCoreRowModel: getCoreRowModel(),
    // Selection
    onRowSelectionChange: setRowSelection,
    // Sort
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // Filter
    globalFilterFn: "auto",
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    // Pagination - set explicit initial pagination to handle empty data correctly
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    // States
    state: {
      rowSelection,
      sorting,
      globalFilter,
    },
  });

  return { data, table, loading: isLoading };
}
