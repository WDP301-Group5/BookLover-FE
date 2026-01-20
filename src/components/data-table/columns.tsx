/* eslint-disable react-refresh/only-export-components */
import { Button, Checkbox, Menu } from "@mantine/core";
import { IconChevronDown, IconColumns } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "../../lib/format";
import { useDataTableContext } from "./provider";

function getSelectColumn<TData>(): ColumnDef<TData> {
  return {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
        size="xs"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
        size="xs"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }
}

function getIndexColumn<TData>(header?: string): ColumnDef<TData> {
  return {
    id: 'index',
    header: header || 'Số thứ tự',
    accessorFn: (_, index) => index,
    cell: ({ row }) => format.number(row.index + 1),
  }
}

export const column = {
  select: getSelectColumn,
  index: getIndexColumn,
}

// select what columns to show
export function DataTableColumns<TData>() {
  const { table } = useDataTableContext<TData>();

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <Button variant="default" leftSection={<IconColumns size={16} />} rightSection={<IconChevronDown size={16} />}>
          Cột
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <Menu.Item
                key={column.id}
                onClick={(e) => {
                  e.stopPropagation();
                  column.toggleVisibility();
                }}
                leftSection={
                  <Checkbox
                    checked={column.getIsVisible()}
                    onChange={() => column.toggleVisibility()}
                    onClick={(e) => e.stopPropagation()}
                    size="xs"
                    readOnly
                  />
                }
              >
                <span style={{ textTransform: 'capitalize' }}>{column.columnDef.header?.toString()}</span>
              </Menu.Item>
            );
          })}
      </Menu.Dropdown>
    </Menu>
  );
}