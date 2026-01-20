import { ActionIcon, Box, Button, Divider, Group, Select, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import { useDataTableContext } from "./provider";

export function DataTablePagination<TData>() {
  const { table } = useDataTableContext<TData>();

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  const startRow = pageIndex * pageSize + 1;
  const endRow = Math.min((pageIndex + 1) * pageSize, totalRows);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const totalPages = pageCount;
    const currentPage = pageIndex + 1;

    if (totalPages <= 7) {
      // Hiển thị tất cả các trang nếu ít hơn 7 trang
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Logic hiển thị trang với ellipsis
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <Box
    >
      <Group justify="space-between" align="center" gap="lg" wrap="wrap">
        <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
          Hiển thị <Text span fw={600} c="var(--mantine-color-text)">{startRow}</Text> đến{' '}
          <Text span fw={600} c="var(--mantine-color-text)">{endRow}</Text> trong tổng số{' '}
          <Text span fw={600} c="var(--mantine-color-text)">{totalRows}</Text> kết quả
        </Text>

        <Group gap="md" wrap="nowrap">
          <Group gap="xs" wrap="nowrap" visibleFrom="xs">
            <Text size="sm" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
              Số dòng:
            </Text>
            <Select
              value={pageSize.toString()}
              onChange={(value) => table.setPageSize(Number(value))}
              data={[
                { value: '5', label: '5' },
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
                { value: '100', label: '100' },
              ]}
              w={80}
              size="xs"
            />
          </Group>

          <Divider orientation="vertical" />

          <Group gap={6} wrap="nowrap">
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => table.setPageIndex(0)}
              disabled={!canPreviousPage}
              aria-label="Về trang đầu"
            >
              <IconChevronsLeft size={18} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => table.previousPage()}
              disabled={!canPreviousPage}
              aria-label="Trang trước"
            >
              <IconChevronLeft size={18} />
            </ActionIcon>

            <Group gap={4} wrap="nowrap">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <Button
                      key={`ellipsis-${index}`}
                      variant="subtle"
                      size="sm"
                      disabled
                      style={{ minWidth: 36 }}
                    >
                      ...
                    </Button>
                  );
                }

                const pageNum = page as number;
                const isActive = pageNum === pageIndex + 1;

                return (
                  <Button
                    key={pageNum}
                    variant={isActive ? 'filled' : 'light'}
                    size="sm"
                    onClick={() => table.setPageIndex(pageNum - 1)}
                    style={{ minWidth: 36 }}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </Group>

            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => table.nextPage()}
              disabled={!canNextPage}
              aria-label="Trang sau"
            >
              <IconChevronRight size={18} />
            </ActionIcon>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="lg"
              onClick={() => table.setPageIndex(pageCount - 1)}
              disabled={!canNextPage}
              aria-label="Đến trang cuối"
            >
              <IconChevronsRight size={18} />
            </ActionIcon>
          </Group>
        </Group>
      </Group>
    </Box>
  );
}