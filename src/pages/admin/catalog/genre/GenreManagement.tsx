import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconEdit,
  IconPhoto,
  IconPlus,
  IconTrash,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  column,
  DataTable,
  DataTableColumns,
  DataTableContent,
  DataTablePagination,
  useDataTable,
} from "../../../../components/data-table";
import { DataTableFilter } from "../../../../components/data-table/filter";
import {
  useCreateGenre,
  useDeleteGenre,
  useDeleteGenres,
  useUpdateGenre,
} from "../../../../hooks/useGenre";
import type { Genre } from "../../../../interfaces/genre";
import { format } from "../../../../lib/format";
import { GenreService } from "../../../../services/GenreService";

const genreSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập tên thể loại"),
  description: z.string().optional(),
  avatar: z.string().optional(),
});

type GenreFormValues = z.infer<typeof genreSchema>;

export function GenreManagement() {
  const [createOpened, { open: openCreate, close: closeCreate }] =
    useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);

  const { mutate: createGenre } = useCreateGenre();
  const { mutate: updateGenre } = useUpdateGenre();
  const { mutate: deleteGenre } = useDeleteGenre();
  const { mutate: deleteManyGenres } = useDeleteGenres();

  const form = useForm<GenreFormValues>({
    resolver: zodResolver(genreSchema),
    defaultValues: {
      name: "",
      description: "",
      avatar: "",
    },
  });

  const handleOpenEdit = (genre: Genre) => {
    setEditingGenre(genre);
    form.reset({
      name: genre.name,
      description: genre.description,
      avatar: genre.avatar,
    });
    setPreviewImage(genre.avatar);
    setSelectedFile(null);
    openEdit();
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewImage(result);
        form.setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    form.setValue("avatar", "");
  };

  const handleDelete = (genre: Genre) => {
    deleteGenre(genre.id, {
      onSuccess: () => {
        dataTable.table.resetRowSelection();
      },
    });
  };

  const dataTable = useDataTable<Genre>({
    columns: getColumns(handleOpenEdit, handleDelete),
    service: GenreService.getAll,
    queryKey: ["genres"],
  });

  const selectedRowCount = dataTable.table.getSelectedRowModel().rows.length;

  const handleDeleteSelected = () => {
    const selectedRows = dataTable.table.getSelectedRowModel().rows;
    const selectedGenres = selectedRows.map((row) => row.original);
    const ids = selectedGenres.map((g) => g.id);
    const count = ids.length;

    modals.openConfirmModal({
      title: "Xác nhận xóa",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa{" "}
          <Text span fw={600}>
            {count}
          </Text>{" "}
          thể loại đã chọn? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => {
        deleteManyGenres(ids, {
          onSuccess: () => {
            dataTable.table.resetRowSelection();
          },
        });
      },
    });
  };

  const handleCreate = form.handleSubmit((values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    createGenre(formData, {
      onSuccess: () => {
        closeCreate();
        form.reset();
        setPreviewImage(null);
        setSelectedFile(null);
        dataTable.table.resetRowSelection();
      },
    });
  });

  const handleEdit = form.handleSubmit((values) => {
    if (!editingGenre) return;

    const formData = new FormData();
    formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }

    updateGenre(
      { id: editingGenre.id, data: formData },
      {
        onSuccess: () => {
          closeEdit();
          form.reset();
          setPreviewImage(null);
          setSelectedFile(null);
          setEditingGenre(null);
        },
      }
    );
  });

  const handleCloseCreate = () => {
    closeCreate();
    form.reset();
    setPreviewImage(null);
    setSelectedFile(null);
  };

  const handleCloseEdit = () => {
    closeEdit();
    form.reset();
    setPreviewImage(null);
    setSelectedFile(null);
    setEditingGenre(null);
  };

  return (
    <div className="space-y-4">
      <Group justify="space-between" align="center">
        <Title order={2}>Quản lý thể loại truyện</Title>
        <Group gap="xs">
          <Button
            leftSection={<IconTrash size={18} />}
            onClick={handleDeleteSelected}
            disabled={selectedRowCount === 0}
            color="red"
            variant="filled"
          >
            Xóa ({selectedRowCount})
          </Button>
          <Button leftSection={<IconPlus size={18} />} onClick={openCreate}>
            Tạo mới
          </Button>
        </Group>
      </Group>

      <DataTable dataTable={dataTable}>
        <div className="flex items-center justify-between gap-4">
          <DataTableFilter />
          <DataTableColumns />
        </div>
        <DataTableContent />
        <DataTablePagination />
      </DataTable>

      {/* Create Modal */}
      <Modal
        opened={createOpened}
        onClose={handleCloseCreate}
        title="Tạo thể loại mới"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Tên thể loại"
            placeholder="Nhập tên thể loại"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            required
          />
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả"
            {...form.register("description")}
            error={form.formState.errors.description?.message}
            rows={4}
          />
          <div>
            <Text size="sm" fw={500} mb={5}>
              Hình ảnh
            </Text>
            {previewImage ? (
              <Box pos="relative" style={{ display: "inline-block" }}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  h={150}
                  w="auto"
                  fit="contain"
                  style={{
                    borderRadius: "var(--mantine-radius-md)",
                    border: "1px solid var(--mantine-color-default-border)",
                  }}
                />
                <ActionIcon
                  variant="filled"
                  color="red"
                  size="sm"
                  pos="absolute"
                  top={5}
                  right={5}
                  onClick={handleRemoveImage}
                  style={{ zIndex: 1 }}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Box>
            ) : (
              <Dropzone
                onDrop={handleFileUpload}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                maxSize={5 * 1024 * 1024}
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                  borderRadius: "var(--mantine-radius-md)",
                }}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={120}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={52} stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={52} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={52} stroke={1.5} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Kéo thả hình ảnh hoặc click để chọn
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Hỗ trợ JPG, PNG, tối đa 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
          </div>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleCloseCreate}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleCreate}
              loading={form.formState.isSubmitting}
            >
              Tạo mới
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editOpened}
        onClose={handleCloseEdit}
        title="Chỉnh sửa thể loại"
        size="lg"
      >
        <Stack gap="md">
          <TextInput
            label="Tên thể loại"
            placeholder="Nhập tên thể loại"
            {...form.register("name")}
            error={form.formState.errors.name?.message}
            required
          />
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả"
            {...form.register("description")}
            error={form.formState.errors.description?.message}
            rows={4}
          />
          <div>
            <Text size="sm" fw={500} mb={5}>
              Hình ảnh
            </Text>
            {previewImage ? (
              <Box pos="relative" style={{ display: "inline-block" }}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  h={150}
                  w="auto"
                  fit="contain"
                  style={{
                    borderRadius: "var(--mantine-radius-md)",
                    border: "1px solid var(--mantine-color-default-border)",
                  }}
                />
                <ActionIcon
                  variant="filled"
                  color="red"
                  size="sm"
                  pos="absolute"
                  top={5}
                  right={5}
                  onClick={handleRemoveImage}
                  style={{ zIndex: 1 }}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Box>
            ) : (
              <Dropzone
                onDrop={handleFileUpload}
                accept={IMAGE_MIME_TYPE}
                multiple={false}
                maxSize={5 * 1024 * 1024}
                style={{
                  border: "1px solid var(--mantine-color-default-border)",
                  borderRadius: "var(--mantine-radius-md)",
                }}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={120}
                  style={{ pointerEvents: "none" }}
                >
                  <Dropzone.Accept>
                    <IconUpload size={52} stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={52} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={52} stroke={1.5} />
                  </Dropzone.Idle>

                  <div>
                    <Text size="xl" inline>
                      Kéo thả hình ảnh hoặc click để chọn
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Hỗ trợ JPG, PNG, tối đa 5MB
                    </Text>
                  </div>
                </Group>
              </Dropzone>
            )}
          </div>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={handleCloseEdit}>
              Hủy
            </Button>
            <Button
              type="submit"
              onClick={handleEdit}
              loading={form.formState.isSubmitting}
            >
              Cập nhật
            </Button>
          </Group>
        </Stack>
      </Modal>
    </div>
  );
}

function getColumns(
  onEdit: (genre: Genre) => void,
  onDelete: (genre: Genre) => void
): ColumnDef<Genre>[] {
  const handleDeleteClick = (genre: Genre) => {
    modals.openConfirmModal({
      title: "Xác nhận xóa",
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa thể loại{" "}
          <Text span fw={600}>
            "{genre.name}"
          </Text>
          ? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: "Xóa", cancel: "Hủy" },
      confirmProps: { color: "red" },
      onConfirm: () => onDelete(genre),
    });
  };

  return [
    column.select(),
    {
      accessorKey: "avatar",
      header: "Hình ảnh",
      cell: ({ row }) => (
        <div className="size-10 rounded-full overflow-hidden">
          <Image src={row.original.avatar} alt={row.original.name} />
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Tên thể loại",
    },
    {
      accessorKey: "description",
      header: "Mô tả",
    },
    {
      accessorKey: "createdAt",
      header: "Ngày tạo",
      cell: ({ row }) =>
        row.original.createdAt
          ? format.date(new Date(row.original.createdAt))
          : "-",
    },
    {
      accessorKey: "updatedAt",
      header: "Ngày sửa",
      cell: ({ row }) =>
        row.original.updatedAt
          ? format.date(new Date(row.original.updatedAt))
          : "-",
    },
    {
      id: "actions",
      header: "Hành động",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <ActionIcon
            variant="transparent"
            onClick={() => onEdit(row.original)}
          >
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon
            variant="transparent"
            color="red"
            onClick={() => handleDeleteClick(row.original)}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      ),
    },
  ];
}
