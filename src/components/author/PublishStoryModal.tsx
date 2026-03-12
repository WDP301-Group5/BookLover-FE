import {
  Box,
  Button,
  Checkbox,
  FileButton,
  Grid,
  Group,
  Image,
  Modal,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Story } from "../../interfaces/Story";
import type { Topic } from "../../interfaces/Topic";
import { AuthorService } from "../../services/AuthorService";
import { TopicService } from "../../services/TopicService";
import { showError, showSuccess } from "../../utils/notifications";

interface PublishStoryModalProps {
  opened: boolean;
  onClose: () => void;
  story: Story;
  currentChapterTitle?: string;
}

export default function PublishStoryModal({
  opened,
  onClose,
  story,
}: PublishStoryModalProps) {
  const navigate = useNavigate();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);

  // Extract topic ID whether it's a populated object or a plain string
  const extractTopicId = (t: unknown): string | null => {
    if (!t) return null;
    if (typeof t === "string") return t;
    if (typeof t === "object" && "_id" in (t as object))
      return String((t as { _id: unknown })._id);
    return null;
  };

  // Form fields pre-filled from story
  const [title, setTitle] = useState(story.title);
  const [description, setDescription] = useState(story.description || "");
  const [category, setCategory] = useState<string | null>(
    extractTopicId(story.topics?.[0]),
  );
  const [tags, setTags] = useState<string[]>(story.tags || []);
  const [isFinish, setIsFinish] = useState(story.isFinish || false);
  const [copyrightConfirm, setCopyrightConfirm] = useState(false);

  // Cover image
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(
    story.image || null,
  );
  const [coverError, setCoverError] = useState<string | null>(null);
  const resetRef = useRef<() => void>(null);

  useEffect(() => {
    TopicService.getTopics()
      .then((data) => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);
      })
      .catch(() => {});
  }, []);

  // Sync form when story prop changes
  useEffect(() => {
    setTitle(story.title);
    setDescription(story.description || "");
    setCategory(extractTopicId(story.topics?.[0]));
    setTags(story.tags || []);
    setIsFinish(story.isFinish || false);
    setCoverPreview(story.image || null);
  }, [story]);

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
    setCoverPreview(story.image || null);
    setCoverError(null);
    resetRef.current?.();
  };

  const handlePublish = async () => {
    // Validation
    if (!title.trim()) {
      showError("Tiêu đề truyện không được để trống");
      return;
    }
    if (!description.trim()) {
      showError("Mô tả truyện không được để trống");
      return;
    }
    if (!copyrightConfirm) {
      showError("Vui lòng xác nhận bản quyền trước khi đăng");
      return;
    }
    if (!coverPreview) {
      showError("Vui lòng thêm ảnh bìa cho truyện");
      return;
    }

    setLoading(true);
    try {
      // 1. Update story details
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      if (category) formData.append("topics", category);
      for (const tag of tags) {
        formData.append("tags", tag);
      }
      formData.append("isFinish", isFinish ? "true" : "false");
      formData.append("status", "pending");
      if (coverImage) {
        formData.append("image", coverImage);
      }

      await AuthorService.updateStoryWithImage(story._id, formData);

      // 2. Publish chapters (draft -> pending)
      await AuthorService.publishStoryChapters(story._id);

      showSuccess(
        "Truyện đã được gửi duyệt! Vui lòng chờ admin phê duyệt.",
        "Đăng truyện thành công",
      );
      onClose();
      navigate("/author/my-stories");
    } catch {
      showError("Có lỗi xảy ra khi đăng truyện. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const topicOptions = Array.isArray(topics)
    ? topics.map((t) => ({ value: t._id, label: t.name }))
    : [];

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Trước khi xuất bản"
      size="lg"
      centered
      styles={{
        title: { fontWeight: 700, fontSize: 20 },
      }}
    >
      <Grid gutter="xl">
        {/* Left: Cover Image */}
        <Grid.Col span={{ base: 12, sm: 5 }}>
          <Stack align="center" gap="xs">
            <FileButton
              resetRef={resetRef}
              onChange={handleCoverChange}
              accept="image/png,image/jpeg,image/webp,image/gif"
            >
              {(props) => (
                <UnstyledButton
                  {...props}
                  style={{
                    width: 180,
                    maxWidth: "100%",
                    aspectRatio: "2 / 3",
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "#ececec",
                    border: "1px solid #d5d5d5",
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
                          borderRadius: "50%",
                          border: "2px dashed #aaa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <ImageIcon size={20} color="#999" />
                      </Box>
                      <Text size="xs" c="dimmed" ta="center">
                        Thêm ảnh bìa
                      </Text>
                    </Stack>
                  )}
                </UnstyledButton>
              )}
            </FileButton>

            {coverPreview && (
              <Button
                size="xs"
                variant="subtle"
                color="red"
                onClick={handleRemoveCover}
              >
                Xóa ảnh bìa
              </Button>
            )}
            {coverError && (
              <Text size="xs" c="red">
                {coverError}
              </Text>
            )}
          </Stack>
        </Grid.Col>

        {/* Right: Story details */}
        <Grid.Col span={{ base: 12, sm: 7 }}>
          <Stack gap="sm">
            <TextInput
              label="Tiêu đề"
              placeholder="Tên truyện"
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
            />

            <Textarea
              label="Mô tả"
              placeholder="Mô tả ngắn về truyện..."
              value={description}
              onChange={(e) => setDescription(e.currentTarget.value)}
              minRows={3}
              maxRows={5}
              autosize
              required
            />

            <Select
              label="Thể loại"
              placeholder="Chọn thể loại"
              data={topicOptions}
              value={category}
              onChange={setCategory}
              searchable
              clearable
            />

            <TagsInput
              label="Tags"
              placeholder="Nhập tag và nhấn Enter"
              value={tags}
              onChange={setTags}
              maxTags={10}
            />

            <Checkbox
              label="Truyện đã hoàn thành"
              checked={isFinish}
              onChange={(e) => setIsFinish(e.currentTarget.checked)}
              color="orange"
            />

            <Checkbox
              label="Tôi xác nhận đây là tác phẩm do tôi sáng tác và không vi phạm bản quyền"
              checked={copyrightConfirm}
              onChange={(e) => setCopyrightConfirm(e.currentTarget.checked)}
              color="orange"
              styles={{ label: { fontSize: 13 } }}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="subtle" color="gray" onClick={onClose}>
                Quay lại
              </Button>
              <Button
                color="orange"
                loading={loading}
                onClick={handlePublish}
                disabled={!copyrightConfirm}
              >
                Xuất bản
              </Button>
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
