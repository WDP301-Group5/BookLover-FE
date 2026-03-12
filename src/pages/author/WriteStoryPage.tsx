import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  FileButton,
  Grid,
  Group,
  Image,
  Paper,
  Select,
  Stack,
  Switch,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
} from "@mantine/core";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Topic } from "../../interfaces/Topic";
import { AuthorService } from "../../services/AuthorService";
import { TopicService } from "../../services/TopicService";
import { showError, showSuccess } from "../../utils/notifications.tsx";

export default function WriteStoryPage() {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const resetRef = useRef<() => void>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false);

  // Validation errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  useEffect(() => {
    TopicService.getTopics()
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);
      })
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

  const handleContinue = async () => {
    // Validate required fields
    let hasError = false;
    if (!title.trim()) {
      setTitleError("Tiêu đề không được để trống");
      hasError = true;
    } else {
      setTitleError(null);
    }
    if (!description.trim()) {
      setDescriptionError("Mô tả / Tóm tắt không được để trống");
      hasError = true;
    } else {
      setDescriptionError(null);
    }
    if (!category) {
      setCategoryError("Vui lòng chọn thể loại");
      hasError = true;
    } else {
      setCategoryError(null);
    }
    if (!coverImage) {
      setCoverError("Vui lòng thêm ảnh bìa cho truyện");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (category) formData.append("topics", category);
      for (const tag of tags) {
        formData.append("tags", tag);
      }
      formData.append("isPremium", isPremium ? "true" : "false");
      formData.append("isFinish", "false");
      formData.append("status", "draft");
      if (coverImage) {
        formData.append("image", coverImage);
      }

      const story = await AuthorService.createStory(formData);
      showSuccess(
        "Tác phẩm đã được tạo. Bắt đầu viết chương đầu tiên!",
        "Tạo tác phẩm thành công",
      );
      navigate(`/author/story/${story.slug}/write-chapter`);
    } catch {
      showError("Có lỗi xảy ra khi tạo truyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const topicOptions = Array.isArray(topics)
    ? topics.map((t) => ({ value: t._id, label: t.name }))
    : [];

  return (
    <Box className="min-h-screen bg-[#f3f3f3]">
      {/* ── Header ── */}
      <Box
        style={{
          borderBottom: "1px solid #dfdfdf",
          backgroundColor: "white",
        }}
      >
        <Container size="xl" py="sm">
          <Group justify="space-between" align="center">
            <Group align="center" gap="sm">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => navigate("/author/my-stories")}
                color="gray"
              >
                <ArrowLeft size={20} />
              </ActionIcon>
              <Stack gap={0}>
                <Text size="xs" c="dimmed">
                  Thêm thông tin tác phẩm
                </Text>
                <Title order={3} size="h4" fw={600}>
                  {title || "Tác phẩm chưa đặt tên"}
                </Title>
              </Stack>
            </Group>

            <Group gap="xs">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => navigate("/author/my-stories")}
              >
                Hủy
              </Button>
              <Button color="orange" loading={loading} onClick={handleContinue}>
                Tiếp tục
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ── Body ── */}
      <Container size="xl" py="xl">
        <Paper withBorder p={{ base: "md", md: "xl" }} radius="sm" bg="white">
          <Grid gutter="xl" align="start">
            {/* Left: Cover image */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Stack align="center" gap="xs">
                <Text size="sm" fw={600} c="dimmed">
                  Ảnh bìa{" "}
                  <Text span c="red">
                    *
                  </Text>
                </Text>
                <FileButton
                  resetRef={resetRef}
                  onChange={handleCoverChange}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                >
                  {(props) => (
                    <UnstyledButton
                      {...props}
                      style={{
                        width: 220,
                        maxWidth: "100%",
                        aspectRatio: "2 / 3",
                        borderRadius: 2,
                        overflow: "hidden",
                        background: "#ececec",
                        border: coverError
                          ? "1.5px solid var(--mantine-color-red-6)"
                          : "1px solid #d5d5d5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {coverPreview ? (
                        <Image
                          src={coverPreview}
                          alt="Ảnh bìa truyện"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Stack align="center" gap={6}>
                          <Box
                            style={{
                              width: 48,
                              height: 48,
                              borderRadius: 6,
                              background: "#7d7d7d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <ImageIcon size={26} color="#fff" />
                          </Box>
                          <Text size="sm" c="dimmed">
                            Thêm ảnh bìa
                          </Text>
                        </Stack>
                      )}
                    </UnstyledButton>
                  )}
                </FileButton>

                {coverPreview && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="xs"
                    onClick={handleRemoveCover}
                  >
                    Xóa ảnh bìa
                  </Button>
                )}

                {coverError && (
                  <Text size="xs" c="red" ta="center">
                    {coverError}
                  </Text>
                )}
              </Stack>
            </Grid.Col>

            {/* Right: Story Details */}
            <Grid.Col span={{ base: 12, md: 8 }}>
              <Stack gap={0}>
                <Box pb="sm">
                  <Text fw={600} size="md">
                    Thông tin tác phẩm
                  </Text>
                  <Box
                    mt={8}
                    style={{ width: 122, height: 3, background: "#f97316" }}
                  />
                </Box>

                <Divider mb="md" />

                <Stack gap="sm">
                  {/* Title */}
                  <Box>
                    <Text fw={600} size="sm" mb={6}>
                      Tiêu đề{" "}
                      <Text span c="red">
                        *
                      </Text>
                    </Text>
                    <TextInput
                      placeholder="Nhập tiêu đề tác phẩm"
                      radius={2}
                      value={title}
                      onChange={(e) => {
                        setTitle(e.currentTarget.value);
                        if (e.currentTarget.value.trim()) setTitleError(null);
                      }}
                      error={titleError}
                    />
                  </Box>

                  {/* Description */}
                  <Box>
                    <Text fw={600} size="sm" mb={6}>
                      Mô tả / Tóm tắt{" "}
                      <Text span c="red">
                        *
                      </Text>
                    </Text>
                    <Textarea
                      placeholder="Mô tả nội dung truyện..."
                      minRows={5}
                      radius={2}
                      value={description}
                      onChange={(e) => {
                        setDescription(e.currentTarget.value);
                        if (e.currentTarget.value.trim())
                          setDescriptionError(null);
                      }}
                      error={descriptionError}
                    />
                  </Box>

                  <Divider my={4} />

                  {/* Category */}
                  <Box>
                    <Text fw={600} size="sm" mb={6}>
                      Thể loại{" "}
                      <Text span c="red">
                        *
                      </Text>
                    </Text>
                    <Select
                      placeholder="Chọn thể loại"
                      data={topicOptions}
                      searchable
                      clearable
                      radius={2}
                      value={category}
                      onChange={(val) => {
                        setCategory(val);
                        if (val) setCategoryError(null);
                      }}
                      error={categoryError}
                    />
                  </Box>

                  <Divider my={4} />

                  {/* Tags */}
                  <Box>
                    <Text fw={600} size="sm" mb={6}>
                      Thẻ (Tags)
                    </Text>
                    <TagsInput
                      placeholder="Thêm thẻ"
                      maxTags={25}
                      radius={2}
                      value={tags}
                      onChange={setTags}
                    />
                  </Box>

                  <Divider my={4} />

                  {/* Premium toggle */}
                  <Box>
                    <Group justify="space-between" align="center" mb={4}>
                      <Text fw={600} size="sm">
                        Có phải trả phí
                      </Text>
                      <Switch
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.currentTarget.checked)}
                      />
                    </Group>
                  </Box>

                  <Divider my={4} />
                </Stack>
              </Stack>
            </Grid.Col>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
