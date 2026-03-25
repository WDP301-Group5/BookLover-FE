import {
    ActionIcon,
    Badge,
    Button,
    Group,
    Modal,
    Select,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import {
    IconEdit,
    IconPlus,
    IconTrash,
} from "@tabler/icons-react";
import {
    column,
    DataTable,
    DataTableColumns,
    DataTableContent,
    DataTablePagination,
    useDataTable,
} from "../../../../components/data-table";
import { DataTableFilter } from "../../../../components/data-table/filter";
import { modals } from "@mantine/modals";
import type { Topic } from "../../../../interfaces/Topic";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import * as z from "zod";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "../../../../lib/format";
import { TopicService } from "../../../../services/TopicService";
import { showError, showSuccess } from "../../../../utils/notifications";
import { useQueryClient } from "@tanstack/react-query";

const topicSchema = z.object({
    name: z.string().min(1, "Vui lòng nhập tên chủ đề"),
    description: z.string().optional(),
    status: z.enum(["active", "inactive"]),
});

type TopicFormValues = z.infer<typeof topicSchema>;

const TopicManagementPage = () => {

    const [createOpened, { open: openCreate, close: closeCreate }] =
        useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] =
        useDisclosure(false);
    const [editingGenre, setEditingGenre] = useState<Topic | null>(null);
    const queryClient = useQueryClient();

    const form = useForm<TopicFormValues>({
        resolver: zodResolver(topicSchema),
        defaultValues: {
            name: "",
            description: "",
            status: "active",
        },
    });

    const handleDelete = async (genre: Topic) => {
        const data = await TopicService.deleteTopic(genre._id);
        if (data) {
            showSuccess("Xóa chủ đề thành công.");
            await queryClient.invalidateQueries({ queryKey: ["topics"] });
            dataTable.table.resetRowSelection();
        } else {
            showError("Xóa chủ đề thất bại. Vui lòng thử lại sau.");
        }
    };

    const handleOpenEdit = (topic: Topic) => {
        setEditingGenre(topic);
        form.reset({
            name: topic.name,
            description: topic.description,
            status: topic.status,
        });
        openEdit();
    };

    const dataTable = useDataTable<Topic>({
        columns: getColumns(handleOpenEdit, handleDelete),
        service: TopicService.getAllTopics,
        queryKey: ["topics"],
    });

    const handleDeleteSelected = () => {
        const selectedRows = dataTable.table.getSelectedRowModel().rows;
        const selectedGenres = selectedRows.map((row) => row.original);
        const ids = selectedGenres.map((g) => g._id);
        const count = ids.length;

        modals.openConfirmModal({
            title: "Xác nhận xóa",
            children: (
                <Text size="sm">
                    Bạn có chắc chắn muốn xóa{" "}
                    <Text span fw={600}>
                        {count}
                    </Text>{" "}
                    chủ đề đã chọn? Hành động này không thể hoàn tác.
                </Text>
            ),
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red" },
            onConfirm: async () => {
                const data = await TopicService.deleteManyTopics(ids);
                if (data) {
                    showSuccess("Xóa chủ đề thành công.");
                    await queryClient.invalidateQueries({ queryKey: ["topics"] });
                    dataTable.table.resetRowSelection();
                } else {
                    showError("Xóa chủ đề thất bại. Vui lòng thử lại sau.");
                }
            },
        });
    };

    const handleCreate = form.handleSubmit(async (values) => {
        const formData = new FormData();
        formData.append("name", values.name);
        if (values.description) formData.append("description", values.description);
        formData.append("status", "active");

        const createTopic = await TopicService.createTopic(formData);
        if (createTopic) {
            showSuccess("Tạo chủ đề thành công.");
            await queryClient.invalidateQueries({ queryKey: ["topics"] });
            closeCreate();
            form.reset();
            dataTable.table.resetRowSelection();
        } else {
            showError("Tạo chủ đề thất bại. Vui lòng thử lại.");
        }

    });

    const handleEdit = form.handleSubmit(async (values) => {
        if (!editingGenre) return;

        const formData = new FormData();
        formData.append("name", values.name);
        if (values.description) formData.append("description", values.description);
        formData.append("status", values.status);

        const data = await TopicService.updateTopic(editingGenre._id, formData);
        if (data) {
            showSuccess("Chỉnh sửa chủ đề thành công.");
            await queryClient.invalidateQueries({ queryKey: ["topics"] });
            closeEdit();
            form.reset();
            dataTable.table.resetRowSelection();
        } else {
            showError("Chỉnh sửa chủ đề thất bại. Vui lòng thử lại.");
        }
    });

    const handleCloseCreate = () => {
        closeCreate();
        form.reset();
    };

    const handleCloseEdit = () => {
        closeEdit();
        form.reset();
        setEditingGenre(null);
    };

    const selectedRowCount = dataTable.table.getSelectedRowModel().rows.length;

    return (
        <div className="space-y-4">
            <Group justify="space-between" align="center">
                <Title order={2}>Quản lý chủ đề truyện</Title>
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
                    <Button leftSection={<IconPlus size={18} />} onClick={() => { form.reset({ name: "", description: "", status: "active" }); openCreate(); }}>
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
                title="Tạo chủ đề mới"
                size="lg"
            >
                <Stack gap="md">
                    <TextInput
                        label="Tên chủ đề"
                        placeholder="Nhập tên chủ đề"
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
                title="Chỉnh sửa chủ đề"
                size="lg"
            >
                <Stack gap="md">
                    <TextInput
                        label="Tên chủ đề"
                        placeholder="Nhập tên chủ đề"
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
                    <Controller
                        name="status"
                        control={form.control}
                        defaultValue={editingGenre?.status || "active"}
                        render={({ field }) => (
                            <Select
                                label="Trạng thái"
                                value={field.value}
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                ref={field.ref}
                                allowDeselect={false}
                                data={[
                                    { value: "active", label: "Hoạt động" },
                                    { value: "inactive", label: "Dừng hoạt động" },
                                ]}
                            />
                        )}
                    />
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
};

function getColumns(
    onEdit: (topic: Topic) => void,
    onDelete: (topic: Topic) => void,
): ColumnDef<Topic>[] {
    const handleDeleteClick = (topic: Topic) => {
        modals.openConfirmModal({
            title: "Xác nhận xóa",
            children: (
                <Text size="sm">
                    Bạn có chắc chắn muốn xóa chủ đề{" "}
                    <Text span fw={600}>
                        "{topic.name}"
                    </Text>
                    ? Hành động này không thể hoàn tác.
                </Text>
            ),
            labels: { confirm: "Xóa", cancel: "Hủy" },
            confirmProps: { color: "red" },
            onConfirm: () => onDelete(topic),
        });
    };

    return [
        column.select(),
        {
            accessorKey: "name",
            header: "Tên chủ đề",
        },
        {
            accessorKey: "description",
            header: "Mô tả",
        },
        {
            accessorKey: "status",
            header: "Trạng thái",
            cell: ({ row }) => (
                <Badge size="xs" className="min-w-32" color={row.original.status === "active" ? "green" : "red"}>{row.original.status === "active" ? "Hoạt động" : "Dừng hoạt động"}</Badge>
            ),
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

export default TopicManagementPage;