import { useMemo, useState } from "react";
import {
  ActionIcon,
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  Loader,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import {
  IconHeart,
  IconMessageCircle,
  IconSearch,
  IconSend,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import { ChapterContentInput, type ContentPayload } from "../../components/author/ChapterContentInput";
import RequireLoginModal from "../../components/Modal/RequireLoginModal";
import StoryCard from "../../components/story/StoryCard";
import { useCreateReview, useReviews, useReviewStories } from "../../hooks/useReview";
import { useUserStore } from "../../stores/useUserStore";
import { showError, showSuccess } from "../../utils/notifications";

function cleanReviewContent(html: string): string {
  return html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>([\s\S]*?)<\/p>/g, (_, p1) => `<p>${String(p1).trim()}</p>`)
    .replace(/\s+/g, " ")
    .trim();
}

function getPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function getPlainTextLength(html: string): number {
  return getPlainText(html).length;
}

function formatTimeAgo(date?: string) {
  if (!date) return "Vừa xong";

  const now = Date.now();
  const target = new Date(date).getTime();

  if (Number.isNaN(target)) return "Vừa xong";

  const diffMs = now - target;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 1) return "Vừa xong";
  if (diffMinutes < 60) return `${diffMinutes} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;

  return new Date(date).toLocaleDateString("vi-VN");
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const user = useUserStore((state: any) => state.user);
  const isLoggedIn = !!user;

  const [loginModalOpened, setLoginModalOpened] = useState(false);

  const [sortType, setSortType] = useState<"newest" | "oldest">("newest");
  const [genreFilter, setGenreFilter] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const [storySearch, setStorySearch] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState("");

  const [reviewPayload, setReviewPayload] = useState<ContentPayload | null>(null);

  const [page, setPage] = useState(1);
  const limit = 5;

  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});

  const [editorKey, setEditorKey] = useState(0);

  const {
    data: stories,
    loading: storiesLoading,
  } = useReviewStories("", 100);

  const {
    data: reviews,
    total,
    loading: reviewsLoading,
    error: reviewsError,
    refetch: refetchReviews,
  } = useReviews({
    sort: sortType,
    genre: genreFilter,
    search: searchQuery.trim(),
    page,
    limit,
  });

  const { createReview, loading: creatingReview } = useCreateReview();

  const storyLookup = useMemo(() => {
    const map = new Map<string, (typeof stories)[number]>();

    for (const story of stories) {
      const title = (story.title || "").trim();
      if (!title) continue;

      if (!map.has(title.toLowerCase())) {
        map.set(title.toLowerCase(), story);
      }
    }

    return map;
  }, [stories]);

  const storyOptions = useMemo(() => {
    return stories.map((story) => ({
      value: story.title,
      label: story.title,
    }));
  }, [stories]);

  const selectedStory = useMemo(() => {
    return stories.find((story) => story.id === selectedStoryId) || null;
  }, [stories, selectedStoryId]);

  const genreOptions = useMemo(() => {
    const uniqueGenres = Array.from(
      new Set(
        stories
          .map((story) => (story.genre || "").trim())
          .filter(Boolean),
      ),
    );

    return ["Tất cả", ...uniqueGenres];
  }, [stories]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const plainCharCount = getPlainTextLength(reviewPayload?.html || "");

  const handleStoryChange = (value: string) => {
    setStorySearch(value);

    const found = storyLookup.get(value.trim().toLowerCase());
    setSelectedStoryId(found?.id || "");
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn) {
      setLoginModalOpened(true);
      return;
    }

    if (!storySearch.trim()) {
      showError("Vui lòng nhập tên truyện trước khi gửi review");
      return;
    }

    if (!selectedStoryId || !selectedStory) {
      showError("Vui lòng chọn đúng truyện từ danh sách gợi ý");
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

      showSuccess("Review của bạn đã được gửi thành công!", "Thành công");

      setReviewPayload(null);
setSelectedStoryId("");
setStorySearch("");
setPage(1);
setEditorKey((prev) => prev + 1);

refetchReviews();
    } catch (error: any) {
      showError(
        error?.response?.data?.message ||
          error?.message ||
          "Gửi review thất bại",
      );
    }
  };

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

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
          style={{
            background: "linear-gradient(45deg, #ff6b00, #ff8c00)",
          }}
        >
          <IconMessageCircle size={20} color="white" />
        </Paper>

        <Title order={2} fw={700}>
          Review Truyện
        </Title>
      </Group>

      <Card withBorder shadow="xs" radius="md" p="lg" mb="xl">
        <Stack gap="sm">
          <Text fw={600} size="lg">
            Viết review mới
          </Text>

          <Autocomplete
            placeholder="Nhập tên truyện để review..."
            data={storyOptions}
            value={storySearch}
            onChange={handleStoryChange}
            onBlur={() => {
              const found = storyLookup.get(storySearch.trim().toLowerCase());
              setSelectedStoryId(found?.id || "");
            }}
            rightSection={
              storiesLoading ? <Loader size={16} /> : <IconSearch size={16} />
            }
          />

          {storySearch.trim() && !selectedStoryId && (
            <Text size="sm" c="red">
              Vui lòng chọn truyện hợp lệ từ danh sách gợi ý.
            </Text>
          )}

          {selectedStory && (
            <Text size="sm" c="dimmed">
              Đã chọn truyện: <b>{selectedStory.title}</b>
            </Text>
          )}

          <ChapterContentInput
  key={editorKey}
  onChange={setReviewPayload}
  initialContent=""
  error={
    plainCharCount > 0 && plainCharCount < 50
      ? "Review phải có ít nhất 50 ký tự"
      : undefined
  }
/>

          <Group justify="space-between" mt="xs">
            <Text size="sm" c={plainCharCount < 50 ? "red" : "dimmed"}>
              {plainCharCount}/50 ký tự tối thiểu
            </Text>

            <Button
              leftSection={<IconSend size={16} />}
              onClick={handleSubmitReview}
              loading={creatingReview}
            >
              Gửi review
            </Button>
          </Group>
        </Stack>
      </Card>

      <Paper withBorder p="md" radius="md" mb="xl">
        <Group justify="space-between" align="center" gap="md" wrap="wrap">
          <Text fw={700} size="xl">
            Danh sách review
          </Text>

          <Group gap="md" wrap="wrap">
            <TextInput
              placeholder="Tìm theo tên truyện hoặc nội dung review"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.currentTarget.value);
                setPage(1);
              }}
              leftSection={<IconSearch size={16} />}
              w={300}
            />

            <Select
              placeholder="Thể loại"
              data={genreOptions}
              value={genreFilter}
              onChange={(value) => {
                setGenreFilter(value || "Tất cả");
                setPage(1);
              }}
              w={160}
            />

            <Select
              placeholder="Sắp xếp"
              data={[
                { value: "newest", label: "Mới nhất" },
                { value: "oldest", label: "Cũ nhất" },
              ]}
              value={sortType}
              onChange={(value) => {
                setSortType((value as "newest" | "oldest") || "newest");
                setPage(1);
              }}
              w={140}
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
      ) : reviews.length === 0 ? (
        <Text ta="center" c="dimmed" py="xl">
          Chưa có review phù hợp
        </Text>
      ) : (
        <Stack gap="xl">
          {reviews.map((review) => {
            const cleanedHtml = cleanReviewContent(review.content);
            const plainLength = getPlainTextLength(cleanedHtml);
            const isExpanded = !!expandedReviews[review.id];
            const shouldShowToggle = plainLength > 220;

            return (
              <Card key={review.id} withBorder shadow="xs" radius="md" p="sm">
                <Grid gutter="md">
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

                    <Box>
                      <Box
                        dangerouslySetInnerHTML={{ __html: cleanedHtml }}
                        style={{
                          lineHeight: 1.8,
                          fontSize: "15px",
                          wordBreak: "break-word",
                          display: isExpanded ? "block" : "-webkit-box",
                          WebkitLineClamp: isExpanded ? "unset" : 8,
                          WebkitBoxOrient: isExpanded ? "unset" : "vertical",
                          overflow: "hidden",
                        }}
                      />

                      {shouldShowToggle && (
                        <Text
                          mt="xs"
                          size="sm"
                          fw={600}
                          c="blue"
                          style={{ cursor: "pointer", width: "fit-content" }}
                          onClick={() => toggleExpandReview(review.id)}
                        >
                          {isExpanded ? "Thu gọn" : "Xem thêm"}
                        </Text>
                      )}
                    </Box>

                    <Divider my="md" />

                    <Group gap="xs">
                      <ActionIcon variant="subtle" color="pink" size="lg">
                        <IconHeart size={20} />
                      </ActionIcon>

                      <Text size="sm" c="dimmed">
                        {review.react.like + review.react.love} lượt yêu thích
                      </Text>
                    </Group>
                  </Grid.Col>

                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <div
                      style={{
                        width: "100%",
                        maxWidth: "210px",
                        marginLeft: "auto",
                      }}
                    >
                      <StoryCard story={review.story as any} type="home" />
                    </div>
                  </Grid.Col>
                </Grid>
              </Card>
            );
          })}

          {totalPages > 1 && (
            <Group justify="center">
              <Pagination value={page} onChange={setPage} total={totalPages} />
            </Group>
          )}
        </Stack>
      )}
    </Container>
  );
}