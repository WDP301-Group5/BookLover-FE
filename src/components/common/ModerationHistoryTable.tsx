import { Avatar, Badge, Group, Stack, Text, Timeline } from "@mantine/core";
import { IconCheck, IconLock, IconLockOpen, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import type { CensorLog } from "../../interfaces/Story";
import { format } from "../../lib/format";
import { AdminCensorService } from "../../services/AdminCensorService";
import { AdminChapterCensorService } from "../../services/AdminChapterCensorService";

interface Props {
  targetType: "Story" | "Chapter";
  targetId: string;
}

const actionMeta = {
  approve: {
    label: "Phê duyệt",
    color: "green",
    Icon: IconCheck,
  },
  reject: {
    label: "Từ chối",
    color: "red",
    Icon: IconX,
  },
  ban: {
    label: "Khóa",
    color: "orange",
    Icon: IconLock,
  },
  unban: {
    label: "Mở khóa",
    color: "teal",
    Icon: IconLockOpen,
  },
} as const;

export function ModerationHistoryTable({ targetType, targetId }: Props) {
  const { data: logs, isLoading } = useQuery<CensorLog[]>({
    queryKey: ["censor-logs", targetType, targetId],
    queryFn: () =>
      targetType === "Story"
        ? AdminCensorService.getStoryCensorLog(targetId)
        : AdminChapterCensorService.getChapterCensorLog(targetId),
  });

  if (isLoading) return <Text size="sm">Đang tải lịch sử...</Text>;
  if (!logs || logs.length === 0)
    return (
      <Text size="sm" c="dimmed">
        Chưa có lịch sử kiểm duyệt.
      </Text>
    );

  return (
    <Timeline active={logs.length} bulletSize={28} lineWidth={2}>
      {logs.map((log) => {
        const action = actionMeta[log.action] ?? actionMeta.approve;
        const Icon = action.Icon;
        return (
          <Timeline.Item
            key={log._id}
            bullet={<Icon size={14} />}
            color={action.color}
            title={
              <Group gap="xs" align="center">
                <Text fw={600} size="sm">
                  {action.label}
                </Text>
                <Badge size="xs" color={action.color} variant="light">
                  {log.action}
                </Badge>
              </Group>
            }
          >
            <Stack gap={4} mt={4}>
              <Group gap="xs">
                <Avatar src={log.adminId.avatar} size="xs" radius="xl" />
                <Text size="xs" fw={500}>
                  {log.adminId.fullName}
                </Text>
              </Group>
              {log.reason && (
                <Text size="sm" c="dimmed">
                  Lý do: {log.reason}
                </Text>
              )}
              <Text size="xs" c="dimmed">
                {format.date(new Date(log.createdAt))}
              </Text>
            </Stack>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
