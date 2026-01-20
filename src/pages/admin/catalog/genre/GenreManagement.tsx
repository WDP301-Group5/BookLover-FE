import { ActionIcon, Box, Button, Group, Image, Modal, Stack, Text, Textarea, TextInput, Title } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconEdit, IconPhoto, IconPlus, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { column, DataTable, DataTableColumns, DataTableContent, DataTablePagination, useDataTable } from "../../../../components/data-table";
import { DataTableFilter } from "../../../../components/data-table/filter";
import { format } from "../../../../lib/format";
import { showError, showSuccess } from "../../../../utils/notifications";

export function GenreManagement() {
  const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
  const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [formData, setFormData] = useState({ name: '', description: '', avatar: '' });
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleOpenEdit = (genre: Genre) => {
    setFormData({
      name: genre.name,
      description: genre.description,
      avatar: genre.avatar,
    });
    setPreviewImage(genre.avatar);
    openEdit();
  };

  const handleFileUpload = (files: File[]) => {
    const file = files[0];
    if (file) {
      // setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    // setSelectedFile(null);
    setFormData({ ...formData, avatar: '' });
  };

  const handleDelete = (genre: Genre) => {
    // TODO: Call API to delete genre
    showSuccess(`Xóa thể loại "${genre.name}" thành công`);
    dataTable.table.resetRowSelection();
  };

  const dataTable = useDataTable<Genre>({
    columns: getColumns(handleOpenEdit, handleDelete),
    service,
  })

  const selectedRowCount = dataTable.table.getSelectedRowModel().rows.length;

  const handleDeleteSelected = () => {
    const selectedRows = dataTable.table.getSelectedRowModel().rows;
    const selectedGenres = selectedRows.map(row => row.original);
    const count = selectedGenres.length;

    modals.openConfirmModal({
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa <Text span fw={600}>{count}</Text> thể loại đã chọn? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        // TODO: Call API to delete multiple genres
        showSuccess(`Đã xóa ${count} thể loại thành công`);
        dataTable.table.resetRowSelection();
      },
    });
  };

  const handleCreate = () => {
    if (!formData.name.trim()) {
      showError('Vui lòng nhập tên thể loại');
      return;
    }
    // TODO: Call API to create genre (use selectedFile for upload)
    showSuccess('Tạo thể loại thành công');
    closeCreate();
    setFormData({ name: '', description: '', avatar: '' });
    setPreviewImage(null);
    dataTable.table.resetRowSelection();
  };

  const handleEdit = () => {
    if (!formData.name.trim()) {
      showError('Vui lòng nhập tên thể loại');
      return;
    }
    // TODO: Call API to update genre (use selectedFile for upload if exists)
    showSuccess('Cập nhật thể loại thành công');
    closeEdit();
    setFormData({ name: '', description: '', avatar: '' });
    setPreviewImage(null);
  };

  const handleCloseCreate = () => {
    closeCreate();
    setPreviewImage(null);
  };

  const handleCloseEdit = () => {
    closeEdit();
    setPreviewImage(null);
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
        <DataTableContent className="h-[calc(100vh-22.6rem)]" />
        <DataTablePagination />
      </DataTable>

      {/* Create Modal */}
      <Modal opened={createOpened} onClose={handleCloseCreate} title="Tạo thể loại mới" size="lg">
        <Stack gap="md">
          <TextInput
            label="Tên thể loại"
            placeholder="Nhập tên thể loại"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
          <div>
            <Text size="sm" fw={500} mb={5}>
              Hình ảnh
            </Text>
            {previewImage ? (
              <Box pos="relative" style={{ display: 'inline-block' }}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  h={150}
                  w="auto"
                  fit="contain"
                  style={{ borderRadius: 'var(--mantine-radius-md)', border: '1px solid var(--mantine-color-default-border)' }}
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
                  border: '1px solid var(--mantine-color-default-border)',
                  borderRadius: 'var(--mantine-radius-md)',
                }}
              >
                <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
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
            <Button onClick={handleCreate}>
              Tạo mới
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal opened={editOpened} onClose={handleCloseEdit} title="Chỉnh sửa thể loại" size="lg">
        <Stack gap="md">
          <TextInput
            label="Tên thể loại"
            placeholder="Nhập tên thể loại"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
          <div>
            <Text size="sm" fw={500} mb={5}>
              Hình ảnh
            </Text>
            {previewImage ? (
              <Box pos="relative" style={{ display: 'inline-block' }}>
                <Image
                  src={previewImage}
                  alt="Preview"
                  h={150}
                  w="auto"
                  fit="contain"
                  style={{ borderRadius: 'var(--mantine-radius-md)', border: '1px solid var(--mantine-color-default-border)' }}
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
                  border: '1px solid var(--mantine-color-default-border)',
                  borderRadius: 'var(--mantine-radius-md)',
                }}
              >
                <Group justify="center" gap="xl" mih={120} style={{ pointerEvents: 'none' }}>
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
            <Button onClick={handleEdit}>
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
      title: 'Xác nhận xóa',
      children: (
        <Text size="sm">
          Bạn có chắc chắn muốn xóa thể loại <Text span fw={600}>"{genre.name}"</Text>? Hành động này không thể hoàn tác.
        </Text>
      ),
      labels: { confirm: 'Xóa', cancel: 'Hủy' },
      confirmProps: { color: 'red' },
      onConfirm: () => onDelete(genre),
    });
  };

  return [
    column.select(),
    {
      accessorKey: 'avatar',
      header: 'Hình ảnh',
      cell: ({ row }) => (
        <div className="size-10 rounded-full overflow-hidden">
          <Image src={row.original.avatar} alt={row.original.name} />
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Tên thể loại',
    },
    {
      accessorKey: 'description',
      header: 'Mô tả',
    },
    {
      accessorKey: 'createdAt',
      header: 'Ngày tạo',
    },
    {
      accessorKey: 'updatedAt',
      header: 'Ngày cập nhật',
    },
    {
      id: 'actions',
      header: 'Hành động',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <ActionIcon variant="transparent" onClick={() => onEdit(row.original)}>
            <IconEdit size={16} />
          </ActionIcon>
          <ActionIcon variant="transparent" color="red" onClick={() => handleDeleteClick(row.original)}>
            <IconTrash size={16} />
          </ActionIcon>
        </div>
      ),
    }
  ];
}

type Genre = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

const service = () => {
  return new Promise<Genre[]>((resolve) => setTimeout(() => resolve(data), 1000))
}

const data: Genre[] = Array.from({ length: 10 }, (_, index) => ({
  id: index.toString(),
  name: `Thể loại ${index + 1}`,
  description: `Mô tả ${index + 1}`,
  avatar: `https://placehold.co/150?text=${index + 1}`,
  createdAt: format.date(new Date()),
  updatedAt: format.date(new Date()),
}))