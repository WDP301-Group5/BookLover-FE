import {
  ActionIcon,
  Box,
  Button,
  ButtonGroup,
  Group,
  Select,
} from "@mantine/core";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { useDataTableContext } from "./provider";

export function DataTablePagination<TData>() {
  const { table } = useDataTableContext<TData>();

  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  const pageCount = table.getPageCount();
  const totalRows = table.getFilteredRowModel().rows.length;
  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <Box>
      <Group justify="space-between" align="center" gap="lg" wrap="wrap">
        <Group gap="md" wrap="nowrap" flex={1}>
          <ButtonGroup>
            <Button size="sm" variant="default">
              {totalRows} dòng
            </Button>
            <Button size="sm" variant="default">
              {pageCount} trang
            </Button>
          </ButtonGroup>
        </Group>

        <Group gap={"xs"} wrap="nowrap" flex={1}>
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
            <Select
              value={(pageIndex + 1).toString()}
              onChange={(value) => table.setPageIndex(Number(value) - 1)}
              data={Array.from({ length: pageCount }, (_, i) => ({
                value: (i + 1).toString(),
                label: `Trang ${i + 1}`,
              }))}
              size="sm"
              w={128}
            />
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

        <Group
          gap="xs"
          wrap="nowrap"
          visibleFrom="xs"
          flex={1}
          justify="flex-end"
        >
          <Select
            value={pageSize.toString()}
            onChange={(value) => table.setPageSize(Number(value))}
            data={[
              { value: "5", label: "5 dòng" },
              { value: "10", label: "10 dòng" },
              { value: "25", label: "25 dòng" },
              { value: "50", label: "50 dòng" },
              { value: "100", label: "100 dòng" },
            ]}
            w={128}
            size="sm"
          />
        </Group>
      </Group>
    </Box>
  );
}
