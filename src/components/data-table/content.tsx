import { Group, Skeleton, Table } from '@mantine/core';
import { IconArrowDown, IconArrowsSort, IconArrowUp } from '@tabler/icons-react';
import { flexRender } from "@tanstack/react-table";
import { useDataTableContext } from './provider';

type DataTableContentProps = {
  className?: string;
}

export function DataTableContent<TData>({ className }: DataTableContentProps) {
  const { table, loading: isLoading } = useDataTableContext<TData>()
  const columns = table.getAllColumns();

  return (
    <Table.ScrollContainer
      minWidth={500}
      scrollAreaProps={{ offsetScrollbars: 'present' }}
      style={{
        border: '1px solid var(--mantine-color-default-border)',
        borderRadius: 'var(--mantine-radius-md)',
      }}
      className={className}
    >
      <Table stickyHeader striped withColumnBorders>
        <Table.Thead>
          {table.getHeaderGroups().map(headerGroup => (
            <Table.Tr key={headerGroup.id} h={'3rem'} c={'blue'}>
              {headerGroup.headers.map(({ id, column, getContext }) => {
                const canSort = column.getCanSort();
                const sortDirection = column.getIsSorted();

                return (
                  <Table.Th
                    key={id}
                    onClick={() => canSort && column.toggleSorting()}
                    className={canSort ? 'cursor-pointer' : undefined}
                  >
                    <Group gap="xs" wrap="nowrap" justify="space-between" style={{ width: '100%' }}>
                      {flexRender(column.columnDef.header, getContext())}
                      {canSort && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}>
                          {sortDirection === 'asc' ? (
                            <IconArrowUp size={16} />
                          ) : sortDirection === 'desc' ? (
                            <IconArrowDown size={16} />
                          ) : (
                            <IconArrowsSort size={16} style={{ opacity: 0.3 }} />
                          )}
                        </span>
                      )}
                    </Group>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          )
          )}
        </Table.Thead>

        <Table.Tbody>
          {isLoading ? Array.from({ length: 10 }).map((_, index) => (
            <Table.Tr key={index} style={{ minHeight: '4rem' }} >
              <Table.Td colSpan={columns.length}>
                <Skeleton height={16} radius={'xl'} width={'100%'} />
              </Table.Td>
            </Table.Tr>
          )) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <Table.Tr
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                h={'3rem'}
                bg={row.getIsSelected() ? 'var(--mantine-color-blue-light)' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))
          ) : (
            <Table.Tr key={'data-table-empty'} style={{ minHeight: '56px' }}>
              <Table.Td colSpan={columns.length}>
                No results.
              </Table.Td>
            </Table.Tr>
          )}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  )
}