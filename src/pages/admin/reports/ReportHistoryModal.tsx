import {
  Avatar,
  Badge,
  Box,
  Group,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useReportLogs } from "../../../hooks/useAdminReport";
import { format } from "../../../lib/format";
import type { Report, ReportLog } from "../../../interfaces/report";

interface ReportHistoryModalProps {
  report: Report | null;
  opened: boolean;
  onClose: () => void;
}

export function ReportHistoryModal({
  report,
  opened,
  onClose,
}: ReportHistoryModalProps) {
  const { data: logs = [] } = useReportLogs(report?._id || null);

  if (!report) return null;

  const actionLabels: Record<string, string> = {
    dismiss: "Từ chối báo cáo",
    acknowledge: "Xác nhận báo cáo",
    ban_story: "Khóa truyện",
    delete_chapter: "Xóa chương",
    delete_comment: "Xóa bình luận",
    warn_user: "Cảnh báo user",
    ban_user: "Khóa user",
  };

  const actionColors: Record<string, string> = {
    dismiss: "red",
    acknowledge: "green",
    ban_story: "red",
    delete_chapter: "orange",
    delete_comment: "orange",
    warn_user: "yellow",
    ban_user: "red",
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Title order={3}>Lịch sử xử lý báo cáo #{report._id.slice(-6)}</Title>
      }
      size="lg"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md">
        {logs.length === 0 ? (
          <Box p="md" bg="gray.0" ta="center">
            <Text size="sm" c="dimmed">
              Chưa có lịch sử xử lý cho báo cáo này.
            </Text>
          </Box>
        ) : (
          <Stack gap="sm">
            {logs.map((log: ReportLog) => (
              <Box
                key={log._id}
                p="sm"
                bg="gray.0"
                style={{ border: "1px solid #e9ecef" }}
              >
                <Group justify="space-between" mb="xs">
                  <Group gap="xs">
                    <Avatar
                      src={log.adminId.avatarURL}
                      alt={log.adminId.fullName}
                      size="sm"
                      radius="xl"
                    />
                    <div>
                      <Text size="sm" fw={600}>
                        {log.adminId.fullName}
                      </Text>
                      <Text size="xs" c="dimmed">
                        @{log.adminId.username}
                      </Text>
                    </div>
                  </Group>
                  <Badge
                    color={actionColors[log.action] || "gray"}
                    variant="light"
                  >
                    {actionLabels[log.action] || log.action}
                  </Badge>
                </Group>
                <Text size="xs" c="dimmed" mb="xs">
                  {format.date(new Date(log.createdAt))}
                </Text>
                {log.note && (
                  <Text size="sm" mb="xs">
                    <Text component="span" fw={600}>
                      Ghi chú:{" "}
                    </Text>
                    {log.note}
                  </Text>
                )}
                {log.metadata && (
                  <Box>
                    <Text size="xs" fw={600} mb="xs">
                      Kết quả:
                    </Text>
                    <Stack gap={2}>
                      {log.metadata.storyBanned && (
                        <Text size="xs" c="red">
                          • Truyện đã bị khóa
                        </Text>
                      )}
                      {log.metadata.chapterDeleted && (
                        <Text size="xs" c="orange">
                          • Chương đã bị xóa
                        </Text>
                      )}
                      {log.metadata.commentDeleted && (
                        <Text size="xs" c="orange">
                          • Bình luận đã bị xóa
                        </Text>
                      )}
                      {log.metadata.userWarned && (
                        <Text size="xs" c="yellow">
                          • Người dùng đã được cảnh báo
                        </Text>
                      )}
                      {log.metadata.userBanned && (
                        <Text size="xs" c="red">
                          • Người dùng đã bị khóa
                        </Text>
                      )}
                    </Stack>
                  </Box>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
