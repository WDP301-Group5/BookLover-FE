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
import { format } from "../../../lib/format";
import type { Report, ReportLog } from "../../../services/AdminReportService";

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
  if (!report) return null;

  // Note: In a real implementation, you would fetch logs here
  // For now, this is a placeholder that will be connected when hooks are used

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

  // Placeholder logs - will be replaced with actual data from useReportLogs hook
  const placeholderLogs: ReportLog[] = [];

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
        {placeholderLogs.length === 0 ? (
          <Box p="md" bg="gray.0" radius="md" ta="center">
            <Text size="sm" c="dimmed">
              Chưa có lịch sử xử lý cho báo cáo này.
            </Text>
          </Box>
        ) : (
          <Stack gap="sm">
            {placeholderLogs.map((log) => (
              <Box
                key={log._id}
                p="sm"
                bg="gray.0"
                radius="md"
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
