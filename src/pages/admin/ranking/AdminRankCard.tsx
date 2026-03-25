import { Avatar, Card, Group, Stack, Text, rem } from "@mantine/core";
import { Trophy } from "lucide-react";
import type { AdminRankCardProps } from "../../../types/adminRanking";

function getRankBg(rank: number) {
  if (rank === 1) return "#ffd43b";
  if (rank === 2) return "#dee2e6";
  if (rank === 3) return "#fcc419";
  return "#f1f3f5";
}

export default function AdminRankCard({
  rank,
  avatar,
  name,
  username,
  stats,
  extra,
  onClick,
}: AdminRankCardProps) {
  return (
    <Card
      withBorder
      radius="md"
      className="cursor-pointer transition-shadow duration-200 hover:shadow-sm"
      onClick={onClick}
    >
      <Group wrap="nowrap" align="center" gap="md">
        <div
          style={{
            width: rem(44),
            height: rem(44),
            borderRadius: "50%",
            background: getRankBg(rank),
            color: "#212529",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {rank <= 3 ? <Trophy size={18} /> : rank}
        </div>

        <Avatar src={avatar} size={56} radius="xl" />

        <Stack gap={4} style={{ flex: 1 }}>
          <Text fw={700} size="sm">
            {name ?? username}
          </Text>

          {username ? (
            <Text size="xs" c="dimmed">
              @{username}
            </Text>
          ) : null}

          <Group gap="md" mt={4} wrap="wrap">
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <Group key={`${stat.label}-${index}`} gap={4}>
                  {Icon ? <Icon size={14} color="#868e96" /> : null}
                  <Text size="xs">
                    <b>
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString("vi-VN")
                        : stat.value}
                    </b>{" "}
                    {stat.label}
                  </Text>
                </Group>
              );
            })}
          </Group>

          {extra ? <Group mt={6}>{extra}</Group> : null}
        </Stack>
      </Group>
    </Card>
  );
}