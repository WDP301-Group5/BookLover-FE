import { useQuery } from "@tanstack/react-query";
import { getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type RowSelectionState, type SortingState, type Table } from "@tanstack/react-table";
import { useState } from "react";

export type UseDataTableReturn<TData> = {
  data?: TData[]
  table: Table<TData>
  loading: boolean
}

type UseDataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  service: () => Promise<TData[]> | TData[]
}

export function useDataTable<TData> ({ columns, service }: UseDataTableProps<TData>): UseDataTableReturn<TData> {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['data-table'],
    queryFn: service,
  })

  const table = useReactTable({
    // Core
    columns,
    data: data || [],
    getCoreRowModel: getCoreRowModel(),
    // Selection
    onRowSelectionChange: setRowSelection,
    // Sort
    enableSortingRemoval: true,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    // Filter
    globalFilterFn: 'auto',
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    // Pagination
    getPaginationRowModel: getPaginationRowModel(),
    // States
    state: {
      rowSelection,
      sorting,
      globalFilter,
    },
  });

  return {data, table, loading: isLoading}
}