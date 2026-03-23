import {
  Breadcrumbs,
  Anchor,
  Badge,
  Button,
  Container,
  Group,
  Select,
  Stack,
  Text,
  Title,
  Paper,
  Textarea,
  Avatar,
  Modal,
  Divider,
  Pagination,
  HoverCard,
  Slider,
  ColorInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconChevronLeft,
  IconChevronRight,
  IconHeartFilled,
  IconHeartPlus,
  IconMessageCircle,
  IconMoodAngry,
  IconMoodSad,
  IconMoodSmile,
  IconMoodSurprised,
  IconSettings,
  IconThumbUp,
} from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import {
  useChapterByChapterNumber,
  useChaptersByStory,
  useChaptersByStoryForAuthor,
} from "../../hooks/useChapter";
import { useStoryDetail } from "../../hooks/useStory";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthorService } from "../../services/AuthorService";
import RequireLoginModal from "../../components/RequireLoginModal";
import { useCommentsByChapter, useReplyComments } from "../../hooks/useComment";
import CommentService from "../../services/CommentService";
import { showError, showSuccess } from "../../utils/notifications";
import type { Comment } from "../../interfaces/Comment";
import { DateHourFormat } from "../../utils";
import { useCheckUserFollowStory } from "../../hooks/useFollowStory";
import FollowStoryService from "../../services/FollowStoryService";
import { useUserReactOfChapter } from "../../hooks/useReactComment";
import {
  ReactType,
  type ReactComment,
  type ReactTypeValue,
} from "../../interfaces/ReactComment";
import ReactCommentService from "../../services/ReactCommentService";
import { getReactColor, totalReact } from "../../utils/reactComment";
import { ReactIconList } from "../../components/reactComment/ReactIcon";
import { ChapterPageService } from "../../services/ChapterService";

export interface ReaderSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string | null;
}

const STORAGE_KEY = "reader_settings";

const defaultSettings: ReaderSettings = {
  fontFamily: "Times New Roman",
  fontSize: 18,
  lineHeight: 1.8,
  textColor: "#000000",
  backgroundColor: null,
};

const fonts = [
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Arial", label: "Arial" },
  { value: "Verdana", label: "Verdana" },
  { value: "Helvetica", label: "Helvetica" },
];

const LIMIT = 10;

const ChapterPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [textSettings, setTextSettings] =
    useState<ReaderSettings>(defaultSettings);
  const { storySlug, chapterNumber } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, user, updateUser } = useUserStore();
  const [loginNotice, setLoginNotice] = useState(false);
  const [comment, setComment] = useState("");
  const [commentPage, setCommentPage] = useState(1);

  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null,
  );

  const { data: story } = useStoryDetail(storySlug);
  const [replyContent, setReplyContent] = useState("");
  const queryClient = useQueryClient();

  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [repliesMap] = useState<Record<string, Comment[]>>({});
  const [openedReplyCommentId, setOpenedReplyCommentId] = useState<string>("");
  const [openedBuyChapter, { open: openBuyChapter, close: closeBuyChapter }] =
    useDisclosure(false);
  const [
    openedConfirmBuyChapter,
    { open: openConfirmBuyChapter, close: closeConfirmBuyChapter },
  ] = useDisclosure(false);

  // Load settings
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
      setTextSettings(JSON.parse(saved));
    }
  }, []);

  const {
    data: chapter,
    isLoading: chapterLoading,
    error: chapterError,
  } = useChapterByChapterNumber(String(storySlug), Number(chapterNumber));

  // Try to fetch author chapters first (if user is author, shows all statuses)
  // If that fails (user not author), fall back to public chapters (only active)
  const { data: authorChapters, isError: authorChaptersError } = useQuery({
    queryKey: ["author-chapters-list", chapter?.storyId],
    queryFn: () => AuthorService.getChaptersByStoryForAuthor(chapter!.storyId),
    enabled: isLoggedIn && !!chapter?.storyId,
    retry: false,
    onError: () => {
      // Silently fail - user is not the story author
    },
  });

  // Only fetch public chapters if author chapters failed or if user is not logged in
  const { data: publicChapters } = useChaptersByStory(
    (!isLoggedIn || authorChaptersError) && chapter?.storyId
      ? chapter.storyId
      : "",
  );
  const listChapters = authorChapters ?? publicChapters;
  const chapters =
    listChapters?.map((c) => ({
      value: c.chapterNumber.toString(),
      label: `Chương ${c.chapterNumber}: ${c.title}`,
    })) ?? [];

  const currentChapterIndex =
    listChapters?.findIndex((c) => c.chapterNumber === Number(chapterNumber)) ??
    -1;
  const prevChapter =
    currentChapterIndex > 0 ? listChapters?.[currentChapterIndex - 1] : null;
  const nextChapter =
    currentChapterIndex < (listChapters?.length ?? 0) - 1
      ? listChapters?.[currentChapterIndex + 1]
      : null;

  const { data: commentData } = useCommentsByChapter(
    chapter?.id ?? "",
    commentPage,
    LIMIT,
  );
  const comments = commentData?.comments ?? [];
  const totalCommentPages =
    commentData && commentData.total ? Math.ceil(commentData.total / LIMIT) : 1;
  const { data: replyData, refetch: refetchReplyComments } =
    useReplyComments(openedReplyCommentId);
  // console.log("reply", replyData)
  repliesMap[openedReplyCommentId] = replyData?.comments ?? [];

  const { data: isFollowStory } = useCheckUserFollowStory(
    chapter?.storyId ?? "",
  );

  // If backend gates the chapter (buy/login required), try fetching via author API.
  // This only succeeds when the logged-in user is the story's author; for everyone
  // else the request returns 4xx and we fall back to the normal gated UI.
  const isGated =
    chapter?.contentURL === "status-buy-chapter" ||
    chapter?.contentURL === "status-require-login";
  const { data: authorOverride } = useQuery({
    queryKey: ["author-chapter-override", chapter?.id],
    queryFn: () => AuthorService.getChapterById(chapter!.id),
    enabled: isGated && isLoggedIn && !!chapter?.id,
    retry: false,
    staleTime: 5 * 60 * 1000,
    onError: () => {
      // Silently fail - user is not the author of this chapter
    },
  });
  const effectiveContentURL =
    isGated &&
      authorOverride?.contentURL &&
      !authorOverride.contentURL.startsWith("status-")
      ? authorOverride.contentURL
      : chapter?.contentURL;

  const commentIds = useMemo(
    () => commentData?.comments?.map((c: Comment) => c.id),
    [commentData?.comments],
  );
  const { data: userReact } = useUserReactOfChapter(
    chapter?.id ?? "",
    commentPage,
    commentIds,
  );
  const userReactMap = useMemo(() => {
    if (!userReact || !userReact.length) return new Map();
    return new Map(
      userReact?.map((r: ReactComment) => [r.commentId, r.react]) ?? [],
    );
  }, [userReact]);

  const saveSettings = () => {
    setTextSettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    close();
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
  };

  const handleCloseSettings = () => {
    setSettings(textSettings);
    close();
  };

  const handleSubmitComment = async () => {
    if (!comment.trim() || !chapter?.id) return; // Không có id hoặc nội dung thì ko được gửi
    if (!isLoggedIn) {
      setLoginNotice(true);
    } else {
      const submitResult = await CommentService.submitComment(
        chapter?.id,
        comment,
      );
      showSuccess(submitResult?.message || "Gửi bình luận thành công.");
      await queryClient.invalidateQueries({
        queryKey: ["comments", chapter?.id, commentPage, LIMIT],
      });
      setComment("");
    }
  };

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || !chapter?.id || !commentId) return;

    if (!isLoggedIn) {
      setLoginNotice(true);
      return;
    }

    const submitResult = await CommentService.submitReply(
      commentId,
      replyContent,
    );

    showSuccess(submitResult?.message || "Gửi phản hồi bình luận thành công.");
    await refetchReplyComments();
    await queryClient.invalidateQueries({
      queryKey: ["comments", chapter?.id, commentPage, LIMIT],
    });

    setReplyContent("");
    setReplyingCommentId(null);
  };

  const toggleReplies = (commentId: string) => {
    if (expandedComments.includes(commentId)) {
      setExpandedComments((prev) => prev.filter((id) => id !== commentId));
    } else {
      setExpandedComments((prev) => [...prev, commentId]);
      setOpenedReplyCommentId(commentId);
    }
  };

  const handleChangeUserFollowStory = async () => {
    if (!isLoggedIn) {
      setLoginNotice(true);
      return;
    }

    if (!chapter?.storyId) return;
    const newStatus =
      isFollowStory?.status === "follow" || isFollowStory?.status === "unsend"
        ? "unfollow"
        : "follow";

    const submitResult = await FollowStoryService.changeStatusFollowStory(
      chapter?.storyId ?? "",
      newStatus,
    );
    queryClient.invalidateQueries({
      queryKey: ["checkUserFollowStory", chapter?.storyId],
    });
    showSuccess(
      submitResult && newStatus === "follow"
        ? "Theo dõi truyện thành công"
        : "Hủy theo dõi truyện thành công",
    );
  };

  const handleUserReact = async (commentId: string, react: ReactTypeValue) => {
    if (!isLoggedIn) {
      setLoginNotice(true);
      return;
    }
    if (!chapter?.id || !commentId) return;
    const submitResult = await ReactCommentService.userReactComment(
      commentId,
      chapter?.id,
      react,
    );
    await queryClient.invalidateQueries({
      queryKey: ["comments", chapter?.id, commentPage, LIMIT],
    });
    await queryClient.invalidateQueries({
      queryKey: ["userReactOfChapter", chapter?.id, commentPage],
    });
    showSuccess(submitResult.message);
  };

  useEffect(() => {
    if (!chapter?.storyId) return;
    const timer = setTimeout(() => {
      ChapterPageService.userReadChapter(
        chapter?.storyId,
        Number(chapterNumber),
      );
    }, 10000); // 10s là tính 1 lượt đọc

    return () => clearTimeout(timer);
  }, [chapter?.id, chapterNumber]);

  const handleBuyChapter = async () => {
    // gọi API mua chương ở đây
    const result = await ChapterPageService.buyChapter(
      chapter?.id || "",
      user?.spiritStones || 0,
    );
    console.log("Buy chapter", result);
    closeBuyChapter();
    closeConfirmBuyChapter();
    if (result && result?.success) {
      showSuccess("Mua chương thành công");
      updateUser({
        ...user,
        spiritStones: (user?.spiritStones || 0) - (chapter?.price || 0),
      });
      await queryClient.invalidateQueries({
        queryKey: ["chapter", String(storySlug), Number(chapterNumber)],
      });
    }
    if (result && !result?.success && !result?.enough) {
      showError(result?.message || "Linh thạch không đủ. Vui lòng thử lại.");
    }
  };

  useEffect(() => {
    if (!chapter?.id || (!nextChapter && !prevChapter)) return;

    let isNavigating = false;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;

      if (isNavigating) return;

      if (e.key === "ArrowRight" && nextChapter) {
        isNavigating = true;
        navigate(`/truyen/${storySlug}/chuong/${nextChapter.chapterNumber}`);
      }

      if (e.key === "ArrowLeft" && prevChapter) {
        isNavigating = true;
        navigate(`/truyen/${storySlug}/chuong/${prevChapter.chapterNumber}`);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextChapter, prevChapter, chapter?.id, navigate, storySlug]);

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        {/* Breadcrumb */}
        <Breadcrumbs>
          <Anchor href="/">Trang chủ</Anchor>
          <Anchor
            href={`/story/${storySlug}`}
            className="max-w-48 truncate inline-block align-bottom"
          >
            {story?.title || storySlug}
          </Anchor>
          <Text className="max-w-96 truncate inline-block align-bottom">
            Chương {chapterNumber}: {chapter?.title}
          </Text>
        </Breadcrumbs>

        {/* Reader Settings Modal */}
        <Modal
          opened={opened}
          onClose={handleCloseSettings}
          title="Cấu hình đọc truyện"
          centered
        >
          <Stack gap="lg">
            {/* Font */}
            <Select
              label="Font chữ"
              data={fonts}
              value={settings.fontFamily}
              onChange={(value) =>
                setSettings({
                  ...settings,
                  fontFamily: value || "Times New Roman",
                })
              }
            />

            {/* Font size */}
            <Stack gap={4}>
              <Text>Kích cỡ chữ ({settings.fontSize}px)</Text>
              <Slider
                min={14}
                max={28}
                value={settings.fontSize}
                onChange={(value) =>
                  setSettings({ ...settings, fontSize: value })
                }
              />
            </Stack>

            {/* Line height */}
            <Stack gap={4}>
              <Text>Khoảng cách dòng ({settings.lineHeight})</Text>
              <Slider
                min={1.2}
                max={2.5}
                step={0.1}
                value={settings.lineHeight}
                onChange={(value) =>
                  setSettings({ ...settings, lineHeight: value })
                }
              />
            </Stack>

            {/* Text color */}
            <ColorInput
              label="Màu chữ"
              value={settings.textColor}
              onChange={(value) =>
                setSettings({ ...settings, textColor: value })
              }
            />

            {/* Background color */}
            <ColorInput
              label="Màu nền"
              value={settings.backgroundColor || ""}
              onChange={(value) =>
                setSettings({ ...settings, backgroundColor: value })
              }
            />

            {/* Preview */}
            <Text
              style={{
                fontFamily: settings.fontFamily,
                fontSize: settings.fontSize,
                lineHeight: settings.lineHeight,
                color: settings.textColor,
                backgroundColor: settings.backgroundColor || "",
              }}
            >
              Đây là đoạn văn bản xem trước để bạn điều chỉnh cấu hình đọc
              truyện.
            </Text>

            {/* Buttons */}
            <Group justify="space-between">
              <Button variant="light" onClick={resetSettings}>
                Reset
              </Button>
              <Button onClick={saveSettings}>Lưu</Button>
            </Group>
          </Stack>
        </Modal>

        {/* Navigation top */}
        <Group justify="center" gap="sm">
          <HoverCard>
            <HoverCard.Target>
              <Button
                variant="outline"
                color="blue"
                onClick={handleChangeUserFollowStory}
              >
                {isFollowStory?.status === "follow" ||
                  isFollowStory?.status === "unsend" ? (
                  <IconHeartFilled size={16} />
                ) : (
                  <IconHeartPlus size={16} />
                )}
              </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm">
                {isFollowStory?.status === "follow" ||
                  isFollowStory?.status === "unsend"
                  ? "Bỏ Theo Dõi"
                  : "Theo Dõi"}
              </Text>
            </HoverCard.Dropdown>
          </HoverCard>
          <Button
            disabled={!prevChapter}
            onClick={() =>
              navigate(
                `/truyen/${storySlug}/chuong/${prevChapter?.chapterNumber}`,
              )
            }
          >
            <IconChevronLeft size={16} />
          </Button>
          <Select
            color="blue"
            withScrollArea
            data={chapters}
            value={chapterNumber}
            onChange={(value) =>
              navigate(`/truyen/${storySlug}/chuong/${value}`)
            }
            chevronColor="blue"
            allowDeselect={false}
            w={280}
          />
          <Button
            disabled={!nextChapter}
            onClick={() =>
              navigate(
                `/truyen/${storySlug}/chuong/${nextChapter?.chapterNumber}`,
              )
            }
          >
            <IconChevronRight size={16} />
          </Button>
          <Button variant="outline" color="blue" onClick={open}>
            <IconSettings size={16} />
          </Button>
        </Group>

        {/* Chapter content */}
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="md">
            {chapterLoading ? (
              <Text ta="center" size="lg" c="dimmed">
                Đang tải chương...
              </Text>
            ) : chapterError || !chapter ? (
              <Text ta="center" size="lg" c="red">
                {chapterError
                  ? `Lỗi: ${chapterError.message}`
                  : "Không thể tải chương. Vui lòng thử lại."}
              </Text>
            ) : (
              <>
                <Title order={2} ta="center">
                  {`Chương ${chapter?.chapterNumber}: ${chapter?.title}`}
                </Title>
                <Divider />
                {chapter?.contentURL === "status-require-login" ? (
                  <Text size="lg">
                    Vui lòng{" "}
                    <Anchor href="/login" fw={600}>
                      đăng nhập
                    </Anchor>{" "}
                    và mua chương để xem nội dung.
                  </Text>
                ) : chapter?.contentURL === "status-buy-chapter" ? (
                  <>
                    <Text size="lg">
                      Vui lòng{" "}
                      <Anchor
                        component="button"
                        onClick={openBuyChapter}
                        className="text-blue-600 hover:underline"
                        fw={600}
                      >
                        mua chương
                      </Anchor>{" "}
                      để xem nội dung.
                    </Text>

                    <Modal
                      opened={openedBuyChapter}
                      onClose={closeBuyChapter}
                      centered
                      title={
                        <Text fw={700} size="lg">
                          Xác nhận mua chương
                        </Text>
                      }
                    >
                      <Text size="md" mb="sm">
                        Bạn có chắc muốn mua chương này không?
                      </Text>

                      {/* Thông tin linh thạch */}
                      <Group justify="space-between" mb="md">
                        <Text size="md" c={"blue"}>
                          Linh thạch hiện tại
                        </Text>
                        <Text fw={600} c="blue">
                          {user?.spiritStones || 0} 💎
                        </Text>
                      </Group>

                      <Group justify="space-between" mb="lg">
                        <Text size="md" c={"blue"}>
                          Giá chương
                        </Text>
                        <Text fw={600} c="red">
                          {chapter?.price} 💎
                        </Text>
                      </Group>

                      {!user ||
                        (user?.spiritStones < chapter?.price && (
                          <Group justify="space-between" mb="md">
                            <Text size="md" c={""}>
                              Linh thạch không đủ.{" "}
                              <Anchor
                                component="button"
                                onClick={() =>
                                  navigate("/purchase/spirit-stone")
                                }
                                className="text-blue-600 hover:underline"
                                fw={600}
                              >
                                Mua thêm
                              </Anchor>{" "}
                              linh thạch.
                            </Text>
                          </Group>
                        ))}

                      <Group justify="flex-end">
                        <Button variant="default" onClick={closeBuyChapter}>
                          Hủy
                        </Button>

                        <Button
                          color="blue"
                          onClick={openConfirmBuyChapter}
                          disabled={
                            !user || user?.spiritStones < chapter?.price
                          }
                        >
                          Xác nhận mua
                        </Button>
                      </Group>
                    </Modal>
                    <Modal
                      opened={openedConfirmBuyChapter}
                      onClose={closeConfirmBuyChapter}
                      centered
                      title={
                        <Text fw={700} size="lg">
                          Xác nhận mua chương
                        </Text>
                      }
                    >
                      <Text fw={500} size="md">
                        Bạn chắc chắn xác nhận mua chương?
                      </Text>
                      <Group justify="flex-end">
                        <Button
                          variant="default"
                          onClick={() => {
                            closeConfirmBuyChapter();
                            closeBuyChapter();
                          }}
                        >
                          Hủy
                        </Button>

                        <Button
                          color="blue"
                          onClick={handleBuyChapter}
                          disabled={
                            !user || user?.spiritStones < chapter?.price
                          }
                        >
                          Xác nhận
                        </Button>
                      </Group>
                    </Modal>
                  </>
                ) : (
                  <Text
                    style={{ whiteSpace: "pre-wrap" }}
                    ff={textSettings.fontFamily}
                    fz={textSettings.fontSize}
                    lh={textSettings.lineHeight}
                    c={textSettings.textColor}
                    bg={textSettings.backgroundColor || ""}
                    dangerouslySetInnerHTML={{
                      __html: chapter?.contentURL || "",
                    }}
                  ></Text>
                )}
              </>
            )}
          </Stack>
        </Paper>

        {/* Navigation bottom */}
        <Group justify="center" gap="sm">
          <Button
            disabled={!prevChapter}
            onClick={() =>
              navigate(
                `/truyen/${storySlug}/chuong/${prevChapter?.chapterNumber}`,
              )
            }
          >
            <IconChevronLeft size={16} />
          </Button>
          <Select
            data={chapters}
            value={chapterNumber}
            onChange={(value) =>
              navigate(`/truyen/${storySlug}/chuong/${value}`)
            }
            chevronColor="blue"
            allowDeselect={false}
            w={280}
          />
          <Button
            disabled={!nextChapter}
            onClick={() =>
              navigate(
                `/truyen/${storySlug}/chuong/${nextChapter?.chapterNumber}`,
              )
            }
          >
            <IconChevronRight size={16} />
          </Button>
        </Group>

        {/* Comment input */}
        <Paper withBorder p="md" radius="md">
          <Stack>
            <Title order={4}>Bình luận</Title>
            <Textarea
              placeholder="Viết bình luận của bạn..."
              autosize
              minRows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Group justify="flex-end">
              <Button onClick={handleSubmitComment}>Gửi bình luận</Button>
            </Group>
          </Stack>
          <RequireLoginModal
            opened={loginNotice}
            onClose={() => {
              setLoginNotice(false);
            }}
            title="Phiên đăng nhập đã hết hạn."
            message="Bạn vui lòng đăng nhập để thực hiện chức năng này."
          />
        </Paper>

        {/* Comment list */}
        <Stack gap="md">
          {!comments?.length && (
            <Text c="dimmed" ta="center">
              Chưa có bình luận nào. Hãy cùng bắt đầu cuộc trò chuyện.
            </Text>
          )}

          {comments?.map((c: Comment) => (
            <Paper key={c.id} withBorder p="md" radius="md">
              <Group align="flex-start" wrap="nowrap">
                <Avatar src={c.user?.avatarURL} radius="xl" />

                <Stack gap={6} style={{ flex: 1 }}>
                  <Group gap="xs">
                    <Text fw={600}>{c.user?.nickName}</Text>

                    <Text size="xs" c="dimmed">
                      {DateHourFormat(c.createdAt)}
                    </Text>
                  </Group>

                  <Text style={{ whiteSpace: "pre-line" }}>{c.content}</Text>

                  <Group gap="lg" mt={4}>
                    <HoverCard
                      position="top-start"
                      openDelay={800}
                      closeDelay={800}
                      shadow="md"
                      transitionProps={{ transition: "pop", duration: 200 }}
                      withinPortal
                    >
                      <HoverCard.Target>
                        <Button
                          variant="outline"
                          radius="sm"
                          size="xs"
                          color={`${userReactMap?.get(c.id) ? getReactColor(userReactMap?.get(c.id) as ReactTypeValue) : "gray.5"}`}
                          onClick={() =>
                            handleUserReact(
                              c.id,
                              userReactMap?.get(c.id)
                                ? ReactType.UNLIKE
                                : ReactType.LIKE,
                            )
                          }
                        >
                          <Group gap={6}>
                            <Text size="sm" fw={500} className="flex justify-center items-center align-middle min-w-[80px]">
                              {totalReact(c?.react as Record<string, number>) > 0 && <ReactIconList react={c?.react} />}
                              {totalReact(c?.react as Record<string, number>) || 0}
                            </Text>
                          </Group>
                        </Button>
                      </HoverCard.Target>

                      <HoverCard.Dropdown
                        p={6}
                        className="rounded-xl border border-gray-200 bg-white shadow-lg"
                      >
                        <Group gap={6}>
                          {/* Like */}
                          <Button
                            variant="outline"
                            radius="xl"
                            size="xs"
                            className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                            onClick={() =>
                              handleUserReact(c.id, ReactType.LIKE)
                            }
                          >
                            <IconThumbUp size={18} className="text-blue-500" />
                          </Button>

                          {/* Love */}
                          <Button
                            variant="outline"
                            radius="xl"
                            size="xs"
                            className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                            onClick={() =>
                              handleUserReact(c.id, ReactType.LOVE)
                            }
                          >
                            <IconHeartFilled
                              size={18}
                              className="text-pink-500"
                            />
                          </Button>

                          {/* Haha */}
                          <Button
                            variant="outline"
                            radius="xl"
                            size="xs"
                            className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                            onClick={() =>
                              handleUserReact(c.id, ReactType.HAHA)
                            }
                          >
                            <IconMoodSmile
                              size={18}
                              className="text-yellow-500"
                            />
                          </Button>

                          {/* Wow */}
                          <Button
                            variant="outline"
                            radius="xl"
                            size="xs"
                            className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                            onClick={() => handleUserReact(c.id, ReactType.WOW)}
                          >
                            <IconMoodSurprised
                              size={18}
                              className="text-orange-500"
                            />
                          </Button>

                          {/* Sad */}
                          <Button
                            variant="outline"
                            radius="xl"
                            size="xs"
                            className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                            onClick={() => handleUserReact(c.id, ReactType.SAD)}
                          >
                            <IconMoodSad size={18} className="text-blue-400" />
                          </Button>

                          {/* Angry */}
                          <Button
                            variant="outline"
                            radius="xl"
                            size="xs"
                            className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                            onClick={() =>
                              handleUserReact(c.id, ReactType.ANGRY)
                            }
                          >
                            <IconMoodAngry size={18} className="text-red-600" />
                          </Button>
                        </Group>
                      </HoverCard.Dropdown>
                    </HoverCard>

                    <Group
                      gap={4}
                      className="cursor-pointer"
                      onClick={() => {
                        setReplyContent("");
                        setReplyingCommentId(
                          replyingCommentId === c.id ? null : c.id,
                        );
                      }}
                    >
                      <IconMessageCircle size={16} />
                      <Text size="sm">Trả lời</Text>
                    </Group>

                    {c.replyCount > 0 && (
                      <Text
                        size="sm"
                        c="blue"
                        className="cursor-pointer"
                        onClick={() => toggleReplies(c.id)}
                      >
                        {expandedComments.includes(c.id)
                          ? "Ẩn phản hồi"
                          : `Xem ${c.replyCount} phản hồi`}
                      </Text>
                    )}
                  </Group>

                  {/* REPLY BOX */}
                  {replyingCommentId === c.id && (
                    <Paper withBorder radius="md" p="sm" mt={8}>
                      <Stack gap="xs">
                        <Textarea
                          placeholder={`Trả lời ${c.user.nickName}...`}
                          autosize
                          minRows={2}
                          autoFocus
                          value={replyContent}
                          onChange={(e) =>
                            setReplyContent(e.currentTarget.value)
                          }
                        />

                        <Group justify="flex-end">
                          <Button
                            variant="subtle"
                            size="xs"
                            onClick={() => {
                              setReplyingCommentId(null);
                              setReplyContent("");
                            }}
                          >
                            Hủy
                          </Button>

                          <Button
                            size="xs"
                            onClick={() => handleSubmitReply(c.id)}
                          >
                            Gửi phản hồi
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  )}

                  {/* REPLIES */}
                  {expandedComments.includes(c.id) && (
                    <Stack
                      mt="sm"
                      pl="lg"
                      style={{
                        borderLeft: "2px solid #eee",
                      }}
                    >
                      {repliesMap[c.id]?.map((reply) => (
                        <Group key={reply.id} align="flex-start" wrap="nowrap">
                          <Avatar
                            src={reply.user.avatarURL}
                            radius="xl"
                            size="sm"
                          />

                          <Stack gap={2}>
                            <Group gap="xs">
                              <Text fw={600} size="sm">
                                {reply.user.nickName}
                              </Text>

                              <Text size="xs" c="dimmed">
                                {DateHourFormat(reply.createdAt)}
                              </Text>
                            </Group>

                            <Text size="sm">{reply.content}</Text>
                          </Stack>
                        </Group>
                      ))}
                    </Stack>
                  )}
                </Stack>
              </Group>
            </Paper>
          ))}

          <Pagination
            total={totalCommentPages}
            value={commentPage}
            onChange={setCommentPage}
            mx="auto"
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default ChapterPage;
