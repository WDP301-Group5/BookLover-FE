import {
  Badge,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Tabs,
  Text,
  Title,
  Group,
  Stack,
  Box,
} from "@mantine/core";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Coins,
  Eye,
  MessageCircle,
  Trophy,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  useTopAuthorsRanking,
  useTopStoriesRanking,
  useTopUsersRanking,
} from "../../../hooks/useRanking";
import type { RankingStoryItem } from "../../../services/rankingService";
import type {
  AuthorSubTab,
  StorySubTab,
  TopStoryCardData,
  UserSubTab,
} from "../../../types/adminRanking";
import OverviewCard from "./OverviewCard";
import RankingSection from "./RankingSection";
import AdminRankCard from "./AdminRankCard";
import AdminStoryRow from "./AdminStoryRow";

export default function AdminRankingPage() {
  const navigate = useNavigate();

  const [mainTab, setMainTab] = useState<string | null>("stories");
  const [storySubTab, setStorySubTab] = useState<StorySubTab>("views");
  const [authorSubTab, setAuthorSubTab] = useState<AuthorSubTab>("followers");
  const [userSubTab, setUserSubTab] = useState<UserSubTab>("comments");

  const {
    data: storyRankingData = [],
    loading: storiesLoading,
    error: storiesError,
  } = useTopStoriesRanking(storySubTab, 10);

  const {
    data: authorRankingData = [],
    loading: authorsLoading,
    error: authorsError,
  } = useTopAuthorsRanking(authorSubTab, 10);

  const {
    data: userRankingData = [],
    note: usersNote,
    loading: usersLoading,
    error: usersError,
  } = useTopUsersRanking(userSubTab, 10);

  const mappedStoryCards = useMemo<TopStoryCardData[]>(() => {
    return storyRankingData.map((item: RankingStoryItem) => {
      const mergedCategories = [...(item.genres ?? []), ...(item.topics ?? [])];
      const uniqueCategories = Array.from(new Set(mergedCategories)).slice(
        0,
        4,
      );

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
    <Box
      p={{ base: "md", md: "xl" }}
      style={{
        width: "100%",
        padding: "0px 10px",
      }}
    >
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <div>
            <Title order={2}>Ranking Management</Title>
            <Text size="sm" c="dimmed" mt={4}>
              Theo dõi các bảng xếp hạng nổi bật của truyện, tác giả và người
              dùng.
            </Text>
          </div>
        </Group>

        <Paper withBorder radius="md">
          <Tabs value={mainTab} onChange={setMainTab} variant="outline">
            <Tabs.List mb="lg">
              <Tabs.Tab value="stories" leftSection={<BookOpen size={16} />}>
                Xếp hạng truyện
              </Tabs.Tab>

              <Tabs.Tab value="authors" leftSection={<User size={16} />}>
                Xếp hạng tác giả
              </Tabs.Tab>

              <Tabs.Tab value="users" leftSection={<Users size={16} />}>
                Xếp hạng người dùng
              </Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="stories">
              <SegmentedControl
                fullWidth
                value={storySubTab}
                onChange={(value) => setStorySubTab(value as StorySubTab)}
                data={[
                  { label: "Xem nhiều nhất", value: "views" },
                  { label: "Theo dõi nhiều nhất", value: "followers" },
                ]}
                mb="lg"
              />

              <RankingSection loading={storiesLoading} error={storiesError}>
                {mappedStoryCards.map((item) => (
                  <AdminStoryRow
                    key={`${item.rank}-${item.slug}`}
                    story={item}
                    onClick={() => navigate(`/admin/stories/${item.slug}`)}
                  />
                ))}
              </RankingSection>
            </Tabs.Panel>

            <Tabs.Panel value="authors">
              <SegmentedControl
                fullWidth
                value={authorSubTab}
                onChange={(value) => setAuthorSubTab(value as AuthorSubTab)}
                data={[
                  { label: "Được theo dõi nhiều nhất", value: "followers" },
                  { label: "Có nhiều truyện nhất", value: "stories" },
                ]}
                mb="lg"
              />

              <RankingSection loading={authorsLoading} error={authorsError}>
                {authorRankingData.map((author) => (
                  <AdminRankCard
                    key={author.id || author.rank}
                    rank={author.rank}
                    avatar={author.avatarUrl}
                    name={author.penName}
                    username={author.username}
                    onClick={() => navigate(`/admin/authors/${author.id}`)}
                    stats={[
                      {
                        label: "followers",
                        value: author.followersCount,
                        icon: Users,
                      },
                      {
                        label: "stories",
                        value: author.storiesCount,
                        icon: BookOpen,
                      },
                      {
                        label: "views",
                        value: author.totalViews,
                        icon: Eye,
                      },
                    ]}
                  />
                ))}
              </RankingSection>
            </Tabs.Panel>

            <Tabs.Panel value="users">
              <SegmentedControl
                fullWidth
                value={userSubTab}
                onChange={(value) => setUserSubTab(value as UserSubTab)}
                data={[
                  { label: "Bình luận nhiều nhất", value: "comments" },
                  { label: "Chi tiêu nhiều nhất", value: "spent" },
                ]}
                mb="lg"
              />

              <RankingSection
                loading={usersLoading}
                error={usersError}
                note={usersNote}
              >
                {userRankingData.map((user) => (
                  <AdminRankCard
                    key={user.id || user.rank}
                    rank={user.rank}
                    avatar={user.avatarUrl}
                    name={user.fullName || user.username}
                    username={user.username}
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    stats={[
                      ...(userSubTab === "comments"
                        ? [
                            {
                              label: "comments",
                              value: user.totalComments || 0,
                              icon: MessageCircle,
                            },
                          ]
                        : []),
                      ...(userSubTab === "spent"
                        ? [
                            {
                              label: "spent",
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
              </RankingSection>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Box>
  );
}
