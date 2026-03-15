import { ActionIcon, Group, Stack, Text } from "@mantine/core";
import { Link, RichTextEditor } from "@mantine/tiptap";
import CodeBlock from "@tiptap/extension-code-block";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import TextAlignExtension from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Underline from "@tiptap/extension-underline";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Upload } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { instance as axios } from "../../lib/axios";
import { showError } from "../../utils/notifications";

export type ContentPayload = { mode: "editor"; html: string };

interface ChapterContentInputProps {
  onChange: (payload: ContentPayload | null) => void;
  /** Pre-load HTML content (for edit mode) */
  initialContent?: string;
  error?: string;
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

  // Update editor content when initialContent changes (e.g. switching chapters)
  useEffect(() => {
    if (editor && initialContent !== undefined) {
      const currentHTML = editor.getHTML();
      if (currentHTML !== initialContent) {
        editor.commands.setContent(initialContent ?? "");
        const plain = editor.getText();
        setWords(wordCount(plain));
      }
    }
  }, [initialContent, editor]);

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

  const errorBorder = error
    ? "1px solid var(--mantine-color-red-6)"
    : undefined;

  return (
    <Stack gap="sm">
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
              maxHeight: 600,
              overflowY: "auto",
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
          </Text>
        </Group>
      </Stack>

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
