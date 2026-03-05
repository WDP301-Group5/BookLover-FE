import { Card } from "@mantine/core";
import { createContext, useContext, type PropsWithChildren } from "react";
import type { UseDataTableReturn } from "./hook";

const Context = createContext<UseDataTableReturn<unknown> | null>(null);

type DataTableProps<TData> = {
  dataTable: UseDataTableReturn<TData>;
} & PropsWithChildren

export function DataTable<TData>({ children, dataTable }: DataTableProps<TData>) {
  return (
    <Context.Provider value={dataTable as UseDataTableReturn<unknown>}>
      <Card shadow="sm" padding="xs" radius="md" withBorder>
        <div className="space-y-2.5">
          {children}
        </div>
      </Card>
    </Context.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataTableContext<TData>() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useDataTable must be used within a DataTableProvider');
  }
  return context as UseDataTableReturn<TData>;
}