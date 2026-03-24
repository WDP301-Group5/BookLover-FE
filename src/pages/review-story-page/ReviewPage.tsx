import { useEffect, useMemo, useRef, useState } from "react";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Group,
  HoverCard,
  Loader,
  Pagination,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
  Title,
  Popover,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartFilled,
  IconMessageCircle,
  IconMoodAngry,
  IconMoodSad,
  IconMoodSmile,
  IconMoodSurprised,
  IconSearch,
  IconSend,
  IconThumbUp,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

import {
  ChapterContentInput,
  type ContentPayload,
} from "../../components/author/ChapterContentInput";
import RequireLoginModal from "../../components/Modal/RequireLoginModal";
import StoryCard from "../../components/story/StoryCard";
import {
  useCreateReview,
  useReviews,
  useReviewStories,
} from "../../hooks/useReview";
import {
  useReactReview,
  useUserReactReviews,
} from "../../hooks/useReactReview";
import type { ReactReviewTypeValue } from "../../services/ReactReviewService";
import { useUserStore } from "../../stores/useUserStore";
import { showError, showSuccess } from "../../utils/notifications";

type ReviewReactCount = Record<string, number>;

function cleanReviewContent(html: string): string {
  return html
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/<p>([\s\S]*?)<\/p>/g, (_, p1) => `<p>${String(p1).trim()}</p>`)
    .replace(/\s+/g, " ")
    .trim();
}

function getPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function getReactColor(react?: ReactReviewTypeValue) {
  switch (react) {
    case "like":
      return "blue";
    case "love":
      return "pink";
    case "haha":
      return "yellow";
    case "wow":
      return "orange";
    case "sad":
      return "cyan";
    case "angry":
      return "red";
    default:
      return "gray";
  }
}

function totalReact(react: ReviewReactCount): number {
  return Object.values(react || {}).reduce(
    (sum, value) => sum + Number(value || 0),
    0,
  );
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const user = useUserStore((state: { user: unknown }) => state.user);
  const isLoggedIn = !!user;

  const [loginModalOpened, setLoginModalOpened] = useState(false);

  const [sortType, setSortType] = useState<"newest" | "oldest">("newest");
  const [genreFilter, setGenreFilter] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");

  const [storySearch, setStorySearch] = useState("");
  const [selectedStoryId, setSelectedStoryId] = useState("");

  const [reviewPayload, setReviewPayload] = useState<ContentPayload | null>(
    null,
  );

  const [page, setPage] = useState(1);
  const limit = 5;

  const [expandedReviews, setExpandedReviews] = useState<
    Record<string, boolean>
  >({});
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [showToggleMap, setShowToggleMap] = useState<Record<string, boolean>>(
    {},
  );
  const [editorKey, setEditorKey] = useState(0);

  const [localReactMap, setLocalReactMap] = useState<
    Record<string, ReviewReactCount>
  >({});
  const [openedReactCountId, setOpenedReactCountId] = useState<string | null>(
    null,
  );

  const { data: stories = [], loading: storiesLoading } = useReviewStories(
    "",
    100,
  );

  const {
    data: reviews = [],
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

  const reviewIds = reviews.map((review) => review.id).filter(Boolean);

  const { data: userReactReviews = [], refetch: refetchUserReactReviews } =
    useUserReactReviews(isLoggedIn ? reviewIds : []);

  const { mutateAsync: submitReactReview } = useReactReview();
  const { createReview, loading: creatingReview } = useCreateReview();

  const userReactMap = useMemo(() => {
    return new Map<string, ReactReviewTypeValue>(
      (userReactReviews || []).map(
        (item: { reviewId: string; react: ReactReviewTypeValue }) => [
          String(item.reviewId),
          item.react,
        ],
      ),
    );
  }, [userReactReviews]);

  useEffect(() => {
    const nextMap: Record<string, ReviewReactCount> = {};

    reviews.forEach((review) => {
      nextMap[review.id] = { ...(review.react || {}) };
    });

    setLocalReactMap(nextMap);
  }, [reviews]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextMap: Record<string, boolean> = {};

      reviews.forEach((review) => {
        const el = contentRefs.current[review.id];
        if (!el) {
          nextMap[review.id] = false;
          return;
        }

        nextMap[review.id] = el.scrollHeight > el.clientHeight + 1;
      });

      setShowToggleMap(nextMap);
    }, 0);

    return () => clearTimeout(timer);
  }, [reviews, page]);

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
        stories.map((story) => (story.genre || "").trim()).filter(Boolean),
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

  const toggleExpandReview = (reviewId: string) => {
    setExpandedReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const safeDecreaseReactCount = (
    reactObj: ReviewReactCount,
    reactKey: ReactReviewTypeValue,
  ): ReviewReactCount => {
    const currentValue = Number(reactObj?.[reactKey] || 0);

    return {
      ...reactObj,
      [reactKey]: Math.max(0, currentValue - 1),
    };
  };

  const safeIncreaseReactCount = (
    reactObj: ReviewReactCount,
    reactKey: ReactReviewTypeValue,
  ): ReviewReactCount => {
    const currentValue = Number(reactObj?.[reactKey] || 0);

    return {
      ...reactObj,
      [reactKey]: currentValue + 1,
    };
  };

  const handleRemoveReactReview = async (reviewId: string) => {
    if (!isLoggedIn) {
      setLoginModalOpened(true);
      return;
    }

    const currentReact = userReactMap.get(reviewId);
    const previousReactState = { ...(localReactMap[reviewId] || {}) };

    if (!currentReact || currentReact === "unlike") return;

    setLocalReactMap((prev) => {
      let updated = { ...(prev[reviewId] || {}) };
      updated = safeDecreaseReactCount(updated, currentReact);

      return {
        ...prev,
        [reviewId]: updated,
      };
    });

    try {
      await submitReactReview({
        reviewId,
        react: "unlike",
      });

      await refetchUserReactReviews();
    } catch (error: unknown) {
      setLocalReactMap((prev) => ({
        ...prev,
        [reviewId]: previousReactState,
      }));

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      console.error("Remove react review failed:", err);
      showError(
        err?.response?.data?.message || err?.message || "Bỏ cảm xúc thất bại",
      );
    }
  };

  const handleReactReview = async (
    reviewId: string,
    react: Exclude<ReactReviewTypeValue, "unlike">,
  ) => {
    if (!isLoggedIn) {
      setLoginModalOpened(true);
      return;
    }

    const currentReact = userReactMap.get(reviewId);
    const nextReact: ReactReviewTypeValue =
      currentReact === react ? "unlike" : react;
    const previousReactState = { ...(localReactMap[reviewId] || {}) };

    setLocalReactMap((prev) => {
      let updated = { ...(prev[reviewId] || {}) };

      if (currentReact && currentReact !== "unlike") {
        updated = safeDecreaseReactCount(updated, currentReact);
      }

      if (nextReact !== "unlike") {
        updated = safeIncreaseReactCount(updated, nextReact);
      }

      return {
        ...prev,
        [reviewId]: updated,
      };
    });

    try {
      await submitReactReview({
        reviewId,
        react: nextReact,
      });

      await refetchUserReactReviews();
    } catch (error: unknown) {
      setLocalReactMap((prev) => ({
        ...prev,
        [reviewId]: previousReactState,
      }));

      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      console.error("React review failed:", err);
      showError(
        err?.response?.data?.message ||
          err?.message ||
          "Thả cảm xúc review thất bại",
      );
    }
  };

  const getReactDisplay = (react?: ReactReviewTypeValue) => {
    switch (react) {
      case "like":
        return {
          label: "Thích",
          icon: <IconThumbUp size={16} className="text-blue-500" />,
        };
      case "love":
        return {
          label: "Yêu thích",
          icon: <IconHeartFilled size={16} className="text-pink-500" />,
        };
      case "haha":
        return {
          label: "Haha",
          icon: <IconMoodSmile size={16} className="text-yellow-500" />,
        };
      case "wow":
        return {
          label: "Wow",
          icon: <IconMoodSurprised size={16} className="text-orange-500" />,
        };
      case "sad":
        return {
          label: "Buồn",
          icon: <IconMoodSad size={16} className="text-blue-400" />,
        };
      case "angry":
        return {
          label: "Phẫn nộ",
          icon: <IconMoodAngry size={16} className="text-red-600" />,
        };
      default:
        return {
          label: "Thả cảm xúc",
          icon: <IconHeart size={16} />,
        };
    }
  };

  const getReactionStats = (react: ReviewReactCount) => [
    {
      key: "like",
      icon: <IconThumbUp size={16} className="text-blue-500" />,
      label: "Thích",
      count: react?.like || 0,
    },
    {
      key: "love",
      icon: <IconHeartFilled size={16} className="text-pink-500" />,
      label: "Yêu thích",
      count: react?.love || 0,
    },
    {
      key: "haha",
      icon: <IconMoodSmile size={16} className="text-yellow-500" />,
      label: "Haha",
      count: react?.haha || 0,
    },
    {
      key: "wow",
      icon: <IconMoodSurprised size={16} className="text-orange-500" />,
      label: "Wow",
      count: react?.wow || 0,
    },
    {
      key: "sad",
      icon: <IconMoodSad size={16} className="text-blue-400" />,
      label: "Buồn",
      count: react?.sad || 0,
    },
    {
      key: "angry",
      icon: <IconMoodAngry size={16} className="text-red-600" />,
      label: "Phẫn nộ",
      count: react?.angry || 0,
    },
  ];

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
    } catch (error: unknown) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      showError(
        err?.response?.data?.message || err?.message || "Gửi review thất bại",
      );
    }
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
            const isExpanded = !!expandedReviews[review.id];
            const shouldShowToggle = !!showToggleMap[review.id];
            const currentReact = userReactMap.get(review.id);
            const currentReactDisplay = getReactDisplay(currentReact);
            const currentReactCount =
              localReactMap[review.id] || review.react || {};

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
                        ref={(el) => {
                          contentRefs.current[review.id] = el;
                        }}
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

                    <Group
                      justify="space-between"
                      align="center"
                      wrap="wrap"
                      gap="sm"
                    >
                      <HoverCard
                        width="auto"
                        shadow="lg"
                        openDelay={100}
                        closeDelay={100}
                        position="top-start"
                      >
                        <HoverCard.Target>
                          <Button
                            variant="subtle"
                            radius="xl"
                            size="sm"
                            leftSection={currentReactDisplay.icon}
                            color={getReactColor(currentReact)}
                            onClick={() => {
                              if (currentReact && currentReact !== "unlike") {
                                handleRemoveReactReview(review.id);
                              }
                            }}
                          >
                            {currentReactDisplay.label}
                          </Button>
                        </HoverCard.Target>

                        <HoverCard.Dropdown
                          p={6}
                          className="rounded-xl border border-gray-200 bg-white shadow-lg"
                        >
                          <Group gap={6}>
                            <Button
                              variant="outline"
                              radius="xl"
                              size="xs"
                              className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                              onClick={() =>
                                handleReactReview(review.id, "like")
                              }
                            >
                              <IconThumbUp
                                size={18}
                                className="text-blue-500"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              radius="xl"
                              size="xs"
                              className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                              onClick={() =>
                                handleReactReview(review.id, "love")
                              }
                            >
                              <IconHeartFilled
                                size={18}
                                className="text-pink-500"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              radius="xl"
                              size="xs"
                              className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                              onClick={() =>
                                handleReactReview(review.id, "haha")
                              }
                            >
                              <IconMoodSmile
                                size={18}
                                className="text-yellow-500"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              radius="xl"
                              size="xs"
                              className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                              onClick={() =>
                                handleReactReview(review.id, "wow")
                              }
                            >
                              <IconMoodSurprised
                                size={18}
                                className="text-orange-500"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              radius="xl"
                              size="xs"
                              className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                              onClick={() =>
                                handleReactReview(review.id, "sad")
                              }
                            >
                              <IconMoodSad
                                size={18}
                                className="text-blue-400"
                              />
                            </Button>

                            <Button
                              variant="outline"
                              radius="xl"
                              size="xs"
                              className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                              onClick={() =>
                                handleReactReview(review.id, "angry")
                              }
                            >
                              <IconMoodAngry
                                size={18}
                                className="text-red-600"
                              />
                            </Button>
                          </Group>
                        </HoverCard.Dropdown>
                      </HoverCard>

                      <Popover
                        opened={openedReactCountId === review.id}
                        onChange={(opened) =>
                          setOpenedReactCountId(opened ? review.id : null)
                        }
                        position="top-end"
                        withArrow
                        shadow="md"
                        radius="md"
                      >
                        <Popover.Target>
                          <Text
                            size="sm"
                            c="dimmed"
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              setOpenedReactCountId((prev) =>
                                prev === review.id ? null : review.id,
                              )
                            }
                          >
                            {totalReact(currentReactCount)} lượt cảm xúc
                          </Text>
                        </Popover.Target>

                        <Popover.Dropdown p="sm">
                          <Stack gap={8}>
                            {getReactionStats(currentReactCount).map((item) => (
                              <Group
                                key={item.key}
                                justify="space-between"
                                gap="lg"
                              >
                                <Group gap="xs">
                                  {item.icon}
                                  <Text size="sm">{item.label}</Text>
                                </Group>

                                <Text size="sm" fw={600}>
                                  {item.count}
                                </Text>
                              </Group>
                            ))}
                          </Stack>
                        </Popover.Dropdown>
                      </Popover>
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
                      <StoryCard story={review.story as never} type="home" />
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
