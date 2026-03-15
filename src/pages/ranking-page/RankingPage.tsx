import {
  Container,
  Title,
  Tabs,
  Paper,
  Group,
  Text,
  Avatar,
  Stack,
  Badge,
  Card,
  Image,
  Divider,
  rem,
  SegmentedControl,
} from "@mantine/core";
import { useMemo, useState, type ReactNode } from "react";
import {
  BookOpen,
  User,
  Users,
  Flame,
  Eye,
  Star,
  Crown,
  Coins,
  UserPlus,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { ShorterNumber } from "../../utils/index.ts";
import {
  useTopAuthorsRanking,
  useTopStoriesRanking,
  useTopUsersRanking,
} from "../../hooks/useRanking";
import type { RankingStoryItem } from "../../services/rankingService";

type StorySubTab = "views" | "followers";
type AuthorSubTab = "followers" | "stories";
type UserSubTab = "comments" | "spent";

interface TopStoryCardData {
  rank: number;
  title: string;
  slug: string;
  coverUrl: string;
  author: string;
  categories: string[];
  views: number;
  followers: number;
  rates: number;
  chapters: number;
  description: string;
  isPremium: boolean;
}

interface TopStorySearchCardProps {
  story: TopStoryCardData;
  onClick?: () => void;
}

function TopStorySearchCard({ story, onClick }: TopStorySearchCardProps) {
  return (
    <div
      className="w-full cursor-pointer rounded-sm border border-gray-200 transition-shadow duration-200 hover:shadow-md"
      onClick={onClick}
    >
      <Card p="sm" radius="sm">
        <Group wrap="nowrap" align="flex-start" gap="sm">
          <div
            className="absolute top-2 left-2 z-10 flex items-center justify-center shadow-sm"
            style={{
              width: rem(32),
              height: rem(32),
              borderRadius: "50%",
              background:
                story.rank === 1
                  ? "#ffd43b"
                  : story.rank === 2
                    ? "#ced4da"
                    : story.rank === 3
                      ? "#cd7f32"
                      : "#4dabf7",
              color: story.rank <= 3 ? "#1a1a1a" : "white",
              fontWeight: 700,
              fontSize: story.rank <= 3 ? rem(16) : rem(14),
            }}
          >
            {story.rank <= 3 ? <Crown size={rem(18)} /> : story.rank}
          </div>

          <div className="relative w-[110px] flex-shrink-0">
            <Image
              src={story.coverUrl}
              alt={story.title}
              radius="sm"
              className="aspect-[3/4] object-cover"
            />
            {story.isPremium && (
              <Badge
                color="yellow"
                variant="filled"
                size="xs"
                radius="xl"
                className="absolute top-1 right-1 z-10"
              >
                Premium
              </Badge>
            )}
          </div>

          <Stack gap="xs" style={{ flex: 1 }}>
            <Text fw={700} size="sm" lineClamp={2}>
              {story.title}
            </Text>

            <Text size="xs" fw={500} c="dimmed">
              Tác giả: {story.author}
            </Text>

            <Text size="xs" c="dimmed" lineClamp={1}>
              Thể loại: {story.categories.join(", ")}
            </Text>

            <Group gap={0} mt="xs" grow>
              <Stack align="center" gap={2}>
                <Group gap={4}>
                  <Eye size={rem(12)} />
                  <Text size="xs">Xem</Text>
                </Group>
                <Text fw={600} size="xs">
                  {ShorterNumber(story.views)}
                </Text>
              </Stack>

              <Divider orientation="vertical" />

              <Stack align="center" gap={2}>
                <Group gap={4}>
                  <UserPlus size={rem(12)} />
                  <Text size="xs">Theo dõi</Text>
                </Group>
                <Text fw={600} size="xs">
                  {ShorterNumber(story.followers)}
                </Text>
              </Stack>

              <Divider orientation="vertical" />

              <Stack align="center" gap={2}>
                <Group gap={4}>
                  <Star size={rem(12)} />
                  <Text size="xs">Đánh giá</Text>
                </Group>
                <Text fw={600} size="xs">
                  {ShorterNumber(story.rates)}
                </Text>
              </Stack>

              <Divider orientation="vertical" />

              <Stack align="center" gap={2}>
                <Group gap={4}>
                  <BookOpen size={rem(12)} />
                  <Text size="xs">Chương</Text>
                </Group>
                <Text fw={600} size="xs">
                  {ShorterNumber(story.chapters)}
                </Text>
              </Stack>
            </Group>

            <Text size="xs" lineClamp={2} mt="xs" c="gray.6">
              {story.description}
            </Text>
          </Stack>
        </Group>
      </Card>
    </div>
  );
}

interface RankStat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
}

interface RankCardProps {
  rank: number;
  avatar?: string;
  name?: string;
  username?: string;
  stats: RankStat[];
  extra?: ReactNode;
  onClickName?: () => void;
}

function RankCard({
  rank,
  avatar,
  name,
  username,
  stats,
  extra,
  onClickName,
}: RankCardProps) {
  return (
    <Card withBorder radius="md" p="md" mb="xs">
      <Group wrap="nowrap" gap="md" align="center">
        <div
          style={{
            width: rem(48),
            height: rem(48),
            borderRadius: "50%",
            background:
              rank === 1
                ? "#ffc53d"
                : rank === 2
                  ? "#d9d9d9"
                  : rank === 3
                    ? "#d98c3a"
                    : "#e9ecef",
            color: rank <= 3 ? "#1a1a1a" : "#495057",
            fontWeight: 700,
            fontSize: rank <= 3 ? rem(24) : rem(18),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {rank <= 3 ? <Crown size={rank === 1 ? 28 : 24} /> : rank}
        </div>

        <Avatar src={avatar} size={64} radius="xl" />

        <Stack gap={rem(4)} style={{ flex: 1 }}>
          <Text
            fw={600}
            size="lg"
            onClick={onClickName}
            style={{
              cursor: onClickName ? "pointer" : "default",
              width: "fit-content",
            }}
          >
            {name ?? username}
          </Text>

          {username && (
            <Text
              size="sm"
              c="dimmed"
              onClick={onClickName}
              style={{
                cursor: onClickName ? "pointer" : "default",
                width: "fit-content",
              }}
            >
              @{username}
            </Text>
          )}

          <Group gap={rem(16)} mt={rem(2)}>
            {stats.map((stat, index) => {
              const Icon = stat.icon;

              return (
                <Group key={`${stat.label}-${index}`} gap={rem(5)}>
                  {Icon && (
                    <Icon size={rem(15)} strokeWidth={1.8} color="#868e96" />
                  )}
                  <Text size="sm">
                    <Text component="span" fw={600}>
                      {typeof stat.value === "number"
                        ? stat.value.toLocaleString("vi-VN")
                        : stat.value}
                    </Text>{" "}
                    {stat.label}
                  </Text>
                </Group>
              );
            })}
          </Group>

          {extra && <Group mt={rem(6)}>{extra}</Group>}
        </Stack>
      </Group>
    </Card>
  );
}

export default function RankingPage() {
  const [mainTab, setMainTab] = useState<string | null>("stories");
  const [storySubTab, setStorySubTab] = useState<StorySubTab>("views");
  const [authorSubTab, setAuthorSubTab] = useState<AuthorSubTab>("followers");
  const [userSubTab, setUserSubTab] = useState<UserSubTab>("comments");

  const {
    data: storyRankingData = [],
    loading: storiesLoading,
    error: storiesError,
  } = useTopStoriesRanking(storySubTab, 15);

  const {
    data: authorRankingData = [],
    loading: authorsLoading,
    error: authorsError,
  } = useTopAuthorsRanking(authorSubTab, 30);

  const {
    data: userRankingData = [],
    note: usersNote,
    loading: usersLoading,
    error: usersError,
  } = useTopUsersRanking(userSubTab, 30);

  const navigate = useNavigate();

  const mappedStoryCards = useMemo<TopStoryCardData[]>(() => {
    return storyRankingData.map((item: RankingStoryItem) => {
      const mergedCategories = [...(item.genres ?? []), ...(item.topics ?? [])];
      const uniqueCategories = Array.from(new Set(mergedCategories)).slice(0, 5);

      return {
        rank: item.rank,
        title: item.title,
        slug: item.slug,
        coverUrl: item.image,
        author: item.author,
        categories: uniqueCategories,
        views: item.views,
        followers: item.followers,
        rates: item.rates,
        chapters: item.chapters,
        description: item.description,
        isPremium: item.isPremium,
      };
    });
  }, [storyRankingData]);

  return (
    <Container size="xl" py="xl">
      <Group justify="apart" align="center" mb="xl">
        <Title
          order={3}
          style={{ display: "inline-flex", alignItems: "center", gap: rem(8) }}
        >
          <Flame size={rem(30)} color="#fa5252" />
          Bảng Xếp Hạng
        </Title>
      </Group>

      <Paper withBorder radius="md" p="lg" shadow="sm">
        <Tabs value={mainTab} onChange={setMainTab} variant="pills" color="blue">
          <Tabs.List grow mb="xl">
            <Tabs.Tab value="stories" leftSection={<BookOpen size={18} />}>
              Top Truyện
            </Tabs.Tab>
            <Tabs.Tab value="authors" leftSection={<User size={18} />}>
              Top Tác Giả
            </Tabs.Tab>
            <Tabs.Tab value="users" leftSection={<Users size={18} />}>
              Top Người Đọc
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="stories">
            <SegmentedControl
              fullWidth
              value={storySubTab}
              onChange={(value) => setStorySubTab(value as StorySubTab)}
              data={[
                { label: "Đọc nhiều nhất", value: "views" },
                { label: "Được theo dõi nhiều nhất", value: "followers" },
              ]}
              mb="lg"
            />

            {storiesLoading && (
              <Text size="sm" c="dimmed" mb="md">
                Đang tải bảng xếp hạng truyện...
              </Text>
            )}

            {storiesError && (
              <Text size="sm" c="red" mb="md">
                {storiesError}
              </Text>
            )}

            <Stack gap="md">
              {mappedStoryCards.map((item) => (
                <TopStorySearchCard
                  key={`${item.rank}-${item.slug}`}
                  story={item}
                  onClick={() => navigate(`/story/${item.slug}`)}
                />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="authors">
            <SegmentedControl
              fullWidth
              value={authorSubTab}
              onChange={(value) => setAuthorSubTab(value as AuthorSubTab)}
              data={[
                { label: "Nhiều người follow nhất", value: "followers" },
                { label: "Viết nhiều truyện nhất", value: "stories" },
              ]}
              mb="lg"
            />

            {authorsLoading && (
              <Text size="sm" c="dimmed" mb="md">
                Đang tải bảng xếp hạng tác giả...
              </Text>
            )}

            {authorsError && (
              <Text size="sm" c="red" mb="md">
                {authorsError}
              </Text>
            )}

            <Stack gap="xs">
              {authorRankingData.map((author) => (
                <RankCard
                  key={author.id || author.rank}
                  rank={author.rank}
                  avatar={author.avatarUrl}
                  name={author.penName}
                  username={author.username}
                  onClickName={() => navigate(`/author-profile/${author.id}`)}
                  stats={[
                    {
                      label: "người theo dõi",
                      value: author.followersCount,
                      icon: Users,
                    },
                    {
                      label: "truyện",
                      value: author.storiesCount,
                      icon: BookOpen,
                    },
                    {
                      label: "tổng lượt xem",
                      value: author.totalViews,
                      icon: Eye,
                    },
                  ]}
                />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="users">
            <SegmentedControl
              fullWidth
              value={userSubTab}
              onChange={(value) => setUserSubTab(value as UserSubTab)}
              data={[
                { label: "Bình luận nhiều nhất", value: "comments" },
                { label: "Nạp tiền nhiều nhất", value: "spent" },
              ]}
              mb="lg"
            />

            {usersLoading && (
              <Text size="sm" c="dimmed" mb="md">
                Đang tải bảng xếp hạng người đọc...
              </Text>
            )}

            {usersError && (
              <Text size="sm" c="red" mb="md">
                {usersError}
              </Text>
            )}

            {usersNote && (
              <Text size="sm" c="dimmed" mb="md">
                {usersNote}
              </Text>
            )}

            <Stack gap="xs">
              {userRankingData.map((user) => (
                <RankCard
                  key={user.id || user.rank}
                  rank={user.rank}
                  avatar={user.avatarUrl}
                  name={user.fullName || user.username}
                  username={user.username}
                  onClickName={() => navigate(`/author-profile/${user.id}`)}
                  stats={[
                    ...(userSubTab === "comments"
                      ? [
                          {
                            label: "bình luận",
                            value: user.totalComments || 0,
                            icon: MessageCircle,
                          },
                        ]
                      : []),
                    ...(userSubTab === "spent"
                      ? [
                          {
                            label: "đã nạp",
                            value: `${user.totalSpent.toLocaleString("vi-VN")} ₫`,
                            icon: Coins,
                          },
                        ]
                      : []),
                  ]}
                  extra={
                    userSubTab === "spent" && user.totalSpent > 5000000 ? (
                      <Badge color="violet" variant="light" size="sm">
                        VIP Donor
                      </Badge>
                    ) : undefined
                  }
                />
              ))}
            </Stack>
          </Tabs.Panel>
        </Tabs>
      </Paper>
    </Container>
  );
}