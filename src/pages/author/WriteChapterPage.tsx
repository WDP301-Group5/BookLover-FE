import {
  Box,
  Button,
  Container,
  Loader,
  Stack,
  Text,
  ActionIcon,
  Group,
  Menu,
  NumberInput,
  Radio,
  Divider,
  Image,
  Popover,
  Badge,
  TextInput,
} from "@mantine/core";
import {
  ChapterContentInput,
  type ContentPayload,
} from "../../components/author/ChapterContentInput";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  ChevronLeft,
  ChevronDown,
  Send,
  Save,
  MoreVertical,
  Plus,
  Check,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import type { Story } from "../../interfaces/Story";
import type { Chapter } from "../../interfaces/Chapter";
import { AuthorService } from "../../services/AuthorService";
import { showError, showSuccess } from "../../utils/notifications.tsx";
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

const statusLabel: Record<string, string> = {
  draft: "Bản nháp",
  pending: "Chờ duyệt",
  active: "Đã duyệt",
  rejected: "Bị từ chối",
  banned: "Bị cấm",
};

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function WriteChapterPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams<{ storySlug: string }>();
  const [searchParams] = useSearchParams();
  const chapterParam = searchParams.get("chapter");
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [storyLoading, setStoryLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
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
  const titleInputRef = useRef<HTMLInputElement>(null);

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
      .then(async ({ story: storyData, chapters: chapterList }) => {
        // Select chapter from URL param, or start in new-chapter mode if no param
        const targetNumber = chapterParam ? Number(chapterParam) : null;
        const targetIdx =
          targetNumber !== null
            ? chapterList.findIndex((c) => c.chapterNumber === targetNumber)
            : -1;
        const idx = targetIdx !== -1 ? targetIdx : -1;

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
    setLoading(true);
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

      const newIdx = updatedChapters.findIndex((c) => c.chapterNumber === newNum);
      const idx = newIdx !== -1 ? newIdx : updatedChapters.length - 1;
      setSelectedChapterIndex(idx);
      setContentPayload({ mode: "editor", html: "" });
      setSaved(true);
    } catch {
      showError("Không thể tạo chương mới. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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

    setLoading(true);
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
      setLoading(false);
    }
  };

  const handlePublishClick = async () => {
    const result = form.validate();
    if (result.hasErrors) return;

    const formData = buildFormData(form.values, "draft");
    if (!formData || !story) return;

    // First save current chapter as draft
    setLoading(true);
    try {
      if (selectedChapterIndex !== null) {
        const chapterId = chapters[selectedChapterIndex].id;
        await AuthorService.updateChapter(chapterId, formData);
      } else {
        await AuthorService.createChapter(formData);
      }

      setSaved(true);
      await loadChapters(story._id);

      // Then open publish modal
      setPublishModalOpened(true);
    } catch {
      showError("Có lỗi xảy ra khi lưu chương. Vui lòng thử lại.");
    } finally {
      setLoading(false);
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
            Đang tải thông tin tác phẩm...
          </Text>
        </Stack>
      </Box>
    );
  }

  return (
    <Box className="bg-[#f3f3f3] dark:bg-gray-900 min-h-screen">
      {/* Backdrop overlay when chapter list is open */}
      {chapterListOpened && (
        <Box
          onClick={() => setChapterListOpened(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 299,
            opacity: 0,
          }}
        />
      )}
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
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => navigate(-1)}
                color="gray"
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

              {/* Story title + Chapter dropdown */}
              <Stack gap={0}>
                <Popover
                  opened={chapterListOpened}
                  onChange={(o) => {
                    setChapterListOpened(o);
                    if (o && story) loadChapters(story._id);
                  }}
                  position="bottom-start"
                  shadow="md"
                  width={320}
                  zIndex={300}
                  trapFocus
                  closeOnEscape
                >
                  <Popover.Target>
                    <Group
                      gap={4}
                      style={{ cursor: "pointer" }}
                      onClick={() => setChapterListOpened((o) => !o)}
                    >
                      <Text size="xs" c="blue" fw={500}>
                        {story?.title ?? "Truyện"}
                      </Text>
                      <ChevronDown
                        size={12}
                        color="var(--mantine-color-blue-6)"
                      />
                    </Group>
                  </Popover.Target>

                  <Popover.Dropdown p={0}>
                    <Stack gap={0}>
                      {chapters.map((ch, idx) => (
                        <Group
                          key={ch.id}
                          justify="space-between"
                          px="md"
                          py="sm"
                          onClick={() => handleSelectChapter(idx)}
                          style={{ cursor: "pointer" }}
                          className={`border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                            selectedChapterIndex === idx
                              ? "bg-blue-50 dark:bg-blue-900/30"
                              : ""
                          }`}
                        >
                          <Stack gap={2}>
                            <Text size="sm" fw={500} lineClamp={1}>
                              {ch.title || `Chương ${ch.chapterNumber}`}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {statusLabel[ch.status ?? "draft"] ?? "Bản nháp"}{" "}
                              - {formatDate(ch.createdAt)}
                            </Text>
                          </Stack>
                          {selectedChapterIndex === idx && (
                            <Check
                              size={18}
                              color="var(--mantine-color-teal-6)"
                            />
                          )}
                        </Group>
                      ))}

                      {/* Virtual entry for unsaved new chapter */}
                      {selectedChapterIndex === null && (
                        <Group
                          justify="space-between"
                          px="md"
                          py="sm"
                          className="bg-blue-50 dark:bg-blue-900/30 border-b border-gray-200 dark:border-gray-600"
                        >
                          <Stack gap={2}>
                            <Text size="sm" fw={500} lineClamp={1}>
                              {form.values.title ||
                                `Chương ${nextChapterNumber}`}
                            </Text>
                            <Text size="xs" c="dimmed">
                              Bản nháp - Chưa lưu
                            </Text>
                          </Stack>
                          <Check
                            size={18}
                            color="var(--mantine-color-teal-6)"
                          />
                        </Group>
                      )}

                      <Box px="md" py="sm">
                        <Button
                          fullWidth
                          color="blue"
                          size="xs"
                          leftSection={<Plus size={14} />}
                          onClick={handleNewPart}
                        >
                          Chương mới
                        </Button>
                      </Box>
                    </Stack>
                  </Popover.Dropdown>
                </Popover>

                <Text fw={600} size="sm" lineClamp={1}>
                  {currentChapterTitle}
                </Text>

                <Group gap={6}>
                  <Badge size="xs" variant="light" color="gray">
                    {selectedChapterIndex !== null
                      ? (statusLabel[
                          chapters[selectedChapterIndex]?.status ?? "draft"
                        ] ?? "Bản nháp")
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
              <Button
                color="blue"
                size="sm"
                loading={loading}
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
                loading={loading}
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
                        form.setFieldValue("chapterType", val as "free" | "vip")
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
