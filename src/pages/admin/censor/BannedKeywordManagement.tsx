import {
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconPlus, IconSearch, IconTrash } from "@tabler/icons-react";
import { useState } from "react";
import {
  DataTable,
  DataTableContent,
  useDataTable,
} from "../../../components/data-table";
import {
  useBannedKeywords,
  useCreateBannedKeyword,
  useDeleteBannedKeyword,
  useUpdateBannedKeyword,
} from "../../../hooks/useBannedKeyword";
import { type BannedKeyword } from "../../../services/BannedKeywordService";

const CATEGORIES = [
  { value: "profanity", label: "Thô tục" },
  { value: "political", label: "Chính trị" },
  { value: "spam", label: "Spam" },
  { value: "violence", label: "Bạo lực" },
  { value: "sexual", label: "Nhạy cảm" },
  { value: "other", label: "Khác" },
];

const SEVERITIES = [
  { value: "critical", label: "Nghiêm trọng", color: "red" },
  { value: "medium", label: "Trung bình", color: "yellow" },
  { value: "low", label: "Nhẹ", color: "gray" },
];

function KeywordModal({
  keyword,
  opened,
  onClose,
}: {
  keyword?: BannedKeyword | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { mutate: createKeyword, isPending: isCreating } = useCreateBannedKeyword();
  const { mutate: updateKeyword, isPending: isUpdating } = useUpdateBannedKeyword();

  const [text, setText] = useState(keyword?.text || "");
  const [category, setCategory] = useState(keyword?.category || "other");
  const [severity, setSeverity] = useState(keyword?.severity || "medium");
  const [isRegex, setIsRegex] = useState(keyword?.isRegex || false);

  const handleSubmit = () => {
    if (!text.trim()) return;

    if (keyword) {
      updateKeyword({
        id: keyword._id,
        data: { text, category, severity, isRegex },
      });
    } else {
      createKeyword({ text, category, severity, isRegex });
    }
    onClose();
    setText("");
    setCategory("other");
    setSeverity("medium");
    setIsRegex(false);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={<Text fw={700}>{keyword ? "Sửa từ khóa" : "Thêm từ khóa cấm"}</Text>}
      size="md"
    >
      <Stack gap="md">
        <TextInput
          label="Từ khóa"
          placeholder="Nhập từ khóa hoặc regex pattern"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <TextInput
          label="Danh mục"
          placeholder="Chọn danh mục"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          data={CATEGORIES}
          comboboxProps={{ withinPortal: true }}
        />

        <TextInput
          label="Mức độ"
          placeholder="Chọn mức độ"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          data={SEVERITIES}
          comboboxProps={{ withinPortal: true }}
        />

        <Button onClick={handleSubmit} loading={isCreating || isUpdating}>
          {keyword ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Stack>
    </Modal>
  );
}

function AddKeywordModal() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button leftSection={<IconPlus size={16} />} onClick={open}>
        Thêm từ khóa
      </Button>
      <KeywordModal opened={opened} onClose={close} />
    </>
  );
}

export function BannedKeywordManagement() {
  const { data: keywords } = useBannedKeywords();
  const { mutate: deleteKeyword } = useDeleteBannedKeyword();
  const [search, setSearch] = useState("");

  const filteredKeywords = keywords?.filter((k) =>
    k.text.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (keyword: BannedKeyword) => {
    modals.openConfirmModal({
      title: "Xóa từ khóa",
      children: (
        <Text size="sm">
          Bạn có chắc muốn xóa từ khóa "{keyword.text}"?
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => deleteKeyword({ id: keyword._id }),
    });
  };

  const dataTable = useDataTable<BannedKeyword>({
    columns: [
      {
        accessorKey: "text",
        header: "Từ khóa",
        cell: ({ row }) => (
          <Text size="sm" fw={500} ff="monospace">
            {row.original.text}
          </Text>
        ),
      },
      {
        accessorKey: "category",
        header: "Danh mục",
        cell: ({ row }) => {
          const cat = CATEGORIES.find((c) => c.value === row.original.category);
          return <Badge>{cat?.label || row.original.category}</Badge>;
        },
      },
      {
        accessorKey: "severity",
        header: "Mức độ",
        cell: ({ row }) => {
          const sev = SEVERITIES.find((s) => s.value === row.original.severity);
          return <Badge color={sev?.color}>{sev?.label || row.original.severity}</Badge>;
        },
      },
      {
        accessorKey: "isRegex",
        header: "Type",
        cell: ({ row }) => (
          <Badge color={row.original.isRegex ? "blue" : "gray"} variant="light">
            {row.original.isRegex ? "Regex" : "Text"}
          </Badge>
        ),
      },
      {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => (
          <Badge color={row.original.isActive ? "green" : "red"} variant="light">
            {row.original.isActive ? "Hoạt động" : "Bị vô hiệu"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Group gap="xs" justify="flex-end">
            <Button
              variant="subtle"
              color="red"
              size="xs"
              leftSection={<IconTrash size={14} />}
              onClick={() => handleDelete(row.original)}
            >
              Xóa
            </Button>
          </Group>
        ),
      },
    ],
    queryKey: ["admin", "banned-keywords"],
    service: async () => filteredKeywords || [],
  });

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Quản lý từ khóa cấm</Title>
        <AddKeywordModal />
      </Group>

      <Card withBorder padding="md">
        <Group mb="md">
          <TextInput
            placeholder="Tìm kiếm từ khóa..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, maxWidth: 300 }}
          />
          <Text size="sm" c="dimmed">
            {keywords?.length || 0} từ khóa
          </Text>
        </Group>

        <DataTable dataTable={dataTable}>
          <DataTableContent />
        </DataTable>
      </Card>
    </div>
  );
}
