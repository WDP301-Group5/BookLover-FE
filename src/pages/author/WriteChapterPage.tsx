import {
  Box,
  Button,
  Container,
  Divider,
  Group,
  Loader,
  Paper,
  Radio,
  Stack,
  Text,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
  NumberInput,
  Badge,
  Alert,
  FileInput,
  Table,
  ActionIcon,
  SegmentedControl,
  Modal,
} from "@mantine/core";
import {
  ChapterContentInput,
  type ContentPayload,
} from "../../components/author/ChapterContentInput";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import {
  BookOpen,
  ChevronLeft,
  Save,
  Send,
  Info,
  Layers,
  Plus,
  Trash2,
  FileText,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";
import type { Story } from "../../interfaces/Story";
import { AuthorService } from "../../services/AuthorService";
import { ChapterPageService } from "../../services/ChapterService";
import { showError, showSuccess } from "../../utils/notifications.tsx";

const writeChapterSchema = z.object({
  chapterNumber: z
    .number({ error: "Số chương không hợp lệ" })
    .int("Số chương phải là số nguyên")
    .min(1, "Số chương phải lớn hơn 0"),
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

interface BatchChapterInput {
  id: string;
  chapterNumber: number;
  title: string;
  chapterType: "free" | "vip";
  price: number | null;
  inputMode: "file" | "rte";
  file: File | null;
  content: string | null;
}

export default function WriteChapterPage() {
  const navigate = useNavigate();
  const { storySlug } = useParams<{ storySlug: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [storyLoading, setStoryLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submittedAction, setSubmittedAction] = useState<"draft" | "pending">(
    "draft",
  );
  const [contentPayload, setContentPayload] = useState<ContentPayload | null>(
    null,
  );
  const [contentError, setContentError] = useState<string | undefined>();

  // Batch mode
  const [mode, setMode] = useState<"single" | "batch">("single");
  const [batchChapters, setBatchChapters] = useState<BatchChapterInput[]>([
    {
      id: "0",
      chapterNumber: 1,
      title: "",
      chapterType: "free",
      price: null,
      inputMode: "file",
      file: null,
      content: null,
    },
  ]);
  const [batchErrors, setBatchErrors] = useState<{ [key: string]: string }>({});
  const [editingChapterId, setEditingChapterId] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const form = useForm<WriteChapterFormValues>({
    initialValues: {
      chapterNumber: 1,
      title: "",
      chapterType: "free",
      price: 1,
    },
    validate: zod4Resolver(writeChapterSchema),
  });

  useEffect(() => {
    if (!storySlug) return;
    setStoryLoading(true);
    AuthorService.getStoryBySlug(storySlug)
      .then((data) => {
        setStory(data);
        // Pre-select chapter type based on story's isPremium setting
        if (data.isPremium) {
          form.setFieldValue("chapterType", "vip");
        }
        // Suggest next chapter number
        return AuthorService.getChaptersByStory(data._id);
      })
      .then((chapters) => {
        if (chapters.length > 0) {
          const maxNum = Math.max(...chapters.map((c) => c.chapterNumber));
          form.setFieldValue("chapterNumber", maxNum + 1);
        }
      })
      .catch(() => {
        showError("Không thể tải thông tin tác phẩm");
        navigate(-1);
      })
      .finally(() => setStoryLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storySlug]);

  // Batch mode handlers
  const addBatchChapter = () => {
    const newId = Date.now().toString();
    const maxChapterNumber = Math.max(
      ...batchChapters.map((c) => c.chapterNumber),
      0,
    );
    const newChapter: BatchChapterInput = {
      id: newId,
      chapterNumber: maxChapterNumber + 1,
      title: "",
      chapterType: "free",
      price: null,
      inputMode: "file",
      file: null,
      content: null,
    };
    setBatchChapters([...batchChapters, newChapter]);
  };

  const removeBatchChapter = (id: string) => {
    if (batchChapters.length === 1) {
      showError("Phải có ít nhất 1 chương");
      return;
    }
    setBatchChapters(batchChapters.filter((c) => c.id !== id));
    const newErrors = { ...batchErrors };
    delete newErrors[`${id}-chapterNumber`];
    delete newErrors[`${id}-title`];
    delete newErrors[`${id}-file`];
    delete newErrors[`${id}-content`];
    setBatchErrors(newErrors);
  };

  const updateBatchChapter = (
    id: string,
    field: keyof BatchChapterInput,
    value: any,
  ) => {
    setBatchChapters(
      batchChapters.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
    const errorKey = `${id}-${field}`;
    if (batchErrors[errorKey]) {
      const newErrors = { ...batchErrors };
      delete newErrors[errorKey];
      setBatchErrors(newErrors);
    }
  };

  const validateBatchChapters = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    batchChapters.forEach((chapter) => {
      if (!chapter.chapterNumber) {
        newErrors[`${chapter.id}-chapterNumber`] = "Số chương là bắt buộc";
        isValid = false;
      }
      if (!chapter.title) {
        newErrors[`${chapter.id}-title`] = "Tiêu đề không được để trống";
        isValid = false;
      }

      // Validate based on input mode
      if (chapter.inputMode === "file") {
        if (!chapter.file) {
          newErrors[`${chapter.id}-file`] = "Vui lòng chọn file";
          isValid = false;
        } else {
          const allowedTypes = [
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/pdf",
            "text/plain",
            "application/msword",
          ];
          if (!allowedTypes.includes(chapter.file.type)) {
            newErrors[`${chapter.id}-file`] =
              "Chỉ hỗ trợ .docx, .pdf, .txt, .doc";
            isValid = false;
          }
          if (chapter.file.size > 50 * 1024 * 1024) {
            newErrors[`${chapter.id}-file`] = "File không được vượt quá 50MB";
            isValid = false;
          }
        }
      } else if (chapter.inputMode === "rte") {
        if (!chapter.content || chapter.content.trim() === "") {
          newErrors[`${chapter.id}-content`] = "Vui lòng nhập nội dung";
          isValid = false;
        } else {
          // Check word count (at least 50 words)
          const plain = chapter.content.replace(/<[^>]+>/g, " ").trim();
          const wc = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
          if (wc < 50) {
            newErrors[`${chapter.id}-content`] = `Ít nhất 50 từ (hiện: ${wc})`;
            isValid = false;
          }
        }
      }
    });

    setBatchErrors(newErrors);
    return isValid;
  };

  const openRTEModal = (chapterId: string) => {
    const chapter = batchChapters.find((c) => c.id === chapterId);
    if (chapter) {
      setEditingChapterId(chapterId);
      setModalContent(chapter.content || "<p></p>");
    }
  };

  const closeRTEModal = () => {
    setEditingChapterId(null);
    setModalContent(null);
  };

  const saveRTEContent = () => {
    if (editingChapterId && modalContent) {
      updateBatchChapter(editingChapterId, "content", modalContent);
    }
    closeRTEModal();
  };

  const handleBatchSubmit = async () => {
    if (!story) {
      showError("Không thể tải thông tin truyện");
      return;
    }

    if (!validateBatchChapters()) {
      showError("Vui lòng kiểm tra và sửa các lỗi");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("storyId", story._id);

      // Add files and collect chapters metadata
      const chaptersData = batchChapters.map((chapter, index) => {
        let fileIndex: number | undefined = undefined;

        if (chapter.inputMode === "file" && chapter.file) {
          // Get the index of this file within all files being uploaded
          const fileCount = batchChapters
            .slice(0, index)
            .filter((c) => c.inputMode === "file" && c.file).length;
          formData.append("files", chapter.file);
          fileIndex = fileCount;
        } else if (chapter.inputMode === "rte" && chapter.content) {
          // Create an HTML file for RTE content
          const blob = new Blob([chapter.content], { type: "text/html" });
          const file = new File(
            [blob],
            `${chapter.title || "chapter"}-${chapter.id}.html`,
            { type: "text/html" },
          );
          const fileCount = batchChapters
            .slice(0, index)
            .filter(
              (c) => c.file || (c.inputMode === "rte" && c.content),
            ).length;
          formData.append("files", file);
          fileIndex = fileCount;
        }

        return {
          chapterNumber: chapter.chapterNumber,
          title: chapter.title,
          chapterType: chapter.chapterType,
          price: chapter.chapterType === "vip" ? chapter.price : undefined,
          fileIndex,
        };
      });

      formData.append("chapters", JSON.stringify(chaptersData));

      const result = await ChapterPageService.createChaptersBatch(formData);

      showSuccess(
        `Tạo thành công ${result.count} chương! Các chương đang chờ admin duyệt.`,
        "được gửi để duyệt",
      );

      // Reset form
      setBatchChapters([
        {
          id: "0",
          chapterNumber: 1,
          title: "",
          chapterType: "free",
          price: null,
          inputMode: "file",
          file: null,
          content: null,
        },
      ]);
      setBatchErrors({});

      // Redirect after a delay
      setTimeout(() => {
        navigate(`/story/${story.slug}`);
      }, 1500);
    } catch (error: any) {
      console.error("Batch upload error:", error);
      showError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Có lỗi xảy ra khi tạo chương",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (
    values: WriteChapterFormValues,
    status: "draft" | "pending",
  ) => {
    if (!story) return;

    // Validate content
    if (!contentPayload) {
      setContentError("Vui lòng nhập nội dung chương");
      return;
    }
    if (contentPayload.mode === "editor") {
      // Strip HTML tags to get plain text for word count
      const plain = contentPayload.html.replace(/<[^>]+>/g, " ").trim();
      const wc = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
      if (wc < 50) {
        setContentError(
          `Nội dung chương phải có ít nhất 50 từ (hiện tại: ${wc} từ)`,
        );
        return;
      }
    }
    setContentError(undefined);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("storyId", story._id);
      formData.append("chapterNumber", String(values.chapterNumber));
      formData.append("title", values.title);

      if (contentPayload.mode === "editor") {
        const blob = new Blob([contentPayload.html], { type: "text/html" });
        formData.append("file", blob, `${values.title}.html`);
      } else {
        formData.append("file", contentPayload.file);
      }

      // Append chapter type
      formData.append("chapterType", values.chapterType);

      // Append price when chapter is VIP and validate
      if (values.chapterType === "vip") {
        const priceVal = values.price as number | undefined;
        if (!priceVal || !Number.isInteger(priceVal) || priceVal < 1) {
          setLoading(false);
          showError("Giá chương phải là số nguyên dương (>=1)");
          return;
        }
        formData.append("price", String(priceVal));
      }

      formData.append("status", status);

      await AuthorService.createChapter(formData);

      showSuccess(
        status === "draft"
          ? "Chương đã được lưu vào nháp!"
          : "Chương đã được gửi để duyệt! Admin sẽ xem xét trong thời gian sớm nhất.",
        status === "draft" ? "Lưu nháp thành công" : "Gửi duyệt thành công",
      );

      navigate(`/story/${story.slug}`);
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
    <Box className="min-h-screen bg-[#f8f4ef]">
      {/* Sticky header */}
      <Box
        className="sticky top-0 z-10 bg-white border-b border-gray-200"
        style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
      >
        <Container size="xl">
          <Group justify="space-between" py="sm">
            <Group gap="xs">
              <Tooltip label="Quay lại tác phẩm">
                <UnstyledButton
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft size={20} />
                </UnstyledButton>
              </Tooltip>
              <Group gap={6}>
                <BookOpen size={20} className="text-blue-500" />
                <Stack gap={0}>
                  <Text size="xs" c="dimmed">
                    Đang viết chương cho
                  </Text>
                  <Text fw={600} size="sm" lineClamp={1} maw={300}>
                    {story?.title ?? "..."}
                  </Text>
                </Stack>
              </Group>
              {story?.isPremium && (
                <Badge color="blue" variant="light" size="sm">
                  VIP
                </Badge>
              )}
            </Group>

            {mode === "single" && (
              <Group gap="sm">
                <Button
                  variant="light"
                  color="violet"
                  leftSection={<Layers size={16} />}
                  onClick={() => setMode("batch")}
                >
                  Batch upload
                </Button>
                <Button
                  variant="outline"
                  color="gray"
                  leftSection={<Save size={16} />}
                  loading={loading && submittedAction === "draft"}
                  onClick={() => {
                    setSubmittedAction("draft");
                    form.onSubmit((v) => handleSubmit(v, "draft"))();
                  }}
                >
                  Lưu nháp
                </Button>
                <Button
                  color="blue"
                  leftSection={<Send size={16} />}
                  loading={loading && submittedAction === "pending"}
                  onClick={() => {
                    setSubmittedAction("pending");
                    form.onSubmit((v) => handleSubmit(v, "pending"))();
                  }}
                >
                  Gửi duyệt
                </Button>
              </Group>
            )}

            {mode === "batch" && (
              <Group gap="sm">
                <Button
                  variant="outline"
                  color="gray"
                  onClick={() => setMode("single")}
                >
                  Về chế độ thường
                </Button>
                <Button
                  color="blue"
                  leftSection={<Send size={16} />}
                  loading={loading}
                  onClick={handleBatchSubmit}
                >
                  Tải lên {batchChapters.length} chương
                </Button>
              </Group>
            )}
          </Group>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        {/* Single mode */}
        {mode === "single" && (
          <form onSubmit={(e) => e.preventDefault()}>
            <Stack gap="lg">
              {/* Chapter metadata */}
              <Paper withBorder p="xl" radius="md" bg="white">
                <Stack gap="md">
                  <Group gap="xs">
                    <Layers size={18} className="text-blue-500" />
                    <Title order={4} fw={600}>
                      Thông tin chương
                    </Title>
                  </Group>
                  <Divider />

                  <Group align="flex-start" gap="md">
                    <NumberInput
                      label="Số chương"
                      placeholder="1"
                      required
                      min={1}
                      w={120}
                      size="md"
                      {...form.getInputProps("chapterNumber")}
                    />
                    <TextInput
                      label="Tiêu đề chương"
                      placeholder="Ví dụ: Khởi đầu cuộc hành trình..."
                      required
                      style={{ flex: 1 }}
                      size="md"
                      {...form.getInputProps("title")}
                    />
                    {form.values.chapterType === "vip" && (
                      <NumberInput
                        label="Giá (Stone)"
                        placeholder="1"
                        required={form.values.chapterType === "vip"}
                        min={1}
                        step={1}
                        w={160}
                        size="md"
                        {...form.getInputProps("price")}
                      />
                    )}
                  </Group>

                  <Stack gap={4}>
                    <Text size="sm" fw={500}>
                      Loại chương
                    </Text>
                    <Radio.Group {...form.getInputProps("chapterType")}>
                      <Group gap="lg">
                        <Radio
                          value="free"
                          label="Miễn phí"
                          color="blue"
                          disabled={story?.isPremium}
                        />
                        <Radio value="vip" label="VIP (Premium)" color="blue" />
                      </Group>
                    </Radio.Group>
                    {story?.isPremium && (
                      <Text size="xs" c="dimmed">
                        Tác phẩm này được đánh dấu VIP nên tất cả chương đều yêu
                        cầu VIP.
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Paper>

              {/* Chapter content */}
              <Paper withBorder p="xl" radius="md" bg="white">
                <Stack gap="md">
                  <Title order={4} fw={600}>
                    Nội dung chương
                  </Title>
                  <Divider />

                  <ChapterContentInput
                    onChange={(payload) => {
                      setContentPayload(payload);
                      if (payload) setContentError(undefined);
                    }}
                    error={contentError}
                  />
                </Stack>
              </Paper>

              {/* Writing tips */}
              <Alert
                icon={<Info size={16} />}
                color="blue"
                variant="light"
                radius="md"
              >
                <Stack gap={4}>
                  <Text size="sm" fw={600}>
                    Mẹo viết chương
                  </Text>
                  <Text size="xs" c="dimmed">
                    Lưu nháp để tiếp tục viết sau. Khi gửi duyệt, chương sẽ được
                    admin xem xét trước khi công khai cho độc giả.
                  </Text>
                </Stack>
              </Alert>
            </Stack>
          </form>
        )}

        {/* Batch mode */}
        {mode === "batch" && (
          <Stack gap="lg">
            {/* Info Alert */}
            <Alert icon={<Info size={16} />} color="blue">
              <Stack gap="xs">
                <Text fw={500}>Hướng dẫn tải lên batch:</Text>
                <Text size="sm">• Tối đa 50 chương mỗi lần</Text>
                <Text size="sm">
                  • File hỗ trợ: .docx, .pdf, .txt (tối đa 50MB mỗi file)
                </Text>
                <Text size="sm">• Số chương phải là duy nhất</Text>
                <Text size="sm">
                  • Các chương sẽ được gửi ngay để admin duyệt
                </Text>
              </Stack>
            </Alert>

            {/* Batch Chapters Table */}
            <Paper withBorder p="md">
              <Stack gap="md">
                <Group justify="space-between">
                  <Title order={3}>
                    Danh sách chương ({batchChapters.length})
                  </Title>
                  <Button
                    leftSection={<Plus size={18} />}
                    onClick={addBatchChapter}
                    variant="light"
                  >
                    Thêm chương
                  </Button>
                </Group>

                <div style={{ overflowX: "auto" }}>
                  <Table striped highlightOnHover>
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th w="8%">Số chương</Table.Th>
                        <Table.Th w="20%">Tiêu đề</Table.Th>
                        <Table.Th w="10%">Loại</Table.Th>
                        <Table.Th w="10%">Giá</Table.Th>
                        <Table.Th w="10%">Nhập</Table.Th>
                        <Table.Th w="32%">Nội dung</Table.Th>
                        <Table.Th w="10%">Hành động</Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {batchChapters.map((chapter) => (
                        <Table.Tr key={chapter.id}>
                          {/* Chapter Number */}
                          <Table.Td>
                            <NumberInput
                              value={chapter.chapterNumber}
                              onChange={(val) =>
                                updateBatchChapter(
                                  chapter.id,
                                  "chapterNumber",
                                  Number(val),
                                )
                              }
                              min={1}
                              size="sm"
                              error={
                                !!batchErrors[`${chapter.id}-chapterNumber`]
                              }
                            />
                            {batchErrors[`${chapter.id}-chapterNumber`] && (
                              <Text c="red" size="xs">
                                {batchErrors[`${chapter.id}-chapterNumber`]}
                              </Text>
                            )}
                          </Table.Td>

                          {/* Title */}
                          <Table.Td>
                            <TextInput
                              value={chapter.title}
                              onChange={(e) =>
                                updateBatchChapter(
                                  chapter.id,
                                  "title",
                                  e.currentTarget.value,
                                )
                              }
                              placeholder="Tiêu đề chương"
                              size="sm"
                              error={!!batchErrors[`${chapter.id}-title`]}
                            />
                            {batchErrors[`${chapter.id}-title`] && (
                              <Text c="red" size="xs">
                                {batchErrors[`${chapter.id}-title`]}
                              </Text>
                            )}
                          </Table.Td>

                          {/* Chapter Type */}
                          <Table.Td>
                            <Radio.Group
                              value={chapter.chapterType}
                              onChange={(val) =>
                                updateBatchChapter(
                                  chapter.id,
                                  "chapterType",
                                  val as "free" | "vip",
                                )
                              }
                            >
                              <Radio value="free" label="Miễn phí" size="sm" />
                              <Radio value="vip" label="VIP" size="sm" />
                            </Radio.Group>
                          </Table.Td>

                          {/* Price */}
                          <Table.Td>
                            <NumberInput
                              value={
                                chapter.chapterType === "vip"
                                  ? chapter.price || ""
                                  : ""
                              }
                              onChange={(val) =>
                                updateBatchChapter(
                                  chapter.id,
                                  "price",
                                  Number(val) || null,
                                )
                              }
                              placeholder="Giá"
                              min={1}
                              size="sm"
                              disabled={chapter.chapterType === "free"}
                            />
                          </Table.Td>

                          {/* Input Mode Toggle */}
                          <Table.Td>
                            <SegmentedControl
                              value={chapter.inputMode}
                              onChange={(val) =>
                                updateBatchChapter(
                                  chapter.id,
                                  "inputMode",
                                  val as "file" | "rte",
                                )
                              }
                              data={[
                                { label: "File", value: "file" },
                                { label: "RTE", value: "rte" },
                              ]}
                              size="sm"
                            />
                          </Table.Td>

                          {/* Content Input */}
                          <Table.Td>
                            {chapter.inputMode === "file" ? (
                              <Group gap="xs">
                                <FileInput
                                  value={chapter.file}
                                  onChange={(file) =>
                                    updateBatchChapter(chapter.id, "file", file)
                                  }
                                  placeholder="Chọn file"
                                  size="sm"
                                  accept=".docx,.pdf,.txt,.doc"
                                  error={!!batchErrors[`${chapter.id}-file`]}
                                  clearable
                                />
                                {chapter.file && (
                                  <Tooltip label={chapter.file.name}>
                                    <Badge variant="light" size="sm">
                                      <FileText size={12} />{" "}
                                      {chapter.file.name.substring(0, 10)}...
                                    </Badge>
                                  </Tooltip>
                                )}
                              </Group>
                            ) : (
                              <Group gap="xs" justify="space-between">
                                <Button
                                  variant="light"
                                  size="sm"
                                  onClick={() => openRTEModal(chapter.id)}
                                  fullWidth
                                >
                                  {chapter.content
                                    ? "Chỉnh sửa"
                                    : "Nhập nội dung"}
                                </Button>
                                {chapter.content && (
                                  <Badge
                                    color="green"
                                    variant="light"
                                    size="sm"
                                  >
                                    ✓
                                  </Badge>
                                )}
                              </Group>
                            )}
                            {batchErrors[`${chapter.id}-file`] &&
                              chapter.inputMode === "file" && (
                                <Text c="red" size="xs">
                                  {batchErrors[`${chapter.id}-file`]}
                                </Text>
                              )}
                            {batchErrors[`${chapter.id}-content`] &&
                              chapter.inputMode === "rte" && (
                                <Text c="red" size="xs">
                                  {batchErrors[`${chapter.id}-content`]}
                                </Text>
                              )}
                          </Table.Td>

                          {/* Actions */}
                          <Table.Td>
                            <Tooltip label="Xóa chương">
                              <ActionIcon
                                color="red"
                                variant="light"
                                onClick={() => removeBatchChapter(chapter.id)}
                                disabled={batchChapters.length === 1}
                                size="sm"
                              >
                                <Trash2 size={14} />
                              </ActionIcon>
                            </Tooltip>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                </div>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Container>

      {/* RTE Modal for Batch Chapter Editing */}
      <Modal
        opened={editingChapterId !== null}
        onClose={closeRTEModal}
        title="Chỉnh sửa nội dung chương"
        size="xl"
        centered
      >
        <Stack gap="md">
          {modalContent !== null && (
            <ChapterContentInput
              initialContent={modalContent}
              onChange={(payload) => {
                if (payload && payload.mode === "editor") {
                  setModalContent(payload.html);
                }
              }}
            />
          )}
          <Group justify="flex-end">
            <Button variant="outline" onClick={closeRTEModal}>
              Hủy
            </Button>
            <Button onClick={saveRTEContent}>Lưu lại</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}
