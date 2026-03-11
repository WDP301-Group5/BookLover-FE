import {
  ActionIcon,
  Group,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Dropzone, MS_WORD_MIME_TYPE, PDF_MIME_TYPE } from "@mantine/dropzone";
import { Link, RichTextEditor } from "@mantine/tiptap";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlignExtension from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { FileText, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { instance as axios } from "../../lib/axios";
import { showError } from "../../utils/notifications";

export type ContentPayload =
  | { mode: "editor"; html: string }
  | { mode: "upload"; file: File };

interface ChapterContentInputProps {
  onChange: (payload: ContentPayload | null) => void;
  /** Pre-load HTML content (for edit mode) */
  initialContent?: string;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

async function uploadImageToServer(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axios.post("/upload/image", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Return the image URL from the response - Cloudinary returns secure_url
  const imageUrl =
    response.data?.path || response.data?.url || response.data?.imageUrl;
  if (!imageUrl) {
    throw new Error("Server không trả về URL ảnh");
  }
  return imageUrl;
}

export function ChapterContentInput({
  onChange,
  initialContent,
  error,
}: ChapterContentInputProps) {
  const [mode, setMode] = useState<"editor" | "upload">("editor");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [words, setWords] = useState(0);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      Link,
      TextAlignExtension.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Superscript,
      CodeBlock,
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: initialContent ?? "",
    onUpdate({ editor: e }) {
      const plain = e.getText();
      setWords(wordCount(plain));
      onChange({ mode: "editor", html: e.getHTML() });
    },
  });

  const handleModeChange = (val: string) => {
    const next = val as "editor" | "upload";
    setMode(next);
    if (next === "editor") {
      onChange(editor ? { mode: "editor", html: editor.getHTML() } : null);
    } else {
      onChange(uploadedFile ? { mode: "upload", file: uploadedFile } : null);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    try {
      const url = await uploadImageToServer(file);
      editor.chain().focus().setImage({ src: url, alt: file.name }).run();
    } catch (error) {
      console.error("Image upload failed:", error);
      showError(
        error instanceof Error
          ? error.message
          : "Lỗi upload ảnh. Vui lòng thử lại.",
      );
    }

    // Reset input for re-selection
    e.target.value = "";
  };

  const handleImageInsert = () => {
    imageInputRef.current?.click();
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData?.items;
    if (!items || !editor) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        try {
          const url = await uploadImageToServer(file);
          editor.chain().focus().setImage({ src: url, alt: file.name }).run();
        } catch (error) {
          console.error("Paste image upload failed:", error);
          showError(
            error instanceof Error
              ? error.message
              : "Lỗi upload ảnh. Vui lòng thử lại.",
          );
        }
      }
    }
  };

  const handleDrop = (files: File[]) => {
    const file = files[0];
    setUploadedFile(file);
    onChange({ mode: "upload", file });
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    onChange(null);
  };

  const errorBorder = error
    ? "1px solid var(--mantine-color-red-6)"
    : undefined;

  return (
    <Stack gap="sm">
      <SegmentedControl
        value={mode}
        onChange={handleModeChange}
        size="sm"
        w="fit-content"
        data={[
          { label: "Soạn thảo trực tiếp", value: "editor" },
          { label: "Tải file lên", value: "upload" },
        ]}
      />

      {/* ── Rich-text editor mode ── */}
      {mode === "editor" && (
        <Stack gap={4}>
          <RichTextEditor editor={editor} style={{ border: errorBorder }}>
            <RichTextEditor.Toolbar sticky stickyOffset={60}>
              {/* Inline formatting */}
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
                <RichTextEditor.Underline />
                <RichTextEditor.Strikethrough />
                <RichTextEditor.ClearFormatting />
                <RichTextEditor.Highlight />
                <RichTextEditor.Code />
              </RichTextEditor.ControlsGroup>

              {/* Headings */}
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.H1 />
                <RichTextEditor.H2 />
                <RichTextEditor.H3 />
                <RichTextEditor.H4 />
              </RichTextEditor.ControlsGroup>

              {/* Blocks */}
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Blockquote />
                <RichTextEditor.Hr />
                <RichTextEditor.BulletList />
                <RichTextEditor.OrderedList />
                <RichTextEditor.Superscript />
                <RichTextEditor.CodeBlock />
              </RichTextEditor.ControlsGroup>

              {/* Links */}
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Link />
                <RichTextEditor.Unlink />
              </RichTextEditor.ControlsGroup>

              {/* Image */}
              <RichTextEditor.ControlsGroup>
                <ActionIcon
                  onClick={handleImageInsert}
                  aria-label="Chèn ảnh"
                  title="Chèn ảnh (Ctrl+Shift+I)"
                  variant="default"
                  size={36}
                >
                  <Upload size={16} />
                </ActionIcon>
              </RichTextEditor.ControlsGroup>

              {/* Alignment */}
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.AlignLeft />
                <RichTextEditor.AlignCenter />
                <RichTextEditor.AlignRight />
                <RichTextEditor.AlignJustify />
              </RichTextEditor.ControlsGroup>

              {/* History */}
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Undo />
                <RichTextEditor.Redo />
              </RichTextEditor.ControlsGroup>
            </RichTextEditor.Toolbar>

            <RichTextEditor.Content
              style={{
                fontFamily: "'Poppins', 'Open Sans', sans-serif",
                fontSize: "16px",
                lineHeight: "1.8",
                minHeight: 400,
              }}
              onPaste={handlePaste}
            />
          </RichTextEditor>

          <Group justify="space-between">
            {error ? (
              <Text size="xs" c="red">
                {error}
              </Text>
            ) : (
              <span />
            )}
            <Text size="xs" c="dimmed">
              {words.toLocaleString("vi-VN")} từ
              {words > 0 && words < 50 && (
                <Text span c="blue" inherit>
                  {" "}
                  (cần ít nhất 50 từ)
                </Text>
              )}
            </Text>
          </Group>
        </Stack>
      )}

      {/* ── File upload mode ── */}
      {mode === "upload" && (
        <Stack gap="sm">
          {uploadedFile ? (
            <Paper withBorder p="md" radius="md">
              <Group justify="space-between">
                <Group gap="sm">
                  <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                    <FileText size={18} />
                  </ThemeIcon>
                  <Stack gap={2}>
                    <Text size="sm" fw={500} lineClamp={1} maw={400}>
                      {uploadedFile.name}
                    </Text>
                    <Text size="xs" c="dimmed">
                      {formatBytes(uploadedFile.size)}
                    </Text>
                  </Stack>
                </Group>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size="sm"
                  onClick={handleRemoveFile}
                  aria-label="Xóa file"
                >
                  <X size={14} />
                </ActionIcon>
              </Group>
            </Paper>
          ) : (
            <Dropzone
              onDrop={handleDrop}
              accept={[...MS_WORD_MIME_TYPE, ...PDF_MIME_TYPE, "text/plain"]}
              maxSize={50 * 1024 * 1024}
              multiple={false}
              styles={{
                root: errorBorder ? { border: errorBorder } : undefined,
              }}
            >
              <Group
                justify="center"
                gap="xl"
                mih={220}
                style={{ pointerEvents: "none" }}
              >
                <Dropzone.Accept>
                  <Upload size={48} color="var(--mantine-color-blue-6)" />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <X size={48} color="var(--mantine-color-red-6)" />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <Upload size={48} color="var(--mantine-color-dimmed)" />
                </Dropzone.Idle>

                <Stack gap={6} align="center">
                  <Text size="md" fw={500} ta="center">
                    Kéo thả file vào đây hoặc{" "}
                    <Text span c="blue" inherit>
                      nhấn để chọn file
                    </Text>
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    Hỗ trợ: .docx, .pdf, .txt &bull; Tối đa 50 MB
                  </Text>
                </Stack>
              </Group>
            </Dropzone>
          )}

          {error && (
            <Text size="xs" c="red">
              {error}
            </Text>
          )}
        </Stack>
      )}

      {/* Hidden image file input */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </Stack>
  );
}
