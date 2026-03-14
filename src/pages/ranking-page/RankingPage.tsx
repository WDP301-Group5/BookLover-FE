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
import { useMemo, useState } from "react";
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
} from "lucide-react";
import { ShorterNumber } from "../../utils/index.ts";
import {
  useTopAuthorsRanking,
  useTopStoriesRanking,
  useTopUsersRanking,
} from "../../hooks/useRanking";
import type { RankingStoryItem } from "../../services/rankingService";

interface TopStoryCardData {
  rank: number;
  title: string;
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
}

function TopStorySearchCard({ story }: TopStorySearchCardProps) {
  return (
    <div className="w-full cursor-pointer hover:shadow-md transition-shadow duration-200 rounded-sm border border-gray-200">
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
              Thể loại: {story.categories?.join(", ")}
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

interface RankCardProps {
  rank: number;
  avatar?: string;
  name?: string;
  username?: string;
  stats: Array<{ label: string; value: string | number; icon?: any }>;
  extra?: React.ReactNode;
}

function RankCard({ rank, avatar, name, username, stats, extra }: RankCardProps) {
  const isTop3 = rank <= 3;

  return (
    <Card
      withBorder
      radius="md"
      p="md"
      mb="xs"
      style={{
        background: isTop3 ? "linear-gradient(145deg, #fffaf0 0%, #ffffff 100%)" : undefined,
        borderColor: isTop3 ? (rank === 1 ? "#ffc53d" : rank === 2 ? "#d9d9d9" : "#d98c3a") : "#e9ecef",
        boxShadow: isTop3 ? "0 4px 12px rgba(0,0,0,0.08)" : undefined,
      }}
    >
      <Group wrap="nowrap" gap="md" align="center">
        <div
          style={{
            width: rem(48),
            height: rem(48),
            borderRadius: "50%",
            background:
              rank === 1 ? "#ffc53d" : rank === 2 ? "#d9d9d9" : rank === 3 ? "#d98c3a" : "#e9ecef",
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
          <Text fw={600} size="lg" c="dark">
            {name || username}
          </Text>
          {username && (
            <Text size="sm" c="dimmed">
              @{username}
            </Text>
          )}

          <Group gap={rem(16)} mt={rem(2)}>
            {stats.map((s, idx) => (
              <Group key={idx} gap={rem(5)}>
                {s.icon && <s.icon size={rem(15)} stroke={1.8} color="#868e96" />}
                <Text size="sm">
                  <Text component="span" fw={600} c="dark">
                    {typeof s.value === "number" ? s.value.toLocaleString("vi-VN") : s.value}
                  </Text>{" "}
                  {s.label}
                </Text>
              </Group>
            ))}
          </Group>

          {extra && <Group mt={rem(6)}>{extra}</Group>}
        </Stack>
      </Group>
    </Card>
  );
}

export default function RankingPage() {
  const [mainTab, setMainTab] = useState<string | null>("stories");
  const [storySubTab, setStorySubTab] = useState("views");
  const [authorSubTab, setAuthorSubTab] = useState("followers");
  const [userSubTab, setUserSubTab] = useState("comments");

  const {
    data: storyRankingData,
    loading: storiesLoading,
    error: storiesError,
  } = useTopStoriesRanking(storySubTab as "views" | "followers", 15);

  const {
    data: authorRankingData,
    loading: authorsLoading,
    error: authorsError,
  } = useTopAuthorsRanking(authorSubTab as "followers" | "stories", 30);

  const {
    data: userRankingData,
    note: usersNote,
    loading: usersLoading,
    error: usersError,
  } = useTopUsersRanking(userSubTab as "comments" | "spent", 30);

 const mappedStoryCards = useMemo<TopStoryCardData[]>(() => {
  return storyRankingData.map((item: RankingStoryItem) => {
    const mergedCategories = [...(item.genres || []), ...(item.topics || [])];
    const uniqueCategories = Array.from(new Set(mergedCategories)).slice(0, 5);

    return {
      rank: item.rank,
      title: item.title,
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
        <Title order={2}>
          <Flame size={rem(30)} color="#fa5252" /> Bảng Xếp Hạng
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
              onChange={setStorySubTab}
              data={[
                { label: "Đọc nhiều nhất", value: "views" },
                { label: "Theo dõi nhiều nhất", value: "followers" },
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
                <TopStorySearchCard key={`${item.rank}-${item.title}`} story={item} />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="authors">
            <SegmentedControl
              fullWidth
              value={authorSubTab}
              onChange={setAuthorSubTab}
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
                  stats={[
                    { label: "người theo dõi", value: author.followersCount, icon: Users },
                    { label: "truyện", value: author.storiesCount, icon: BookOpen },
                    { label: "tổng lượt xem", value: author.totalViews, icon: Eye },
                  ]}
                />
              ))}
            </Stack>
          </Tabs.Panel>

          <Tabs.Panel value="users">
            <SegmentedControl
              fullWidth
              value={userSubTab}
              onChange={setUserSubTab}
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
                  name={userSubTab === "spent" ? (user.fullName || user.username) : (user.fullName || user.username)}
                  username={user.username}
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