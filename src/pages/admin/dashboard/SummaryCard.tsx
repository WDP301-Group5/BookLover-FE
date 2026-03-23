import { Card, Text, Title } from "@mantine/core";

type SummaryCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function SummaryCard({
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <Card withBorder radius="xl" p="md" shadow="sm">
      <Text size="sm" c="dimmed">
        {title}
      </Text>

      <Title order={3} mt="sm">
        {value}
      </Title>

      {subtitle ? (
        <Text size="xs" c="dimmed" mt={4}>
          {subtitle}
        </Text>
      ) : null}
    </Card>
  );
}