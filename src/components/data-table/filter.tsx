import { ActionIcon, TextInput } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useDataTableContext } from "./provider";

export function DataTableFilter<TData>() {
  const { table } = useDataTableContext<TData>()
  const filterValue = table.getState().globalFilter || '';

  return (
    <TextInput
      placeholder="Tìm kiếm"
      value={filterValue}
      onChange={(e) => table.setGlobalFilter(e.target.value)}
      leftSection={<IconSearch size={18} />}
      rightSection={
        filterValue && (
          <ActionIcon
            variant="subtle"
            size="sm"
            onClick={() => table.setGlobalFilter('')}
            style={{ cursor: 'pointer' }}
          >
            <IconX size={16} />
          </ActionIcon>
        )
      }
    />
  )
}