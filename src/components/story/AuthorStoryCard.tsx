import { Card, Flex, Image, Stack, Text, Group, Badge } from "@mantine/core";
import { Eye, Heart, List, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface AuthorStoryCardProps {
  story: {
    _id: string;
    title: string;
    slug: string;
    image: string;
    description: string;
    views: number;
    stars: number;
    rates: number;
    followers: number;
    isFinish: boolean;
    chapterNumber: number;
  };
}

export default function AuthorStoryCard({ story }: AuthorStoryCardProps) {
  return (
    <Card
      shadow="sm"
      padding="md"
      radius="md"
      withBorder
      className="hover:shadow-lg transition"
    >
      <Flex gap="md">
        {/* Cover */}
        <Image
          src={story.image}
          w={90}
          h={120}
          radius="md"
          fit="cover"
        />

        {/* Content */}
        <Stack gap={6} style={{ flex: 1 }}>
          <Flex justify="space-between" align="center">
            <Text
              component={Link}
              to={`/story/${story.slug}`}
              fw={600}
              size="lg"
              className="hover:text-blue-600"
            >
              {story.title}
            </Text>

            <Badge color={story.isFinish ? "green" : "blue"}>
              {story.isFinish ? "Hoàn thành" : "Đang ra"}
            </Badge>
          </Flex>

          {/* Stats */}
          <Group gap="lg">
            <Group gap={4}>
              <Star size={16} />
              <Text size="sm">{story.stars}</Text>
            </Group>

            <Group gap={4}>
              <Eye size={16} />
              <Text size="sm">{story.views.toLocaleString()}</Text>
            </Group>

            <Group gap={4}>
              <List size={16} />
              <Text size="sm">{story.chapterNumber}</Text>
            </Group>
          </Group>

          {/* Description */}
          <Text
            size="sm"
            c="dimmed"
            lineClamp={3}
          >
            {story.description}
          </Text>
        </Stack>
      </Flex>
    </Card>
  );
}