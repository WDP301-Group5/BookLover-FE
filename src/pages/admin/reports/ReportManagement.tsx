import { Badge, Button, Group, Text, Textarea, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import {
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTablePagination,
  useDataTable,
} from "../../../components/data-table";
import { DataTableFilter } from "../../../components/data-table/filter";
import {
  useAcknowledgeReport,
  useDismissReport,
  useReports,
} from "../../../hooks/useAdminReport";
import { format } from "../../../lib/format";
import type { Report } from "../../../services/AdminReportService";
import { ReportDetailModal } from "./ReportDetailModal";
import { ReportHistoryModal } from "./ReportHistoryModal";

function ReportManagement() {
  const { mutate: dismissReport } = useDismissReport();
  const { mutate: acknowledgeReport } = useAcknowledgeReport();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailOpened, { open: openDetail, close: closeDetail }] =
    useDisclosure(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [historyOpened, { open: openHistory, close: closeHistory }] =
    useDisclosure(false);

  const handleDismiss = (report: Report) => {
    let note = "";
    modals.openConfirmModal({
      title: "Từ chối báo cáo",
      children: (
        <div className="space-y-4">
          <Text size="sm">Nhập lý do từ chối báo cáo này (tùy chọn):</Text>
          <Textarea
            placeholder="Nhập lý do..."
            onChange={(e) => {
              note = e.target.value;
            }}
          />
        </div>
      ),
      labels: { confirm: "Từ chối", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        dismissReport({ id: report._id, note: note || undefined });
      },
    });
  };

  const handleAcknowledge = (report: Report) => {
    let note = "";
    modals.openConfirmModal({
      title: "Xác nhận báo cáo",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Xác nhận báo cáo này là hợp lệ. Nhập ghi chú (tùy chọn):
          </Text>
          <Textarea
            placeholder="Nhập ghi chú..."
            onChange={(e) => {
              note = e.target.value;
            }}
          />
        </div>
      ),
      labels: { confirm: "Xác nhận", cancel: "Hủy" },
      confirmProps: { color: "green" },
      onConfirm: () => {
        acknowledgeReport({ id: report._id, note: note || undefined });
      },
    });
  };

  const handleViewDetail = (report: Report) => {
    setSelectedReport(report);
    openDetail();
  };

  const dataTable = useDataTable<Report>({
    columns: getColumns(
      handleDismiss,
      handleAcknowledge,
      handleViewDetail,
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    service: (params: any) =>
      useReports(params).data || { reports: [], pagination: { total: 0 } },
    queryKey: ["admin", "reports", "pending"],
  });

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Báo cáo vi phạm</Title>
      </Group>

      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      {selectedReport && (
        <>
          <ReportDetailModal
            report={selectedReport}
            opened={detailOpened}
            onClose={closeDetail}
          />
          <ReportHistoryModal
            report={selectedReport}
            opened={historyOpened}
            onClose={closeHistory}
          />
        </>
      )}
    </div>
  );
}

function getColumns(
  onDismiss: (r: Report) => void,
  onAcknowledge: (r: Report) => void,
  onDetail: (r: Report) => void,
): ColumnDef<Report>[] {
  return [
    {
      accessorKey: "type",
      header: "Loại",
      cell: ({ row }) => {
        const type = row.original.type;
        return (
          <Badge
            color={
              type === "Story"
                ? "blue"
                : type === "Chapter"
                  ? "violet"
                  : "orange"
            }
            variant="light"
          >
            {type === "Story"
              ? "Truyện"
              : type === "Chapter"
                ? "Chương"
                : "Bình luận"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "targetPreview",
      header: "Đối tượng",
      cell: ({ row }) => {
        const preview = row.original.targetPreview;
        return (
          <Text fw={500} lineClamp={2}>
            {preview?.title || preview?.content || "Không rõ"}
          </Text>
        );
      },
    },
    {
      accessorKey: "reporterUsername",
      header: "Người báo cáo",
      cell: ({ row }) => (
        <Text size="sm">@{row.original.reporterUsername || "Unknown"}</Text>
      ),
    },
    {
      accessorKey: "content",
      header: "Lý do",
      cell: ({ row }) => (
        <Text size="sm" c="dimmed" lineClamp={2}>
          {row.original.content}
        </Text>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ngày báo cáo",
      cell: ({ row }) => format.date(new Date(row.original.createdAt)),
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <Group gap="xs" justify="center">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconInfoCircle size={14} />}
            onClick={() => onDetail(row.original)}
          >
            Chi tiết
          </Button>
          <Button
            variant="light"
            color="green"
            size="xs"
            leftSection={<IconCheck size={14} />}
            onClick={() => onAcknowledge(row.original)}
          >
            Duyệt
          </Button>
          <Button
            variant="light"
            color="red"
            size="xs"
            leftSection={<IconX size={14} />}
            onClick={() => onDismiss(row.original)}
          >
            Từ chối
          </Button>
        </Group>
      ),
    },
  ];
}

export default ReportManagement;
