import { Card, Group, Text, ThemeIcon } from "@mantine/core";
import type { OverviewCardProps } from "../../../types/adminRanking";

export default function OverviewCard({
  title,
  value,
  icon: Icon,
  subtitle,
}: OverviewCardProps) {
  return (
    <Card withBorder radius="md">
      <Group justify="space-between" align="flex-start">
        <div>
          <Text size="sm" c="dimmed">
            {title}
          </Text>

          <Text fw={700} size="xl" mt={6}>
            {value}
          </Text>

          {subtitle ? (
            <Text size="xs" c="dimmed" mt={4}>
              {subtitle}
            </Text>
          ) : null}
        </div>

        <ThemeIcon variant="light" size={42} radius="md">
          <Icon size={20} />
        </ThemeIcon>
      </Group>
    </Card>
  );
}