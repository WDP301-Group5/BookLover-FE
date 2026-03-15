import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Image,
  Modal,
  ScrollArea,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconBook, IconHistory, IconX } from "@tabler/icons-react";
import {
  useBanStoryFromReport,
  useBanUserFromReport,
  useDeleteChapterFromReport,
  useDeleteCommentFromReport,
  useWarnUserFromReport,
} from "../../../hooks/useAdminReport";
import { format } from "../../../lib/format";
import type { Report } from "../../../services/AdminReportService";

interface ReportDetailModalProps {
  report: Report | null;
  opened: boolean;
  onClose: () => void;
}

export function ReportDetailModal({
  report,
  opened,
  onClose,
}: ReportDetailModalProps) {
  const { mutate: banStory } = useBanStoryFromReport();
  const { mutate: deleteChapter } = useDeleteChapterFromReport();
  const { mutate: deleteComment } = useDeleteCommentFromReport();
  const { mutate: warnUser } = useWarnUserFromReport();
  const { mutate: banUser } = useBanUserFromReport();

  if (!report) return null;

  const handleBanStory = () => {
    let reason = "";
    modals.openConfirmModal({
      title: "Khóa truyện",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Nhập lý do khóa truyện{" "}
            <Text span fw={600}>
              {report.targetPreview?.title}
            </Text>
            :
          </Text>
          <Textarea
            placeholder="Nhập lý do..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Khóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) return;
        banStory({ id: report._id, reason });
        onClose();
      },
    });
  };

  const handleDeleteChapter = () => {
    let reason = "";
    modals.openConfirmModal({
      title: "Xóa chương",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Nhập lý do xóa chương{" "}
            <Text span fw={600}>
              {report.targetPreview?.title}
            </Text>
            :
          </Text>
          <Textarea
            placeholder="Nhập lý do..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) return;
        deleteChapter({ id: report._id, reason });
        onClose();
      },
    });
  };

  const handleDeleteComment = () => {
    let reason = "";
    modals.openConfirmModal({
      title: "Xóa bình luận",
      children: (
        <div className="space-y-4">
          <Text size="sm">Nhập lý do xóa bình luận:</Text>
          <Textarea
            placeholder="Nhập lý do..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) return;
        deleteComment({ id: report._id, reason });
        onClose();
      },
    });
  };

  const handleWarnUser = () => {
    let message = "";
    modals.openConfirmModal({
      title: "Cảnh báo người dùng",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Nhập lời cảnh báo gửi đến{" "}
            <Text span fw={600}>
              @{report.reporterUsername}
            </Text>
            :
          </Text>
          <Textarea
            placeholder="Nhập lời cảnh báo..."
            onChange={(e) => {
              message = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Gửi", cancel: "Hủy" },
      confirmProps: { color: "yellow" },
      onConfirm: () => {
        if (!message.trim()) return;
        warnUser({ id: report._id, message });
        onClose();
      },
    });
  };

  const handleBanUser = () => {
    let reason = "";
    modals.openConfirmModal({
      title: "Khóa người dùng",
      children: (
        <div className="space-y-4">
          <Text size="sm">
            Nhập lý do khóa người dùng{" "}
            <Text span fw={600}>
              @{report.reporterUsername}
            </Text>
            :
          </Text>
          <Textarea
            placeholder="Nhập lý do..."
            onChange={(e) => {
              reason = e.target.value;
            }}
            required
          />
        </div>
      ),
      labels: { confirm: "Khóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        if (!reason.trim()) return;
        banUser({ id: report._id, reason });
        onClose();
      },
    });
  };

  const renderTargetPreview = () => {
    if (!report.targetPreview) return null;

    if (report.type === "Story") {
      return (
        <Group align="flex-start" gap="md">
          {report.targetPreview.image && (
            <Image
              src={report.targetPreview.image}
              alt={report.targetPreview.title}
              w={120}
              radius="md"
              fallbackSrc="https://placehold.co/120x160?text=Ảnh"
            />
          )}
          <Stack gap={6} style={{ flex: 1 }}>
            <Text size="sm" c="dimmed">
              Tên truyện
            </Text>
            <Text size="sm" fw={600}>
              {report.targetPreview.title}
            </Text>
            <Text size="sm" c="dimmed">
              Tác giả
            </Text>
            <Group gap="xs">
              <Avatar size="sm" radius="xl" />
              <Text size="sm">{report.targetPreview.authorName}</Text>
            </Group>
            <Text size="sm" c="dimmed">
              Trạng thái
            </Text>
            <Badge
              color={
                report.targetPreview.status === "active"
                  ? "green"
                  : report.targetPreview.status === "pending"
                    ? "yellow"
                    : "red"
              }
              variant="light"
            >
              {report.targetPreview.status}
            </Badge>
          </Stack>
        </Group>
      );
    }

    if (report.type === "Chapter") {
      return (
        <Stack gap={6}>
          <Group gap="xs">
            <IconBook size={16} />
            <Text size="sm" fw={600}>
              Chương {report.targetPreview.chapterNumber}:{" "}
              {report.targetPreview.title}
            </Text>
          </Group>
          <Text size="sm" c="dimmed">
            Tác giả: {report.targetPreview.authorName}
          </Text>
          <Badge
            color={
              report.targetPreview.status === "active" ? "green" : "yellow"
            }
            variant="light"
          >
            {report.targetPreview.status}
          </Badge>
        </Stack>
      );
    }

    if (report.type === "Comment") {
      return (
        <Box>
          <Text size="sm" fw={600} mb={4}>
            Nội dung bình luận
          </Text>
          <Box
            p="sm"
            bg="gray.0"
            radius="md"
            style={{ border: "1px solid #e9ecef" }}
          >
            <Text size="sm">{report.targetPreview.content}</Text>
          </Box>
          <Text size="xs" c="dimmed" mt={4}>
            Trạng thái: {report.targetPreview.status}
          </Text>
        </Box>
      );
    }

    return null;
  };

  const renderActions = () => {
    const actions = [];

    if (report.type === "Story" || report.type === "Chapter") {
      actions.push(
        <Button
          key="ban-story"
          variant="light"
          color="red"
          leftSection={<IconX size={14} />}
          onClick={handleBanStory}
        >
          Khóa truyện
        </Button>,
      );
    }

    if (report.type === "Chapter") {
      actions.push(
        <Button
          key="delete-chapter"
          variant="light"
          color="orange"
          leftSection={<IconX size={14} />}
          onClick={handleDeleteChapter}
        >
          Xóa chương
        </Button>,
      );
    }

    if (report.type === "Comment") {
      actions.push(
        <Button
          key="delete-comment"
          variant="light"
          color="orange"
          leftSection={<IconX size={14} />}
          onClick={handleDeleteComment}
        >
          Xóa bình luận
        </Button>,
      );
    }

    actions.push(
      <Button
        key="warn-user"
        variant="light"
        color="yellow"
        leftSection={<IconX size={14} />}
        onClick={handleWarnUser}
      >
        Cảnh báo
      </Button>,
      <Button
        key="ban-user"
        variant="light"
        color="red"
        leftSection={<IconX size={14} />}
        onClick={handleBanUser}
      >
        Khóa user
      </Button>,
    );

    return actions;
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Chi tiết báo cáo #{report._id.slice(-6)}</Title>}
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg">
        {/* Report Info */}
        <Box>
          <Text size="sm" fw={600} mb={4}>
            Thông tin báo cáo
          </Text>
          <Stack gap={4}>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Loại:
              </Text>
              <Badge
                color={
                  report.type === "Story"
                    ? "blue"
                    : report.type === "Chapter"
                      ? "violet"
                      : "orange"
                }
                variant="light"
              >
                {report.type === "Story"
                  ? "Truyện"
                  : report.type === "Chapter"
                    ? "Chương"
                    : "Bình luận"}
              </Badge>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Trạng thái:
              </Text>
              <Badge
                color={
                  report.status === "pending"
                    ? "yellow"
                    : report.status === "success"
                      ? "green"
                      : "red"
                }
                variant="light"
              >
                {report.status === "pending"
                  ? "Chờ xử lý"
                  : report.status === "success"
                    ? "Đã xử lý"
                    : "Từ chối"}
              </Badge>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Người báo cáo:
              </Text>
              <Text size="sm">@{report.reporterUsername || "Unknown"}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">
                Ngày báo cáo:
              </Text>
              <Text size="sm">{format.date(new Date(report.createdAt))}</Text>
            </Group>
          </Stack>
        </Box>

        {/* Report Content */}
        <Box>
          <Text size="sm" fw={600} mb={4}>
            Lý do báo cáo
          </Text>
          <Box
            p="sm"
            bg="gray.0"
            radius="md"
            style={{ border: "1px solid #e9ecef" }}
          >
            <Text size="sm">{report.content}</Text>
          </Box>
        </Box>

        {/* Target Preview */}
        <Box>
          <Text size="sm" fw={600} mb={4}>
            Đối tượng bị báo cáo
          </Text>
          {renderTargetPreview()}
        </Box>

        <Divider />

        {/* Actions */}
        {report.status === "pending" && (
          <>
            <Group justify="flex-end" gap="sm">
              {renderActions()}
            </Group>
            <Group justify="flex-end" gap="sm">
              <Button
                variant="default"
                leftSection={<IconHistory size={14} />}
                onClick={() => {
                  onClose();
                  // Open history modal - handled by parent
                }}
              >
                Xem lịch sử
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Modal>
  );
}
