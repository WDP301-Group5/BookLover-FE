"use client";

import React, { useMemo, useState } from "react";
import {
  Container,
  Title,
  TextInput,
  Button,
  Select,
  Group,
  Card,
  Avatar,
  Text,
  Stack,
  Grid,
  ActionIcon,
  Divider,
  Box,
  Autocomplete,
  Paper,
  Loader,
} from "@mantine/core";
import {
  IconMessageCircle,
  IconSend,
  IconHeart,
  IconSearch,
} from "@tabler/icons-react";
import {
  ChapterContentInput,
  type ContentPayload,
} from "../../components/author/ChapterContentInput";
import RequireLoginModal from "../../components/Modal/RequireLoginModal";
import StoryCard from "../../components/story/StoryCard";
import { showSuccess, showError } from "../../utils/notifications";
import {
  useCreateReview,
  useReviews,
  useReviewStories,
} from "../../hooks/useReview";
import { useUserStore } from "../../stores/useUserStore";
import { useNavigate } from "react-router-dom";

function cleanReviewContent(html: string): string {
  return html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>([\s\S]*?)<\/p>/g, (_, p1) => `<p>${p1.trim()}</p>`)
    .replace(/\s+/g, " ")
    .trim();
}

function getPlainTextLength(html: string) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim().length;
}

function formatTimeAgo(date?: string) {
  if (!date) return "Vừa xong";

  const now = new Date().getTime();
  const target = new Date(date).getTime();

  if (Number.isNaN(target)) return "Vừa xong";

  const diffMs = now - target;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `Cách đây ${diffMinutes} phút`;
  if (diffHours < 24) return `Cách đây ${diffHours} giờ`;
  if (diffDays < 30) return `Cách đây ${diffDays} ngày`;

  return new Date(date).toLocaleDateString("vi-VN");
}

export default function ReviewPage() {
  const user = useUserStore((state: any) => state.user);
  const isLoggedIn = !!user;

  const [sortType, setSortType] = useState<"newest" | "oldest">("newest");
  const [genreFilter, setGenreFilter] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [storySearch, setStorySearch] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState<string>("");
  const [reviewPayload, setReviewPayload] = useState<ContentPayload | null>(
    null,
  );
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const navigate = useNavigate();

  const { data: stories, loading: storiesLoading } = useReviewStories("", 100);

  const {
    data: reviews,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useReviews({
    sort: sortType,
    genre: genreFilter,
    search: searchQuery,
    page: 1,
    limit: 50,
  });

  const { createReview, loading: creatingReview } = useCreateReview();

  const selectedStory = useMemo(
    () => stories.find((story) => story.id === selectedStoryId) || null,
    [stories, selectedStoryId],
  );

  const storyLookup = useMemo(() => {
    const map = new Map<string, (typeof stories)[number]>();

    for (const story of stories) {
      const title = (story.title || "").trim();
      if (!title) continue;
      if (!map.has(title)) {
        map.set(title, story);
      }
    }

    return map;
  }, [stories]);

  const storyOptions = useMemo(
    () =>
      Array.from(storyLookup.keys()).map((title) => ({
        value: title,
        label: title,
      })),
    [storyLookup],
  );

  const genreOptions = useMemo(() => {
    const uniqueGenres = Array.from(
      new Set(
        stories.map((story) => (story.genre || "").trim()).filter(Boolean),
      ),
    );

    return ["Tất cả", ...uniqueGenres];
  }, [stories]);

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      setLoginModalOpened(true);
      return;
    }

    if (!selectedStory) {
      showError("Vui lòng chọn truyện trước khi gửi review!");
      return;
    }

    const html = reviewPayload?.html?.trim() || "";
    const plainLength = getPlainTextLength(html);

    if (!html || plainLength < 50) {
      showError("Review quá ngắn! Vui lòng viết ít nhất 50 ký tự.");
      return;
    }

    try {
      await createReview({
        storyId: selectedStory.id,
        content: html,
      });

      showSuccess(
        "Review của bạn đã được gửi thành công!",
        "Gửi review thành công",
      );

      setReviewPayload(null);
      setSelectedStoryId("");
      setStorySearch("");

      refetchReviews();
    } catch (error: any) {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Gửi review thất bại",
      );
    }
  };

  const charCount = getPlainTextLength(reviewPayload?.html || "");

  return (
    <Container size="xl" py="xl">
      <RequireLoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />

      <Group mb="xl" align="center" gap="md">
        <Paper
          p="xs"
          radius="xl"
          style={{ background: "linear-gradient(45deg, #ff6b00, #ff8c00)" }}
        >
          <IconMessageCircle size={20} color="white" />
        </Paper>
        <Title order={2} fw={600}>
          Review Truyện
        </Title>
      </Group>

      <Card withBorder shadow="xs" radius="md" p="lg" mb="xl">
        <Stack gap="sm">
          <Text fw={600} size="lg">
            Viết review mới
          </Text>

          <Autocomplete
            placeholder="Tìm tên truyện..."
            data={storyOptions}
            value={storySearch}
            onChange={(val) => {
              setStorySearch(val);
              const found = storyLookup.get(val);
              setSelectedStoryId(found?.id || "");
            }}
            rightSection={
              storiesLoading ? <Loader size={16} /> : <IconSearch size={18} />
            }
            size="sm"
          />

          <ChapterContentInput
            onChange={setReviewPayload}
            initialContent=""
            error={
              charCount > 0 && charCount < 50
                ? "Review quá ngắn (ít nhất 50 ký tự)"
                : undefined
            }
          />

          <Group justify="flex-end" mt="xs">
            <Text size="xs" c="dimmed" mr="auto">
              {charCount} ký tự
            </Text>

            <Button
              leftSection={<IconSend size={14} />}
              size="sm"
              color="green"
              onClick={handleSubmitReview}
              loading={creatingReview}
              disabled={creatingReview || !selectedStory || charCount < 50}
            >
              Gửi review
            </Button>
          </Group>
        </Stack>
      </Card>

      <Paper withBorder p="md" radius="md" mb="xl">
        <Group justify="space-between" align="center" gap="lg" wrap="wrap">
          <Text fw={700} size="xl">
            Review nổi bật
          </Text>

          <Group gap="md" align="center">
            <TextInput
              placeholder="Tìm theo tên truyện"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.currentTarget.value)}
              leftSection={<IconSearch size={16} />}
              w={280}
              size="sm"
            />

            <Select
              placeholder="Thể loại"
              data={genreOptions}
              value={genreFilter}
              onChange={(v) => setGenreFilter(v || "Tất cả")}
              w={140}
              size="sm"
            />

            <Select
              placeholder="Sắp xếp"
              data={[
                { value: "newest", label: "Mới nhất" },
                { value: "oldest", label: "Cũ nhất" },
              ]}
              value={sortType}
              onChange={(v) =>
                setSortType((v as "newest" | "oldest") || "newest")
              }
              w={120}
              size="sm"
            />
          </Group>
        </Group>
      </Paper>

      {reviewsLoading ? (
        <Group justify="center" py="xl">
          <Loader />
        </Group>
      ) : reviewsError ? (
        <Text ta="center" c="red" py="xl">
          {reviewsError}
        </Text>
      ) : (
        <Stack gap="xl">
          {reviews.length === 0 ? (
            <Text ta="center" c="dimmed" py="xl">
              Chưa có review phù hợp
            </Text>
          ) : (
            reviews.map((review) => (
              <Card key={review.id} withBorder shadow="xs" radius="md" p="sm">
                <Grid gutter="xs">
                  <Grid.Col span={{ base: 12, md: 9 }}>
                    <Group mb="md" wrap="nowrap">
                      <Avatar src={review.user.avatar} radius="xl" size="lg" />
                      <div>
                        <Text
                          fw={700}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            if (review.user.id) {
                              navigate(`/author-profile/${review.user.id}`);
                            }
                          }}
                        >
                          {review.user.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {formatTimeAgo(review.createdAt)}
                        </Text>
                      </div>
                    </Group>

                    <Box
                      dangerouslySetInnerHTML={{
                        __html: cleanReviewContent(review.content),
                      }}
                      style={{
                        lineHeight: 1.85,
                        fontSize: "15.5px",
                        paddingRight: "8px",
                      }}
                    />

                    <Divider my="md" />

                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="pink" size="lg">
                        <IconHeart size={22} />
                      </ActionIcon>

                      <Text size="sm" c="dimmed">
                        {review.react.like + review.react.love} lượt yêu thích
                      </Text>
                    </Group>
                  </Grid.Col>

                  <Grid.Col
                    span={{ base: 12, md: 3 }}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "flex-start",
                      paddingLeft: 0,
                      paddingRight: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "200px",
                        transform: "scale(0.92)",
                        transformOrigin: "top right",
                        transition: "transform 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(0.96)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(0.92)";
                      }}
                    >
                      <StoryCard
                        story={review.story as any}
                        type="home"
                      />
                    </div>
                  </Grid.Col>
                </Grid>
              </Card>
            ))
          )}
        </Stack>
      )}
    </Container>
  );
}
