import {
  Button,
  ColorInput,
  Group,
  Modal,
  Select,
  Slider,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export interface ReaderSettings {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  textColor: string;
  backgroundColor: string | null;
}

const STORAGE_KEY = "reader_settings";

const defaultSettings: ReaderSettings = {
  fontFamily: "Times New Roman",
  fontSize: 18,
  lineHeight: 1.8,
  textColor: "#000000",
  backgroundColor: null,
};

const fonts = [
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Arial", label: "Arial" },
  { value: "Verdana", label: "Verdana" },
  { value: "Helvetica", label: "Helvetica" },
];

interface ChapterReaderProps {
  contentHtml?: string | null;
  /** Optional wrapper styles */
  maxWidth?: number | string;
}

export function ChapterReader({ contentHtml, maxWidth = "100%" }: ChapterReaderProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [settings, setSettings] = useState<ReaderSettings>(defaultSettings);
  const [textSettings, setTextSettings] =
    useState<ReaderSettings>(defaultSettings);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setSettings(JSON.parse(saved));
      setTextSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = () => {
    setTextSettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    close();
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSettings));
  };

  const handleCloseSettings = () => {
    setSettings(textSettings);
    close();
  };

  return (
    <Stack gap="md" style={{ maxWidth }}>
      {/* Reader Settings Modal */}
      <Modal
        opened={opened}
        onClose={handleCloseSettings}
        title="Cấu hình đọc truyện"
        centered
      >
        <Stack gap="lg">
          {/* Font */}
          <Select
            label="Font chữ"
            data={fonts}
            value={settings.fontFamily}
            onChange={(value) =>
              setSettings({
                ...settings,
                fontFamily: value || "Times New Roman",
              })
            }
          />

          {/* Font size */}
          <Stack gap={4}>
            <Text>Kích cỡ chữ ({settings.fontSize}px)</Text>
            <Slider
              min={14}
              max={28}
              value={settings.fontSize}
              onChange={(value) =>
                setSettings({ ...settings, fontSize: value })
              }
            />
          </Stack>

          {/* Line height */}
          <Stack gap={4}>
            <Text>Khoảng cách dòng ({settings.lineHeight})</Text>
            <Slider
              min={1.2}
              max={2.5}
              step={0.1}
              value={settings.lineHeight}
              onChange={(value) =>
                setSettings({ ...settings, lineHeight: value })
              }
            />
          </Stack>

          {/* Text color */}
          <ColorInput
            label="Màu chữ"
            value={settings.textColor}
            onChange={(value) =>
              setSettings({ ...settings, textColor: value })
            }
          />

          {/* Background color */}
          <ColorInput
            label="Màu nền"
            value={settings.backgroundColor || ""}
            onChange={(value) =>
              setSettings({ ...settings, backgroundColor: value })
            }
          />

          {/* Preview */}
          <Text
            style={{
              fontFamily: settings.fontFamily,
              fontSize: settings.fontSize,
              lineHeight: settings.lineHeight,
              color: settings.textColor,
              backgroundColor: settings.backgroundColor || "",
            }}
          >
            Đây là đoạn văn bản xem trước để bạn điều chỉnh cấu hình đọc
            truyện.
          </Text>

          {/* Buttons */}
          <Group justify="space-between">
            <Button variant="light" onClick={resetSettings}>
              Reset
            </Button>
            <Button onClick={saveSettings}>Lưu</Button>
          </Group>
        </Stack>
      </Modal>

      {/* Toolbar */}
      <Group justify="flex-end">
        <Button variant="outline" color="blue" size="xs" onClick={open}>
          <IconSettings size={16} />
        </Button>
      </Group>

      {/* Content */}
      <Text
        style={{ whiteSpace: "pre-wrap" }}
        ff={textSettings.fontFamily}
        fz={textSettings.fontSize}
        lh={textSettings.lineHeight}
        c={textSettings.textColor}
        bg={textSettings.backgroundColor || ""}
        dangerouslySetInnerHTML={{
          __html: contentHtml || "",
        }}
      ></Text>
    </Stack>
  );
}

