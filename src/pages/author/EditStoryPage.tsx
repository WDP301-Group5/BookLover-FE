import {
  Box,
  Button,
  Container,
  Divider,
  FileButton,
  Grid,
  Group,
  Image,
  Loader,
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
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Topic } from "../../interfaces/Topic";
import { AuthorService } from "../../services/AuthorService";
import { TopicService } from "../../services/TopicService";
import { showError, showSuccess } from "../../utils/notifications.tsx";
import type { Story } from "../../interfaces/Story";

export default function EditStoryPage() {
  const navigate = useNavigate();
  const { storyId } = useParams<{ storyId: string }>();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === "dark";
  
  const [topics, setTopics] = useState<Topic[]>([]);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoadingStory, setIsLoadingStory] = useState(true);
  const resetRef = useRef<() => void>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [isPremium, setIsPremium] = useState(false);
  const [isFinish, setIsFinish] = useState(false);

  // Validation errors
  const [titleError, setTitleError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);

  // Load topics on mount
  useEffect(() => {
    TopicService.getTopics()
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);
      })
      .catch(() => showError("Không thể tải danh sách thể loại"));
  }, []);

  // Load story data on mount
  useEffect(() => {
    if (!storyId) {
      showError("ID truyện không hợp lệ");
      navigate("/author/my-stories");
      return;
    }

    const loadStory = async () => {
      try {
        setIsLoadingStory(true);
        // Fetch user's stories to find the one with matching ID
        const response = await AuthorService.getMyStories(1, 100);
        const story = response.stories.find((s) => s._id === storyId);
        
        if (!story) {
          showError("Không tìm thấy truyện");
          navigate("/author/my-stories");
          return;
        }

        // Populate form with story data
        setTitle(story.title);
        setDescription(story.description || "");
        
        // Set category - handle if topics is an array of objects or strings
        if (story.topics && Array.isArray(story.topics)) {
          const firstTopic = story.topics[0];
          if (typeof firstTopic === "string") {
            setCategory(firstTopic);
          } else if (typeof firstTopic === "object" && "_id" in firstTopic) {
            setCategory((firstTopic as any)._id);
          }
        }
        
        setTags(story.tags || []);
        setIsPremium(story.isPremium || false);
        setIsFinish(story.isFinish || false);
        
        // Set cover preview
        if (story.image) {
          setCoverPreview(story.image);
        }
      } catch (error) {
        console.error("Error loading story:", error);
        showError("Có lỗi khi tải thông tin truyện");
        navigate("/author/my-stories");
      } finally {
        setIsLoadingStory(false);
      }
    };

    loadStory();
  }, [storyId, navigate]);

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
    // Don't clear preview if it's the original image
    if (!coverPreview || coverPreview.startsWith("data:")) {
      setCoverPreview(null);
    }
    setCoverError(null);
    resetRef.current?.();
  };

  const handleSave = async () => {
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
    if (!coverPreview) {
      setCoverError("Vui lòng thêm ảnh bìa cho truyện");
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    try {
      if (coverImage) {
        // If a new cover image is selected, use FormData
        const formData = new FormData();
        formData.append("title", title.trim());
        formData.append("description", description.trim());
        if (category) formData.append("topics", category);
        for (const tag of tags) {
          formData.append("tags", tag);
        }
        formData.append("isPremium", isPremium ? "true" : "false");
        formData.append("isFinish", isFinish ? "true" : "false");
        formData.append("image", coverImage);

        await AuthorService.updateStoryWithImage(storyId!, formData);
      } else {
        // Otherwise, use regular JSON update
        const updateData: Partial<Story> = {
          title: title.trim(),
          description: description.trim(),
          topics: category ? [category] : [],
          tags: tags,
          isPremium: isPremium,
          isFinish: isFinish,
        };

        await AuthorService.updateStory(storyId!, updateData);
      }

      showSuccess("Thông tin truyện đã được cập nhật", "Cập nhật thành công");
      navigate("/author/my-stories");
    } catch (error) {
      console.error("Error updating story:", error);
      showError("Có lỗi xảy ra khi cập nhật truyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const topicOptions = Array.isArray(topics)
    ? topics.map((t) => ({ value: t._id, label: t.name }))
    : [];

  if (isLoadingStory) {
    return (
      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Loader size="lg" />
      </Box>
    );
  }

  return (
    <Box
      style={{
        backgroundColor: (isDark
          ? theme.colors.dark[8]
          : theme.colors.gray[0]) as string,
      }}
    >
      {/* ── Header ── */}
      <Box
        style={{
          borderBottom: `1px solid ${isDark ? theme.colors.dark[6] : theme.colors.gray[2]}`,
          backgroundColor: (isDark
            ? theme.colors.dark[7]
            : theme.colors.white) as string,
        }}
      >
        <Container size="xl" py="sm">
          <Group justify="space-between" align="center" wrap="wrap">
            <Stack gap={0} style={{ minWidth: 0, flex: 1 }}>
              <Text size="xs" c="dimmed">
                Sửa thông tin truyện
              </Text>
              <Title
                order={3}
                size="h4"
                fw={600}
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {title || "Tác phẩm chưa đặt tên"}
              </Title>
            </Stack>

            <Group gap="xs" wrap="wrap">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => navigate("/author/my-stories")}
                size="sm"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                color="blue"
                loading={loading}
                onClick={handleSave}
                size="sm"
              >
                Lưu thay đổi
              </Button>
            </Group>
          </Group>
        </Container>
      </Box>

      {/* ── Body ── */}
      <Container size="xl" py="md">
        <Paper
          withBorder
          p={{ base: "md", md: "lg" }}
          radius="sm"
          style={{
            backgroundColor: (isDark
              ? theme.colors.dark[7]
              : theme.colors.white) as string,
            borderColor: (isDark
              ? theme.colors.dark[6]
              : theme.colors.gray[2]) as string,
          }}
        >
          <Grid gutter="lg" align="start">
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
                        background: (isDark
                          ? theme.colors.dark[6]
                          : "#ececec") as string,
                        border: coverError
                          ? `1.5px solid ${theme.colors.red[6]}`
                          : `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[3]}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
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
                              background: (isDark
                                ? theme.colors.dark[5]
                                : "#7d7d7d") as string,
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
                    Thông tin truyện
                  </Text>
                  <Box
                    mt={8}
                    style={{
                      width: 122,
                      height: 3,
                      background: theme.colors.blue[6] as string,
                    }}
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
                      placeholder="Nhập tiêu đề truyện"
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
                      placeholder="Thêm tag bằng cách ấn Enter, hỗ trợ thêm tối đa 25 tags"
                      maxTags={25}
                      radius={2}
                      value={tags}
                      onChange={setTags}
                      acceptValueOnBlur
                      data={topics.map((t) => t.name)}
                    />
                  </Box>

                  <Divider my={4} />

                  {/* Finish toggle */}
                  <Box>
                    <Group justify="space-between" align="center" mb={4}>
                      <Text fw={600} size="sm">
                        Truyện đã hoàn thành?
                      </Text>
                      <Switch
                        checked={isFinish}
                        onChange={(e) => setIsFinish(e.currentTarget.checked)}
                      />
                    </Group>
                  </Box>

                  <Divider my={4} />

                  {/* Premium toggle */}
                  <Box>
                    <Group justify="space-between" align="center" mb={4}>
                      <Text fw={600} size="sm">
                        Có trả phí hay không?
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
