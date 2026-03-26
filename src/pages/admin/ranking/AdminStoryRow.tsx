import { Badge, Card, Group, Image, Text, rem } from "@mantine/core";
import { ChevronRight, Crown } from "lucide-react";
import type { AdminStoryRowProps } from "../../../types/adminRanking";
import { ShorterNumber } from "../../../utils";

function getRankBg(rank: number) {
  if (rank === 1) return "#ffd43b";
  if (rank === 2) return "#dee2e6";
  if (rank === 3) return "#fcc419";
  return "#f1f3f5";
}

export default function AdminStoryRow({
  story,
  onClick,
}: AdminStoryRowProps) {
  return (
    <Card
      withBorder
      radius="md"
      className="cursor-pointer transition-shadow duration-200 hover:shadow-sm"
      onClick={onClick}
    >
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group align="flex-start" wrap="nowrap" gap="md" style={{ flex: 1 }}>
          <div
            style={{
              minWidth: rem(42),
              width: rem(42),
              height: rem(42),
              borderRadius: "50%",
              background: getRankBg(story.rank),
              color: "#212529",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {story.rank <= 3 ? <Crown size={18} /> : story.rank}
          </div>

          <Image
            src={story.coverUrl}
            alt={story.title}
            w={72}
            h={96}
            radius="md"
            fit="cover"
            fallbackSrc="https://placehold.co/72x96?text=No+Image"
            style={{ flexShrink: 0 }}
          />

          <div style={{ flex: 1 }}>
            <Group gap="xs" mb={4}>
              <Text fw={700} size="md" lineClamp={1}>
                {story.title}
              </Text>

              {story.isPremium && (
                <Badge color="yellow" variant="light" size="xs">
                  Premium
                </Badge>
              )}
            </Group>

            <Text size="sm" c="dimmed" mb={4}>
              Author: {story.author}
            </Text>

            <Text size="xs" c="dimmed" lineClamp={1} mb={6}>
              Categories: {story.categories.join(", ") || "N/A"}
            </Text>

            <Text size="xs" c="dimmed" lineClamp={2} mb="sm">
              {story.description}
            </Text>

            <Group gap="lg" wrap="wrap">
              <Text size="sm">
                <b>{ShorterNumber(story.views)}</b> views
              </Text>
              <Text size="sm">
                <b>{ShorterNumber(story.followers)}</b> followers
              </Text>
              <Text size="sm">
                <b>{ShorterNumber(story.rates)}</b> ratings
              </Text>
              <Text size="sm">
                <b>{ShorterNumber(story.chapters)}</b> chapters
              </Text>
            </Group>
          </div>
        </Group>

        <ChevronRight size={18} color="#868e96" />
      </Group>
    </Card>
  );
}