import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface RankingSectionProps {
  loading?: boolean;
  error?: string | null;
  note?: string | null;
  children: ReactNode;
}

export default function RankingSection({
  loading,
  error,
  note,
  children,
}: RankingSectionProps) {
  if (loading) {
    return <Text size="sm">Loading...</Text>;
  }

  if (error) {
    return (
      <Text size="sm" c="red">
        {error}
      </Text>
    );
  }

  return (
    <Stack gap="sm">
      {note ? (
        <Text size="sm" c="dimmed">
          {note}
        </Text>
      ) : null}

      {children}
    </Stack>
  );
}