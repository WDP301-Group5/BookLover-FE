import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FileButton,
  Grid,
  Group,
  Image,
  MultiSelect,
  Paper,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { zod4Resolver } from "mantine-form-zod-resolver";
import { BookOpen, ChevronLeft, ImageIcon, Send, Save } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import type { Topic } from "../../interfaces/Topic";
import { AuthorService } from "../../services/AuthorService";
import { TopicService } from "../../services/TopicService";
import { showError, showSuccess } from "../../utils/notifications.tsx";

const writeStorySchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(200, "Tiêu đề không được vượt quá 200 ký tự"),
  description: z
    .string()
    .min(20, "Mô tả phải có ít nhất 20 ký tự")
    .max(2000, "Mô tả không được vượt quá 2000 ký tự"),
  topics: z.array(z.string()).min(1, "Vui lòng chọn ít nhất 1 thể loại"),
  tags: z.array(z.string()).optional(),
  isPremium: z.boolean().optional(),
  isFinish: z.boolean().optional(),
  confirmCopyright: z
    .boolean()
    .refine((v) => v === true, "Bạn phải xác nhận quyền sở hữu tác phẩm"),
});

type WriteStoryFormValues = z.infer<typeof writeStorySchema>;

export default function WriteStoryPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submittedAction, setSubmittedAction] = useState<"draft" | "pending">(
    "draft",
  );
  const resetRef = useRef<() => void>(null);

  const form = useForm<WriteStoryFormValues>({
    initialValues: {
      title: "",
      description: "",
      topics: [],
      tags: [],
      isPremium: false,
      isFinish: false,
      confirmCopyright: false,
    },
    validate: zod4Resolver(writeStorySchema),
  });

  useEffect(() => {
    TopicService.getTopics()
      .then(setTopics)
      .catch(() => showError("Không thể tải danh sách thể loại"));
  }, []);

  const handleCoverChange = (file: File | null) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setCoverError("Chỉ hỗ trợ định dạng JPG, PNG, WEBP hoặc GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setCoverError("Ảnh bìa không được vượt quá 5MB");
      return;
    }
    setCoverError(null);
    setCoverImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverImage(null);
    setCoverPreview(null);
    setCoverError(null);
    resetRef.current?.();
  };

  const handleSubmit = async (
    values: WriteStoryFormValues,
    status: "draft" | "pending",
  ) => {
    if (!coverImage) {
      setCoverError("Vui lòng chọn ảnh bìa cho truyện");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      for (const topicId of values.topics) {
        formData.append("topics", topicId);
      }
      for (const tag of values.tags ?? []) {
        formData.append("tags", tag);
      }
      formData.append("isPremium", String(values.isPremium ?? false));
      formData.append("isFinish", String(values.isFinish ?? false));
      formData.append("status", status);
      formData.append("image", coverImage);

      const story = await AuthorService.createStory(formData);

      showSuccess(
        status === "draft"
          ? "Truyện đã được lưu vào nháp!"
          : "Truyện đã được gửi lên để duyệt! Admin sẽ xem xét trong thời gian sớm nhất.",
        status === "draft" ? "Lưu nháp thành công" : "Gửi duyệt thành công",
      );

      navigate(`/author/story/${story.slug}/write-chapter`);
    } catch {
      showError("Có lỗi xảy ra khi tạo truyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const topicOptions = topics.map((t) => ({ value: t._id, label: t.name }));

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
              <Tooltip label="Quay lại">
                <UnstyledButton
                  onClick={() => navigate(-1)}
                  className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                >
                  <ChevronLeft size={20} />
                </UnstyledButton>
              </Tooltip>
              <Group gap={6}>
                <BookOpen size={20} className="text-blue-500" />
                <Text fw={600} size="sm" c="dimmed">
                  Tạo tác phẩm mới
                </Text>
              </Group>
            </Group>
            <Group gap="sm">
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
          </Group>
        </Container>
      </Box>

      <Container size="xl" py="xl">
        <Stack gap="xs" mb="xl">
          <Title order={2} fw={700}>
            Thêm tác phẩm mới
          </Title>
          <Text c="dimmed" size="sm">
            Điền đầy đủ thông tin bên dưới để tạo tác phẩm của bạn. Tác phẩm mới
            cần được admin duyệt trước khi hiển thị công khai.
          </Text>
        </Stack>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Grid gutter="xl">
            {/* Left column – story information */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="lg">
                <Paper withBorder p="xl" radius="md" bg="white">
                  <Stack gap="md">
                    <Title order={4} fw={600}>
                      Thông tin tác phẩm
                    </Title>
                    <Divider />

                    <TextInput
                      label="Tiêu đề tác phẩm"
                      placeholder="Nhập tiêu đề hấp dẫn cho câu chuyện của bạn..."
                      required
                      size="md"
                      {...form.getInputProps("title")}
                    />

                    <Textarea
                      label="Mô tả / Tóm tắt"
                      placeholder="Hãy viết một đoạn tóm tắt ngắn gọn, thu hút độc giả muốn đọc câu chuyện của bạn..."
                      required
                      minRows={5}
                      maxRows={12}
                      autosize
                      size="md"
                      {...form.getInputProps("description")}
                    />

                    <MultiSelect
                      label="Thể loại"
                      placeholder="Chọn thể loại phù hợp..."
                      required
                      data={topicOptions}
                      searchable
                      clearable
                      maxValues={5}
                      size="md"
                      {...form.getInputProps("topics")}
                    />

                    <TagsInput
                      label="Tags (từ khóa)"
                      placeholder="Thêm từ khóa rồi nhấn Enter..."
                      description="Tối đa 10 từ khóa giúp độc giả tìm thấy tác phẩm của bạn"
                      maxTags={10}
                      size="md"
                      {...form.getInputProps("tags")}
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>

            {/* Right column – cover image and options */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="lg">
                {/* Cover image upload */}
                <Paper withBorder p="xl" radius="md" bg="white">
                  <Stack gap="md">
                    <Title order={4} fw={600}>
                      Ảnh bìa
                    </Title>
                    <Divider />

                    {coverPreview ? (
                      <Stack gap="sm" align="center">
                        <Box
                          style={{
                            width: "100%",
                            maxWidth: 240,
                            aspectRatio: "2/3",
                            borderRadius: 8,
                            overflow: "hidden",
                            position: "relative",
                          }}
                        >
                          <Image
                            src={coverPreview}
                            alt="Ảnh bìa"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </Box>
                        <Group gap="xs">
                          <FileButton
                            resetRef={resetRef}
                            onChange={handleCoverChange}
                            accept="image/png,image/jpeg,image/webp,image/gif"
                          >
                            {(props) => (
                              <Button
                                {...props}
                                variant="outline"
                                size="xs"
                                color="blue"
                              >
                                Thay ảnh
                              </Button>
                            )}
                          </FileButton>
                          <Button
                            variant="subtle"
                            size="xs"
                            color="red"
                            onClick={handleRemoveCover}
                          >
                            Xóa
                          </Button>
                        </Group>
                      </Stack>
                    ) : (
                      <FileButton
                        resetRef={resetRef}
                        onChange={handleCoverChange}
                        accept="image/png,image/jpeg,image/webp,image/gif"
                      >
                        {(props) => (
                          <UnstyledButton
                            {...props}
                            style={{
                              width: "100%",
                              aspectRatio: "2/3",
                              border: "2px dashed #bfdbfe",
                              borderRadius: 8,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              background: "#f0f9ff",
                              transition: "border-color 0.2s, background 0.2s",
                            }}
                            className="hover:border-blue-400 hover:bg-blue-50"
                          >
                            <Stack align="center" gap="xs">
                              <ImageIcon size={36} className="text-blue-300" />
                              <Text size="sm" fw={500} c="dimmed" ta="center">
                                Nhấp để tải ảnh bìa lên
                              </Text>
                              <Text size="xs" c="dimmed" ta="center">
                                JPG, PNG, WEBP hoặc GIF
                                <br />
                                Tối đa 5MB
                              </Text>
                            </Stack>
                          </UnstyledButton>
                        )}
                      </FileButton>
                    )}

                    {coverError && (
                      <Text size="xs" c="red">
                        {coverError}
                      </Text>
                    )}

                    <Text size="xs" c="dimmed">
                      Tỉ lệ khuyến nghị: 2:3 (ví dụ: 400x600px)
                    </Text>
                  </Stack>
                </Paper>

                {/* Settings */}
                <Paper withBorder p="xl" radius="md" bg="white">
                  <Stack gap="md">
                    <Title order={4} fw={600}>
                      Tùy chọn
                    </Title>
                    <Divider />

                    <Switch
                      label="Truyện VIP (Premium)"
                      description="Chỉ thành viên VIP mới có thể đọc"
                      size="sm"
                      color="blue"
                      checked={form.values.isPremium}
                      onChange={(e) =>
                        form.setFieldValue("isPremium", e.currentTarget.checked)
                      }
                    />

                    <Switch
                      label="Truyện đã hoàn thành"
                      description="Đánh dấu khi bạn đã viết xong tác phẩm"
                      size="sm"
                      color="blue"
                      checked={form.values.isFinish}
                      onChange={(e) =>
                        form.setFieldValue("isFinish", e.currentTarget.checked)
                      }
                    />

                    <Divider />

                    <Checkbox
                      label={
                        <Text size="sm">
                          Tôi xác nhận đây là tác phẩm gốc của tôi và tôi có đầy
                          đủ quyền để đăng tải nội dung này. Tôi đồng ý tuân thủ{" "}
                          <Text component="span" c="blue" fw={500}>
                            Điều khoản sử dụng
                          </Text>{" "}
                          của nền tảng.
                        </Text>
                      }
                      size="sm"
                      color="blue"
                      {...form.getInputProps("confirmCopyright", {
                        type: "checkbox",
                      })}
                    />
                    {form.errors.confirmCopyright && (
                      <Text size="xs" c="red">
                        {form.errors.confirmCopyright}
                      </Text>
                    )}
                  </Stack>
                </Paper>

                {/* Submit info box */}
                <Paper
                  withBorder
                  p="md"
                  radius="md"
                  bg="blue.0"
                  style={{ borderColor: "#bfdbfe" }}
                >
                  <Stack gap={4}>
                    <Text size="sm" fw={600} c="blue.8">
                      Lưu nháp vs Gửi duyệt
                    </Text>
                    <Text size="xs" c="dimmed">
                      <strong>Lưu nháp:</strong> Chỉ bạn mới xem được, có thể
                      chỉnh sửa bất cứ lúc nào.
                    </Text>
                    <Text size="xs" c="dimmed">
                      <strong>Gửi duyệt:</strong> Gửi cho admin xét duyệt. Sau
                      khi được duyệt, truyện sẽ hiển thị công khai.
                    </Text>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </form>
      </Container>
    </Box>
  );
}
