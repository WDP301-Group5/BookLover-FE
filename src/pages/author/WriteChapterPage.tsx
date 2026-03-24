import {
  Box,
  Button,
  Container,
  Flex,
  Loader,
  Modal,
  Stack,
  Text,
  ActionIcon,
  Group,
  Menu,
  NumberInput,
  Radio,
  Divider,
  Image,
  Badge,
  TextInput,
  ScrollArea,
  Title,
} from "@mantine/core";
import {
  ChapterContentInput,
  type ContentPayload,
} from "../../components/author/ChapterContentInput";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  ChevronDown,
  ChevronLeft,
  Send,
  Save,
  MoreVertical,
  Plus,
  Check,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import { z } from "zod";
import type { Story } from "../../interfaces/Story";
import type { Chapter } from "../../interfaces/Chapter";
import { AuthorService } from "../../services/AuthorService";
import { showError, showSuccess } from "../../utils/notifications.tsx";
import { timeAgo } from "../../utils";
import PublishStoryModal from "../../components/author/PublishStoryModal.tsx";
import ConfirmDeleteModal from "../../components/common/ConfirmDeleteModal.tsx";

const writeChapterSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề chương không được để trống")
    .max(200, "Tiêu đề chương không được vượt quá 200 ký tự"),
  chapterType: z.enum(["free", "vip"]),
  price: z
    .number({ error: "Giá phải là số" })
    .int("Giá phải là số nguyên")
    .min(1, "Giá phải lớn hơn 0")
    .optional(),
});

type WriteChapterFormValues = z.infer<typeof writeChapterSchema>;

const statusConfig: Record<string, { label: string; color: string }> = {
  draft: { label: "Bản nháp", color: "gray" },
  pending: { label: "Chờ duyệt", color: "yellow" },
  active: { label: "Đã duyệt", color: "green" },
  inactive: { label: "Không hoạt động", color: "gray" },
  private: { label: "Riêng tư", color: "blue" },
  error: { label: "Lỗi", color: "orange" },
  rejected: { label: "Bị từ chối", color: "red" },
  banned: { label: "Bị cấm", color: "red.9" },
};

export default function WriteChapterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { storySlug } = useParams<{ storySlug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const chapterParam = searchParams.get("chapter");
  const returnTo =
    searchParams.get("returnTo") ||
    (location.state?.returnTo as string | undefined);
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [storyLoading, setStoryLoading] = useState(true);
  const [savingLoading, setSavingLoading] = useState(false);
  const [publishingLoading, setPublishingLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [hasChangesAfterSave, setHasChangesAfterSave] = useState(false);
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<
    number | null
  >(null);
  const [chapterListOpened, setChapterListOpened] = useState(false);
  const [contentPayload, setContentPayload] = useState<ContentPayload | null>(
    null,
  );
  const [contentError, setContentError] = useState<string | undefined>();
  const [editorInitialContent, setEditorInitialContent] = useState<string>("");
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [publishModalOpened, setPublishModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [unsavedExitModalOpened, setUnsavedExitModalOpened] = useState(false);
  const [unsavedPublishModalOpened, setUnsavedPublishModalOpened] =
    useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const isExitingRef = useRef(false);
  const hasStateRef = useRef(false);
  const extraPushesRef = useRef(0);
  const lastSavedContentRef = useRef<string>("");
  const lastSavedTitleRef = useRef<string>("");
  const lastSavedChapterTypeRef = useRef<string>("free");

  const form = useForm<WriteChapterFormValues>({
    initialValues: {
      title: "",
      chapterType: "free",
      price: 1,
    },
    validate: zod4Resolver(writeChapterSchema),
  });

  const nextChapterNumber = useMemo(() => {
    if (chapters.length === 0) return 1;
    return Math.max(...chapters.map((c) => c.chapterNumber)) + 1;
  }, [chapters]);

  // Word count from content
  const wordCount = useMemo(() => {
    if (!contentPayload) return 0;
    const plain = contentPayload.html.replace(/<[^>]+>/g, " ").trim();
    return plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  }, [contentPayload]);

  const currentChapterTitle =
    form.values.title ||
    `Chương ${selectedChapterIndex !== null ? chapters[selectedChapterIndex]?.chapterNumber : nextChapterNumber}`;

  const loadChapters = useCallback(async (storyId: string) => {
    const chapterList =
      await AuthorService.getChaptersByStoryForAuthor(storyId);
    setChapters(chapterList);
    return chapterList;
  }, []);

  const handleSelectChapter = useCallback(
    async (index: number) => {
      const ch = chapters[index];
      setSelectedChapterIndex(index);
      form.setValues({
        title: ch.title,
        chapterType: ch.isPremium ? "vip" : "free",
        price: ch.price || 1,
      });
      setContentError(undefined);
      setSaved(false);
      setChapterListOpened(false);

      // Fetch chapter content from the server
      try {
        const fullChapter = await AuthorService.getChapterById(ch.id);
        const html = fullChapter.contentURL ?? "";
        setEditorInitialContent(html);
        setContentPayload({ mode: "editor", html });
      } catch {
        setEditorInitialContent("");
        setContentPayload(null);
      }
    },
    [chapters, form],
  );

  useEffect(() => {
    if (!storySlug) return;
    setStoryLoading(true);
    AuthorService.getStoryBySlug(storySlug)
      .then((data) => {
        setStory(data);
        return loadChapters(data._id).then((chapterList) => ({
          story: data,
          chapters: chapterList,
        }));
      })
      .then(async ({ chapters: chapterList }) => {
        // Select chapter from URL param, or start in new-chapter mode if no param
        const parsedParam = chapterParam ? Number(chapterParam) : null;
        const isValidParam =
          parsedParam !== null &&
          Number.isInteger(parsedParam) &&
          parsedParam >= 1;

        // If param is present but invalid, clean up the URL
        if (chapterParam && !isValidParam) {
          setSearchParams({}, { replace: true });
        }

        const targetIdx = isValidParam
          ? chapterList.findIndex((c) => c.chapterNumber === parsedParam)
          : -1;

        // If param is valid but not found in list → fallback to first chapter
        // If param is invalid → treat as no param (new chapter mode)
        const idx =
          targetIdx !== -1
            ? targetIdx
            : isValidParam && chapterList.length > 0
              ? 0
              : -1;

        if (idx === -1) {
          const nextNum =
            chapterList.length === 0
              ? 1
              : Math.max(...chapterList.map((c) => c.chapterNumber)) + 1;
          const newTitle = `Chương ${nextNum}`;
          form.setValues({ title: newTitle, chapterType: "free", price: 1 });
          return;
        }

        const ch = chapterList[idx];
        setSelectedChapterIndex(idx);

        // Sync URL if param didn't match (fallback case)
        if (targetIdx === -1) {
          setSearchParams(
            { chapter: String(ch.chapterNumber) },
            { replace: true },
          );
        }

        form.setValues({
          title: ch.title,
          chapterType: ch.isPremium ? "vip" : "free",
          price: ch.price || 1,
        });
        setContentError(undefined);
        setSaved(true);
        setChapterListOpened(false);

        // Fetch chapter content from the server
        try {
          const fullChapter = await AuthorService.getChapterById(ch.id);
          const html = fullChapter.contentURL ?? "";
          setEditorInitialContent(html);
          setContentPayload({ mode: "editor", html });
        } catch {
          setEditorInitialContent("");
          setContentPayload(null);
        }
      })
      .catch(() => {
        showError("Không thể tải thông tin tác phẩm");
        navigate(-1);
      })
      .finally(() => setStoryLoading(false));
  }, [storySlug, chapterParam, loadChapters, navigate]);

  // Auto-focus title when entering new chapter mode (page load with no chapter param)
  useEffect(() => {
    if (!storyLoading && selectedChapterIndex === null) {
      const timer = setTimeout(() => titleInputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [storyLoading, selectedChapterIndex]);

  // Track changes after save - compare with last saved state
  useEffect(() => {
    if (saved) {
      const currentContent = contentPayload?.html ?? "";
      const currentTitle = form.values.title;
      const currentChapterType = form.values.chapterType;

      const hasContentChanged = currentContent !== lastSavedContentRef.current;
      const hasTitleChanged = currentTitle !== lastSavedTitleRef.current;
      const hasTypeChanged =
        currentChapterType !== lastSavedChapterTypeRef.current;

      if (hasContentChanged || hasTitleChanged || hasTypeChanged) {
        setHasChangesAfterSave(true);
      }
    }
  }, [contentPayload, form.values.title, form.values.chapterType, saved]);

  // Detect unsaved changes before leaving page
  useEffect(() => {
    if (!saved && contentPayload) {
      // Push state once to intercept browser back button
      if (!hasStateRef.current) {
        window.history.pushState(null, "", window.location.href);
        hasStateRef.current = true;
        extraPushesRef.current = 1;
      }

      const handlePopState = () => {
        if (!isExitingRef.current) {
          // Re-push state to keep user on page, track count
          window.history.pushState(null, "", window.location.href);
          extraPushesRef.current += 1;
          setUnsavedExitModalOpened(true);
        }
      };

      window.addEventListener("popstate", handlePopState);

      // Browser back/refresh
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
        return "";
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    } else {
      // Reset flags when saved or content cleared
      hasStateRef.current = false;
      extraPushesRef.current = 0;
    }
  }, [saved, contentPayload]);

  const handleNewPart = async () => {
    if (!story) return;
    setChapterListOpened(false);

    const newNum = nextChapterNumber;
    const newTitle = `Chương ${newNum}`;

    // Pre-fill UI immediately for instant feedback
    setSelectedChapterIndex(null);
    form.setValues({ title: newTitle, chapterType: "free", price: 1 });
    setEditorInitialContent("");
    setEditorResetKey((k) => k + 1);
    setContentPayload(null);
    setContentError(undefined);
    setSaved(false);

    // Auto-create draft on server immediately (Wattpad-style)
    setSavingLoading(true);
    try {
      const formData = new FormData();
      formData.append("storyId", story._id);
      formData.append("chapterNumber", String(newNum));
      formData.append("title", newTitle);
      formData.append("status", "draft");
      formData.append("chapterType", "free");
      const blob = new Blob(["<p></p>"], { type: "text/html" });
      formData.append("file", blob, `${newTitle}.html`);

      await AuthorService.createChapter(formData);
      const updatedChapters = await loadChapters(story._id);

      const newIdx = updatedChapters.findIndex(
        (c) => c.chapterNumber === newNum,
      );
      const idx = newIdx !== -1 ? newIdx : updatedChapters.length - 1;
      setSelectedChapterIndex(idx);
      setSearchParams({ chapter: String(newNum) }, { replace: true });
      setContentPayload({ mode: "editor", html: "" });
      setSaved(true);
    } catch {
      showError("Không thể tạo chương mới. Vui lòng thử lại.");
    } finally {
      setSavingLoading(false);
      // Focus title input regardless of success/failure
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  };

  const buildFormData = (
    values: WriteChapterFormValues,
    status: "draft" | "pending",
  ): FormData | null => {
    if (!story) return null;

    if (!contentPayload) {
      setContentError("Vui lòng nhập nội dung chương");
      return null;
    }

    // Extract plain text and check if content is empty
    const plain = contentPayload.html.replace(/<[^>]+>/g, " ").trim();
    if (!plain) {
      setContentError("Nội dung chương không được bỏ trống");
      return null;
    }

    // Check word count for publish
    const words = plain.split(/\s+/).filter(Boolean).length;
    if (status === "pending" && words < 50) {
      setContentError(
        `Nội dung chương phải có ít nhất 50 từ (hiện tại: ${words} từ)`,
      );
      return null;
    }

    setContentError(undefined);

    const formData = new FormData();
    formData.append("storyId", story._id);
    formData.append(
      "chapterNumber",
      String(
        selectedChapterIndex !== null
          ? chapters[selectedChapterIndex].chapterNumber
          : nextChapterNumber,
      ),
    );
    formData.append("title", values.title);
    formData.append("status", status);

    const blob = new Blob([contentPayload.html], { type: "text/html" });
    formData.append("file", blob, `${values.title}.html`);

    formData.append("chapterType", values.chapterType);

    if (values.chapterType === "vip") {
      const priceVal = values.price as number | undefined;
      if (!priceVal || !Number.isInteger(priceVal) || priceVal < 1) {
        showError("Giá chương phải là số nguyên dương (>=1)");
        return null;
      }
      formData.append("price", String(priceVal));
    }
    return formData;
  };

  const handleSave = async () => {
    const result = form.validate();
    if (result.hasErrors) return;

    const formData = buildFormData(form.values, "draft");
    if (!formData || !story) return;

    setSavingLoading(true);
    try {
      if (selectedChapterIndex !== null) {
        // Update existing chapter
        const chapterId = chapters[selectedChapterIndex].id;
        await AuthorService.updateChapter(chapterId, formData);
      } else {
        // Create new chapter
        await AuthorService.createChapter(formData);
      }

      showSuccess("Chương đã được lưu nháp!");
      setSaved(true);
      setHasChangesAfterSave(false);
      // Save current state as last saved state
      lastSavedContentRef.current = contentPayload?.html ?? "";
      lastSavedTitleRef.current = form.values.title;
      lastSavedChapterTypeRef.current = form.values.chapterType;

      const updatedChapters = await loadChapters(story._id);
      // If we just created a new chapter, select it
      if (selectedChapterIndex === null) {
        const newIdx = updatedChapters.findIndex(
          (c) => c.chapterNumber === nextChapterNumber,
        );
        if (newIdx !== -1) setSelectedChapterIndex(newIdx);
      }
    } catch {
      showError("Có lỗi xảy ra khi lưu chương. Vui lòng thử lại.");
    } finally {
      setSavingLoading(false);
    }
  };

  const handlePublishClick = async () => {
    // Check if there are unsaved changes after last save
    if (hasChangesAfterSave) {
      setUnsavedPublishModalOpened(true);
      return;
    }

    await proceedWithPublish();
  };

  const proceedWithPublish = async () => {
    const result = form.validate();
    if (result.hasErrors) return;

    // Check word count BEFORE saving
    if (!contentPayload) {
      showError("Nội dung chương không được bỏ trống");
      return;
    }
    const plain = contentPayload.html.replace(/<[^>]+>/g, " ").trim();
    const words = plain.split(/\s+/).filter(Boolean).length;
    if (words < 50) {
      showError(
        `Nội dung chương phải có ít nhất 50 từ (hiện tại: ${words} từ)`,
      );
      return;
    }

    const formData = buildFormData(form.values, "draft");
    if (!formData || !story) return;

    // First save current chapter as draft
    setPublishingLoading(true);
    try {
      let chapterId: string;
      if (selectedChapterIndex !== null) {
        chapterId = chapters[selectedChapterIndex].id;
        await AuthorService.updateChapter(chapterId, formData);
      } else {
        const newChapter = await AuthorService.createChapter(formData);
        chapterId = newChapter.id;
      }

      setSaved(true);
      setHasChangesAfterSave(false);
      // Update last saved state
      lastSavedContentRef.current = contentPayload?.html ?? "";
      lastSavedTitleRef.current = form.values.title;
      lastSavedChapterTypeRef.current = form.values.chapterType;
      await loadChapters(story._id);

      if (story.status === "active") {
        // Story already published: only submit this chapter for review
        await AuthorService.submitChapterForReview(chapterId);
        await loadChapters(story._id);
        showSuccess(
          "Chương đã được gửi duyệt! Vui lòng chờ admin phê duyệt.",
          "Gửi duyệt thành công",
        );
      } else {
        // First publish: open modal to publish whole story
        setPublishModalOpened(true);
      }
    } catch {
      showError("Có lỗi xảy ra khi lưu chương. Vui lòng thử lại.");
    } finally {
      setPublishingLoading(false);
    }
  };

  const handleDeleteChapter = async () => {
    if (selectedChapterIndex === null || !story) return;
    const chapterId = chapters[selectedChapterIndex].id;
    setDeleteLoading(true);
    try {
      await AuthorService.deleteChapter(chapterId);
      showSuccess("Đã xóa chương thành công!");
      setDeleteModalOpened(false);
      const updatedChapters = await loadChapters(story._id);
      // Move to first remaining chapter, or new chapter mode if none left
      if (updatedChapters.length > 0) {
        const newIdx = Math.min(
          selectedChapterIndex,
          updatedChapters.length - 1,
        );
        setSelectedChapterIndex(newIdx);
        const ch = updatedChapters[newIdx];
        form.setValues({
          title: ch.title,
          chapterType: ch.isPremium ? "vip" : "free",
          price: ch.price || 1,
        });
        const fullChapter = await AuthorService.getChapterById(ch.id);
        const html = fullChapter.contentURL ?? "";
        setEditorInitialContent(html);
        setEditorResetKey((k) => k + 1);
        setContentPayload({ mode: "editor", html });
      } else {
        setSelectedChapterIndex(null);
        const nextNum = 1;
        form.setValues({
          title: `Chương ${nextNum}`,
          chapterType: "free",
          price: 1,
        });
        setEditorInitialContent("");
        setEditorResetKey((k) => k + 1);
        setContentPayload(null);
      }
      setSaved(false);
      setContentError(undefined);
    } catch {
      showError("Có lỗi xảy ra khi xóa chương. Vui lòng thử lại.");
    } finally {
      setDeleteLoading(false);
    }
  };

  if (storyLoading) {
    return (
      <Box className="min-h-screen bg-[#f8f4ef] dark:bg-gray-900 flex items-center justify-center">
        <Stack align="center" gap="sm">
          <Loader color="blue" />
          <Text c="dimmed" size="sm">
            Đang tải thông tin truyện...
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box className="bg-[#f3f3f3] dark:bg-gray-900 min-h-screen">
      {/* ── Chapter List Modal ── */}
      <Modal
        opened={chapterListOpened}
        onClose={() => setChapterListOpened(false)}
        centered
        size="lg"
        radius="lg"
        withCloseButton
        title={
          <Title order={2} ta="center" w="100%" size="h4">
            {story?.title ?? "Danh sách chương"}
          </Title>
        }
        styles={{
          header: { width: "100%" },
          title: { width: "100%" },
          body: { paddingTop: 8 },
        }}
      >
        <Stack gap={0}>
          <ScrollArea.Autosize mah={520} offsetScrollbars>
            <Stack gap="sm" px="md">
              {chapters.map((ch, idx) => {
                const cfg =
                  statusConfig[ch.status ?? "draft"] ?? statusConfig.draft;
                return (
                  <Flex
                    key={ch.id}
                    justify="space-between"
                    align="center"
                    p="sm"
                    onClick={() => handleSelectChapter(idx)}
                    className={`border border-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      selectedChapterIndex === idx
                        ? "bg-blue-50 dark:bg-blue-900/30"
                        : ""
                    }`}
                  >
                    <Stack gap={4} style={{ flex: 1 }}>
                      <Group gap="sm">
                        <Text fw={500} size="sm">
                          Chương {ch.chapterNumber}
                        </Text>
                        <Badge size="sm" variant="light" color={cfg.color}>
                          {cfg.label}
                        </Badge>
                      </Group>
                      <Text size="sm" c="dimmed" lineClamp={1}>
                        {ch.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        Cập nhật{" "}
                        {timeAgo(
                          ch.updatedAt ||
                            ch.createdAt ||
                            new Date().toISOString(),
                        )}
                      </Text>
                    </Stack>
                    {selectedChapterIndex === idx && (
                      <Check size={18} color="var(--mantine-color-teal-6)" />
                    )}
                  </Flex>
                );
              })}

              {/* Virtual entry for unsaved new chapter */}
              {selectedChapterIndex === null && (
                <Flex
                  justify="space-between"
                  align="center"
                  p="sm"
                  className="bg-blue-50 dark:bg-blue-900/30 border border-gray-200 dark:border-gray-600 rounded-md"
                >
                  <Stack gap={4} style={{ flex: 1 }}>
                    <Group gap="sm">
                      <Text fw={500} size="sm">
                        Chương {nextChapterNumber}
                      </Text>
                      <Badge size="sm" variant="light" color="gray">
                        Bản nháp
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {form.values.title || `Chương ${nextChapterNumber}`}
                    </Text>
                    <Text size="xs" c="dimmed">
                      Chưa lưu
                    </Text>
                  </Stack>
                  <Check size={18} color="var(--mantine-color-teal-6)" />
                </Flex>
              )}
            </Stack>
          </ScrollArea.Autosize>

          <Button
            color="blue"
            leftSection={
              savingLoading ? <Loader size={14} /> : <Plus size={16} />
            }
            mt="md"
            onClick={handleNewPart}
            fullWidth
            disabled={savingLoading}
            loading={savingLoading}
          >
            {savingLoading ? "Đang tạo chương..." : "Chương mới"}
          </Button>
        </Stack>
      </Modal>
      {/* ── Header ── */}
      <Box
        style={{
          borderBottom: "1px solid var(--mantine-color-gray-3)",
          backgroundColor: "var(--mantine-color-body)",
        }}
      >
        <Container size="xl" py={8}>
          <Group justify="space-between" align="center">
            {/* Left: Back + Story info + Chapter dropdown */}
            <Group align="center" gap="sm">
              {/* Back button */}
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => navigate(-1)}
                title="Quay lại"
              >
                <ChevronLeft size={20} />
              </ActionIcon>

              {/* Story thumbnail */}
              {story?.image && (
                <Image
                  src={story.image}
                  alt={story.title}
                  w={36}
                  h={48}
                  radius={4}
                  fit="cover"
                  style={{ flexShrink: 0 }}
                />
              )}

              {/* Story title + Chapter modal trigger */}
              <Stack gap={0}>
                <Group
                  gap={4}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (story) loadChapters(story._id);
                    setChapterListOpened(true);
                  }}
                >
                  <Text size="xs" c="blue" fw={500}>
                    {story?.title ?? "Truyện"}
                  </Text>
                  <ChevronDown size={12} color="var(--mantine-color-blue-6)" />
                </Group>

                <Text fw={600} size="sm" lineClamp={1}>
                  {currentChapterTitle}
                </Text>

                <Group gap={6}>
                  <Badge
                    size="xs"
                    variant="light"
                    color={
                      selectedChapterIndex !== null
                        ? (statusConfig[
                            chapters[selectedChapterIndex]?.status ?? "draft"
                          ]?.color ?? "gray")
                        : "gray"
                    }
                  >
                    {selectedChapterIndex !== null
                      ? (statusConfig[
                          chapters[selectedChapterIndex]?.status ?? "draft"
                        ]?.label ?? "Bản nháp")
                      : "Bản nháp"}
                  </Badge>
                  <Text size="xs" c="dimmed">
                    ({wordCount} từ)
                  </Text>
                  {saved && (
                    <Text size="xs" c="teal" fw={500}>
                      Đã lưu
                    </Text>
                  )}
                </Group>
              </Stack>
            </Group>

            {/* Right: Action buttons */}
            <Group gap="xs">
              <Stack gap={0}>
                <Group gap="xs">
                  <Button
                    color="blue"
                    size="sm"
                    loading={publishingLoading}
                    disabled={
                      !contentPayload || wordCount === 0 || savingLoading
                    }
                    title={
                      savingLoading
                        ? "Chờ lưu xong trước khi đăng"
                        : !contentPayload || wordCount === 0
                          ? "Vui lòng nhập nội dung chương"
                          : wordCount < 50
                            ? `Cần ${50 - wordCount} từ nữa để gửi duyệt`
                            : ""
                    }
                    leftSection={<Send size={14} />}
                    onClick={handlePublishClick}
                  >
                    Đăng
                  </Button>
                  <Button
                    variant="outline"
                    color="dark"
                    size="sm"
                    leftSection={<Save size={14} />}
                    onClick={handleSave}
                    loading={savingLoading}
                    disabled={publishingLoading}
                  >
                    Lưu
                  </Button>

                  {/* More menu: chapter settings */}
                  <Menu shadow="md" width={280} position="bottom-end">
                    <Menu.Target>
                      <ActionIcon variant="subtle" color="gray" size="lg">
                        <MoreVertical size={20} />
                      </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                      <Menu.Label>Cài đặt chương</Menu.Label>

                      <Menu.Item closeMenuOnClick={false}>
                        <Text size="xs" fw={500} mb="xs" c="dimmed">
                          Loại chương
                        </Text>
                        <Radio.Group
                          value={form.values.chapterType}
                          onChange={(val) =>
                            form.setFieldValue(
                              "chapterType",
                              val as "free" | "vip",
                            )
                          }
                          size="xs"
                        >
                          <Group>
                            <Radio value="free" label="Miễn phí" />
                            <Radio value="vip" label="Trả phí" />
                          </Group>
                        </Radio.Group>
                      </Menu.Item>

                      <Divider my="xs" />

                      {form.values.chapterType === "vip" && (
                        <Menu.Item closeMenuOnClick={false}>
                          <Text size="xs" fw={500} mb="xs" c="dimmed">
                            Giá chương (Stone)
                          </Text>
                          <NumberInput
                            placeholder="1"
                            min={1}
                            step={1}
                            size="xs"
                            {...form.getInputProps("price")}
                          />
                        </Menu.Item>
                      )}

                      {selectedChapterIndex !== null && (
                        <>
                          <Divider my="xs" />
                          <Menu.Item
                            color="red"
                            leftSection={<Trash2 size={14} />}
                            onClick={() => setDeleteModalOpened(true)}
                          >
                            Xóa chương này
                          </Menu.Item>
                        </>
                      )}
                    </Menu.Dropdown>
                  </Menu>
                </Group>
              </Stack>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ── Content Area ── */}
      <Container size="md" py="xl">
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack gap="lg">
            {/* Chapter title input - centered, clean */}
            <TextInput
              ref={titleInputRef}
              placeholder="Tiêu đề chương..."
              variant="unstyled"
              size="xl"
              styles={{
                input: {
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "var(--mantine-color-text)",
                  border: "none",
                  background: "transparent",
                },
              }}
              {...form.getInputProps("title")}
            />

            {/* Chapter content editor */}
            <Box
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              p="md"
            >
              <ChapterContentInput
                key={editorResetKey}
                onChange={(payload) => {
                  setContentPayload(payload);
                  if (payload) setContentError(undefined);
                  setSaved(false);
                }}
                initialContent={editorInitialContent}
                error={contentError}
              />
            </Box>

            {/* Word count warning below editor */}
            {wordCount < 50 && contentPayload && wordCount > 0 && (
              <Text size="sm" c="red" fw={500}>
                Cần thêm {50 - wordCount} từ để gửi duyệt
              </Text>
            )}
          </Stack>
        </form>
      </Container>

      {/* ── Publish Modal ── */}
      {story && (
        <PublishStoryModal
          opened={publishModalOpened}
          onClose={() => setPublishModalOpened(false)}
          story={story}
          currentChapterTitle={currentChapterTitle}
        />
      )}

      {/* ── Unsaved Changes Exit Modal ── */}
      <Modal
        opened={unsavedExitModalOpened}
        onClose={() => {
          setUnsavedExitModalOpened(false);
          isExitingRef.current = false;
        }}
        centered
        title="Có thay đổi chưa được lưu"
      >
        <Stack gap="md">
          <Text>
            Bạn có những thay đổi chưa được lưu. Bạn có chắc muốn thoát?
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => {
                setUnsavedExitModalOpened(false);
                isExitingRef.current = false;
              }}
            >
              Tiếp tục chỉnh sửa
            </Button>
            <Button
              color="red"
              onClick={() => {
                isExitingRef.current = true;
                setUnsavedExitModalOpened(false);
                // If returnTo URL is available, use it; otherwise fall back to history.go()
                if (returnTo) {
                  navigate(returnTo, { replace: true });
                } else {
                  // Go back past all pushed dummy states + 1 to reach the actual previous page
                  window.history.go(-(extraPushesRef.current + 1));
                }
              }}
            >
              Thoát không lưu
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ── Unsaved Changes Before Publish Modal ── */}
      <Modal
        opened={unsavedPublishModalOpened}
        onClose={() => setUnsavedPublishModalOpened(false)}
        centered
        title="Có thay đổi chưa được lưu"
      >
        <Stack gap="md">
          <Text>
            Bạn có những thay đổi chưa được lưu. Vui lòng lưu trước khi đăng.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="outline"
              onClick={() => {
                setUnsavedPublishModalOpened(false);
              }}
            >
              Quay lại chỉnh sửa
            </Button>
            <Button
              color="blue"
              onClick={async () => {
                setUnsavedPublishModalOpened(false);
                await handleSave();
              }}
            >
              Lưu và tiếp tục
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ── Delete Chapter Modal ── */}
      <ConfirmDeleteModal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        onConfirm={handleDeleteChapter}
        loading={deleteLoading}
        title="Xác nhận xóa chương"
        message={`Bạn có chắc chắn muốn xóa "${
          selectedChapterIndex !== null
            ? chapters[selectedChapterIndex]?.title ||
              `Chương ${chapters[selectedChapterIndex]?.chapterNumber}`
            : ""
        }"? Hành động này không thể hoàn tác.`}
      />
    </Box>
  );
}
