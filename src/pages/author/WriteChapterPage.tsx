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
} from "lucide-react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { z } from "zod";
import type { Story } from "../../interfaces/Story";
import type { Chapter } from "../../interfaces/Chapter";
import { AuthorService } from "../../services/AuthorService";
import { showError, showSuccess } from "../../utils/notifications.tsx";
import PublishStoryModal from "../../components/author/PublishStoryModal.tsx";

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

  const generateChapterTitle = (partNumber: number) => {
    if (story) return `Chương ${partNumber}`;
  };

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
        const targetNumber = chapterParam ? Number(chapterParam) : null;
        const targetIdx =
          targetNumber !== null
            ? chapterList.findIndex((c) => c.chapterNumber === targetNumber)
            : -1;
        const idx = targetIdx !== -1 ? targetIdx : -1;

        if (idx === -1) {
          // No matching chapter or no param → new chapter mode, auto-fill title
          const nextNum =
            chapterList.length === 0
              ? 1
              : Math.max(...chapterList.map((c) => c.chapterNumber)) + 1;
          form.setValues({
            title: `Chương ${nextNum}`,
            chapterType: "free",
            price: 1,
          });
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

  const handleNewPart = () => {
    setSelectedChapterIndex(null);
    form.setValues({
      title: generateChapterTitle(nextChapterNumber),
      chapterType: "free",
      price: 1,
    });
    setEditorInitialContent("");
    setEditorResetKey((k) => k + 1);
    setContentPayload(null);
    setContentError(undefined);
    setSaved(false);
    setChapterListOpened(false);
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
    if (status === "pending" && contentPayload.mode === "editor") {
      const plain = contentPayload.html.replace(/<[^>]+>/g, " ").trim();
      const wc = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
      if (wc < 50) {
        setContentError(
          `Nội dung chương phải có ít nhất 50 từ để đăng (hiện tại: ${wc} từ)`,
        );
        return null;
      }
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

  if (storyLoading) {
    return (
      <Box className="min-h-screen bg-[#f8f4ef] flex items-center justify-center">
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
    <Box className="bg-[#f3f3f3]">
      {/* ── Header ── */}
      <Box
        style={{
          borderBottom: "1px solid #dfdfdf",
          backgroundColor: "white",
        }}
      >
        <Container size="xl" py={8}>
          <Group justify="space-between" align="center">
            {/* Left: Back + Story info + Chapter dropdown */}
            <Group align="center" gap="sm">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => navigate(`/author/my-stories`)}
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
                  onChange={setChapterListOpened}
                  position="bottom-start"
                  shadow="md"
                  width={320}
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
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedChapterIndex === idx
                                ? "#f0f9ff"
                                : undefined,
                            borderBottom: "1px solid #f0f0f0",
                          }}
                          className="hover:bg-gray-50"
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
                          style={{
                            backgroundColor: "#f0f9ff",
                            borderBottom: "1px solid #f0f0f0",
                          }}
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
                          color="orange"
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
              placeholder="Tiêu đề chương..."
              variant="unstyled"
              size="xl"
              styles={{
                input: {
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: 600,
                  color: "#333",
                  border: "none",
                  background: "transparent",
                },
              }}
              {...form.getInputProps("title")}
            />

            {/* Chapter content editor */}
            <Box className="bg-white rounded-lg border border-gray-200" p="md">
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
    </Box>
  );
}
