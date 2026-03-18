// src/pages/story-detail-page/StoryDetailPage.tsx
import {
  Anchor,
  Badge,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Group,
  Image,
  Loader,
  Paper,
  Rating,
  Spoiler,
  Stack,
  Text,
  Textarea,
  Title,
} from "@mantine/core";
import {
  Activity,
  ChevronRight,
  Clock,
  Crown,
  Eye,
  Heart,
  MessageCircle,
  Star,
  Tags,
  User,
} from "lucide-react";
import type { FC } from "react";
import {
  useReadingHistoryByStory,
  useSaveReadingHistory,
} from "../../hooks/useHistory";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RequireLoginModal from "../../components/Modal/RequireLoginModal";
import {
  useChaptersByStory,
  useChaptersByStoryForAuthor,
} from "../../hooks/useChapter";
import {
  useCheckUserFollowStory,
  useChangeStatusFollowStory,
} from "../../hooks/useFollowStory";
import { useStoryDetail, useRateStory } from "../../hooks/useStory";
import { useUserStore } from "../../stores/useUserStore";
import { showError, showSuccess } from "../../utils/notifications";

interface AuthorInfo {
  _id?: string;
  fullName?: string;
  nickName?: string;
  penName?: string;
  avatarURL?: string;
}

interface TopicInfo {
  _id?: string;
  name?: string;
  description?: string;
  status?: string;
}

type StoryAuthorField = string | AuthorInfo | undefined;
type StoryTopicField = string | TopicInfo;

interface StoryDetailResponse {
  _id?: string;
  id?: string;
  title: string;
  image: string;
  slug?: string;
  description?: string;
  author?: AuthorInfo;
  authorId?: StoryAuthorField;
  topics?: StoryTopicField[];
  status?: string;
  views?: number;
  stars?: number;
  rates?: number;
  updatedAt?: string;
}

interface ChapterResponse {
  chapterNumber: number;
  title?: string;
  updatedAt?: string;
  views?: number;
  isPremium?: boolean;
  status?: string;
}

interface FollowStoryResponse {
  status?: "follow" | "unsend" | "unfollow";
}

interface ViewChapterItem {
  number: string;
  title?: string;
  updatedAt: string;
  views: number;
  isPremium: boolean;
  status?: string;
}

interface ReadingHistoryResponse {
  _id?: string;
  id?: string;
  userId?: string;
  storyId?: string;
  chapterNumber?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ViewData {
  title: string;
  breadcrumbs: Array<{ label: string; href: string }>;
  coverUrl: string;
  authorId: string;
  author: string;
  status: string;
  genres: string[];
  views: number;
  rating: number;
  ratingCount: number;
  updatedAt: string;
  description: string;
  chapters: ViewChapterItem[];
}

const isAuthorInfo = (value: unknown): value is AuthorInfo => {
  return typeof value === "object" && value !== null;
};

const isTopicInfo = (value: unknown): value is TopicInfo => {
  return typeof value === "object" && value !== null;
};

const getStoryId = (story?: StoryDetailResponse): string => {
  return story?._id || story?.id || "";
};

const getAuthorObject = (
  story?: StoryDetailResponse,
): AuthorInfo | undefined => {
  if (story?.author) return story.author;
  if (isAuthorInfo(story?.authorId)) return story.authorId;
  return undefined;
};

const getAuthorId = (story?: StoryDetailResponse): string => {
  const authorObject = getAuthorObject(story);
  if (authorObject?._id) return authorObject._id;
  if (typeof story?.authorId === "string") return story.authorId;
  return "";
};

const getAuthorName = (story?: StoryDetailResponse): string => {
  const authorObject = getAuthorObject(story);
  return (
    authorObject?.penName ||
    authorObject?.nickName ||
    authorObject?.fullName ||
    "Đang cập nhật"
  );
};

const getTopicNames = (topics?: StoryTopicField[]): string[] => {
  if (!topics || !Array.isArray(topics)) return [];

  return topics
    .map((topic) => {
      if (typeof topic === "string") return topic;
      if (isTopicInfo(topic)) return topic.name || "";
      return "";
    })
    .filter(Boolean);
};

const StoryDetailPage: FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useUserStore();

  const {
    data: rawStory,
    isLoading: storyLoading,
    isError: storyError,
  } = useStoryDetail(slug || "");

  const story = rawStory as StoryDetailResponse | undefined;
  const storyId = getStoryId(story);

  const { data: rawReadingHistory } = useReadingHistoryByStory(
    isLoggedIn && storyId ? storyId : "",
  );

  const { mutateAsync: saveReadingHistory } = useSaveReadingHistory();

  const readingHistory = rawReadingHistory as
    | ReadingHistoryResponse
    | null
    | undefined;

  const continueChapterNumber = readingHistory?.chapterNumber || 0;
  const hasContinueReading = continueChapterNumber > 0;

  const { mutate: submitRateStory, isPending: rateLoading } = useRateStory(
    slug || "",
  );
  const handleRateStory = (value: number) => {
    if (!isLoggedIn) {
      setLoginModalOpened(true);
      return;
    }

    if (!storyId) return;

    const selectedRate = Math.round(value);

    if (selectedRate < 1 || selectedRate > 5) return;

    submitRateStory({
      storyId,
      rate: selectedRate,
    });
  };

  const { data: rawChapters, isLoading: chapterLoading } =
    useChaptersByStory(storyId);

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [loginModalOpened, setLoginModalOpened] = useState(false);

  const authorIdFromStory = getAuthorId(story);
  const isAuthor =
    !!user && !!authorIdFromStory && authorIdFromStory === user.id;

  const { data: rawAuthorChapters, isLoading: authorChapterLoading } =
    useChaptersByStoryForAuthor(isAuthor ? storyId : "");

  const { data: rawFollowData } = useCheckUserFollowStory(
    isLoggedIn && storyId ? storyId : "",
  );

  const { mutate: changeFollowStatus, isPending: followLoading } =
    useChangeStatusFollowStory();

  const followData = rawFollowData as FollowStoryResponse | null | undefined;
  const followed =
    followData?.status === "follow" || followData?.status === "unsend";

  const chapters = (rawChapters ?? []) as ChapterResponse[];
  const authorChapters = (rawAuthorChapters ?? []) as ChapterResponse[];
  const displayChapters = isAuthor ? authorChapters : chapters;

  const handleReadChapter = async (chapterNumber: number) => {
    if (!chapterNumber) return;

    // Prefer slug from current URL to avoid drifting to another story when
    // stories have similar titles and stale payload data appears.
    const storySlug = slug || story?.slug;
    if (!storySlug) return;

    try {
      if (isLoggedIn && user?.id && storyId) {
        await saveReadingHistory({
          storyId,
          chapterNumber,
          userId: user.id,
        });
      }
    } catch (error) {
      console.error("Lưu lịch sử đọc thất bại:", error);
    } finally {
      navigate(`/truyen/${storySlug}/chuong/${chapterNumber}`);
    }
  };

  const viewData = useMemo<ViewData | null>(() => {
    if (!story) return null;

    return {
      title: story.title,
      breadcrumbs: [{ label: "Trang chủ", href: "/" }],
      coverUrl: story.image,
      authorId: getAuthorId(story),
      author: getAuthorName(story),
      status: story.status || "Đang tiến hành",
      genres: getTopicNames(story.topics),
      views: story.views || 0,
      rating:
        story.stars && story.rates
          ? Number((story.stars / story.rates).toFixed(1))
          : 0,
      ratingCount: story.rates || 0,
      updatedAt: story.updatedAt
        ? new Date(story.updatedAt).toLocaleString("vi-VN")
        : "",
      description: story.description || "",
      chapters: displayChapters.map((chapter) => ({
        number: `Chapter ${chapter.chapterNumber}`,
        title: chapter.title,
        updatedAt: chapter.updatedAt
          ? new Date(chapter.updatedAt).toLocaleString("vi-VN")
          : "",
        views: chapter.views || 0,
        isPremium: chapter.isPremium ?? false,
        status: chapter.status,
      })),
    };
  }, [story, displayChapters]);

  if (storyLoading || chapterLoading || (isAuthor && authorChapterLoading)) {
    return (
      <Container size="lg" py="xl" ta="center">
        <Loader />
      </Container>
    );
  }

  if (storyError || !viewData) {
    return (
      <Container size="lg" py="xl" ta="center">
        <Text c="red">Không thể tải dữ liệu truyện</Text>
      </Container>
    );
  }

  const {
    title,
    breadcrumbs,
    coverUrl,
    author,
    authorId,
    status,
    genres,
    views,
    rating,
    ratingCount,
    updatedAt,
    description,
    chapters: chapterList,
  } = viewData;

  return (
    <Container size="lg" py="md">
      <Breadcrumbs mb="sm">
        {breadcrumbs.map((item, index) => (
          <Anchor key={index} href={item.href} size="sm">
            {item.label}
          </Anchor>
        ))}
        <Text size="sm" c="dimmed">
          {title}
        </Text>
      </Breadcrumbs>

      <Paper withBorder p="md" radius="md" mb="lg">
        <Group align="flex-start" gap={16} wrap="nowrap">
          <Image
            src={coverUrl}
            alt={title}
            w={200}
            h={260}
            radius="sm"
            fit="contain"
          />

          <Stack flex={1} gap={6}>
            <Title order={2}>{title}</Title>

            <Stack gap={10}>
              <Group gap={6}>
                <User size={14} />
                <Text size="sm" fw={500}>
                  Tác giả:
                </Text>
                <Anchor
                  size="sm"
                  onClick={() => {
                    if (authorId) navigate(`/author-profile/${authorId}`);
                  }}
                  style={{ cursor: authorId ? "pointer" : "default" }}
                >
                  {author}
                </Anchor>
              </Group>

              <Group gap={6}>
                <Activity size={14} />
                <Text size="sm" fw={500}>
                  Tình trạng:
                </Text>
                <Badge size="xs" color="green">
                  {status}
                </Badge>
              </Group>

              <Group gap={6} wrap="wrap">
                <Tags size={14} />
                <Text size="sm" fw={500}>
                  Thể loại:
                </Text>
                {genres.map((genre) => (
                  <Badge key={genre} size="xs" variant="light">
                    {genre}
                  </Badge>
                ))}
              </Group>

              <Group gap={6}>
                <Star size={14} />
                <Text size="sm" fw={500}>
                  Đánh giá:
                </Text>
                <Rating
                  value={hoverRating ?? rating}
                  fractions={1}
                  size="sm"
                  readOnly={rateLoading}
                  onHover={setHoverRating}
                  onMouseLeave={() => setHoverRating(null)}
                  onChange={handleRateStory}
                />
                <Text size="xs" c="dimmed">
                  {Math.max(0, hoverRating ?? rating)} / 5 ({ratingCount})
                </Text>
              </Group>

              <Group gap={6}>
                <Clock size={14} />
                <Text size="sm" fw={500}>
                  Cập nhật cuối: {updatedAt}
                </Text>
              </Group>

              <Group gap={6}>
                <Eye size={14} />
                <Text size="sm" fw={500}>
                  {views.toLocaleString("vi-VN")} lượt xem
                </Text>
              </Group>
            </Stack>

            <Group mt="xs">
              <Button
                size="xs"
                color="red"
                variant={followed ? "filled" : "outline"}
                loading={followLoading}
                leftSection={
                  <Heart size={14} fill={followed ? "currentColor" : "none"} />
                }
                onClick={() => {
                  if (!isLoggedIn) {
                    setLoginModalOpened(true);
                    return;
                  }

                  if (!storyId) return;

                  changeFollowStatus(
                    {
                      storyId,
                      status: followed ? "unfollow" : "follow",
                    },
                    {
                      onSuccess: () => {
                        showSuccess(
                          followed
                            ? "Đã bỏ theo dõi truyện"
                            : "Đã theo dõi truyện",
                        );
                      },
                      onError: (error: Error) => {
                        showError(error.message || "Lỗi khi cập nhật theo dõi");
                      },
                    },
                  );
                }}
              >
                {followed ? "Đã theo dõi" : "Theo dõi"}
              </Button>

              <Button
                size="xs"
                color="blue"
                disabled={!chapterList.length}
                onClick={() => {
                  const firstChapter = Number(
                    chapterList[0]?.number.split(" ")[1] || 0,
                  );
                  void handleReadChapter(firstChapter);
                }}
              >
                Đọc từ đầu
              </Button>

              <Button
                size="xs"
                color="green"
                disabled={!chapterList.length}
                onClick={() => {
                  const latestChapter = Number(
                    chapterList[chapterList.length - 1]?.number.split(" ")[1] ||
                      0,
                  );
                  void handleReadChapter(latestChapter);
                }}
              >
                Đọc mới nhất
              </Button>

              {hasContinueReading && (
                <Button
                  size="xs"
                  color="orange"
                  onClick={() => handleReadChapter(continueChapterNumber)}
                >
                  Đọc tiếp
                </Button>
              )}
            </Group>
          </Stack>
        </Group>

        <Divider my="sm" />

        <Title order={4}>Giới thiệu truyện</Title>
        <Spoiler maxHeight={100} showLabel="Xem thêm" hideLabel="Ẩn bớt">
          <Text size="sm" style={{ whiteSpace: "pre-line" }}>
            {description}
          </Text>
        </Spoiler>
      </Paper>

      <Paper withBorder radius="md" p="md" mb="lg">
        <Group pb={6} mb={6} style={{ borderBottom: "2px solid #228be6" }}>
          <ChevronRight size={14} color="#228be6" />
          <Title order={5} c="blue">
            DANH SÁCH CHƯƠNG
          </Title>
        </Group>

        <Stack gap={0}>
          {chapterList.map((chapter, index) => (
            <Group
              key={index}
              justify="space-between"
              px="xs"
              py={6}
              style={{ borderBottom: "1px dashed #e9ecef" }}
            >
              <Group gap={6}>
                <Anchor
                  size="sm"
                  fw={500}
                  onClick={(event) => {
                    event.preventDefault();
                    const selectedChapter = Number(
                      chapter.number.split(" ")[1] || 0,
                    );
                    void handleReadChapter(selectedChapter);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {chapter.number}
                  {chapter.title ? ` - ${chapter.title}` : ""}
                </Anchor>

                {chapter.isPremium && (
                  <Badge
                    size="xs"
                    color="yellow"
                    variant="light"
                    leftSection={<Crown size={9} />}
                  >
                    VIP
                  </Badge>
                )}

                {isAuthor && chapter.status && chapter.status !== "active" && (
                  <Badge
                    size="xs"
                    color={
                      chapter.status === "draft"
                        ? "gray"
                        : chapter.status === "pending"
                          ? "yellow"
                          : "red"
                    }
                    variant="light"
                  >
                    {chapter.status === "draft"
                      ? "Bản nháp"
                      : chapter.status === "pending"
                        ? "Chờ duyệt"
                        : chapter.status === "rejected"
                          ? "Từ chối"
                          : chapter.status}
                  </Badge>
                )}
              </Group>

              <Text size="xs" c="dimmed">
                {chapter.updatedAt}
              </Text>
            </Group>
          ))}
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group mb="xs">
          <MessageCircle size={16} />
          <Title order={4}>Bình luận</Title>
        </Group>

        <Stack gap="xs">
          <Textarea size="sm" minRows={3} placeholder="Viết bình luận..." />
          <Button
            size="xs"
            w="fit-content"
            onClick={() => {
              if (!isLoggedIn) {
                setLoginModalOpened(true);
                return;
              }
            }}
          >
            Gửi bình luận
          </Button>
        </Stack>
      </Paper>

      <RequireLoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </Container>
  );
};

export default StoryDetailPage;
