import {
    Button,
    Card,
    Container,
    Group,
    Modal,
    Pagination,
    Select,
    SimpleGrid,
    Stack,
    Text,
    Textarea,
    TextInput,
    Title,
} from "@mantine/core";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useForumBySlug, useForumCategoryBySlug } from "../../hooks/useForum";
import type { IForumCategory } from "../../interfaces/Forum";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { useAllStory } from "../../hooks/useStory";
import type { Story } from "../../interfaces/Story";
import { useUserStore } from "../../stores/useUserStore";
import RequireLoginModal from "../../components/RequireLoginModal";
import ForumService from "../../services/ForumService";
import { showSuccess } from "../../utils/notifications";

const LIMIT = 24;

const ForumTopicPage = () => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data: forum } = useForumBySlug(String(slug));

    const [searchParams] = useSearchParams();
    const page = Number(searchParams.get("page") ?? 1);

    const { data: forumCategory } = useForumCategoryBySlug(forum?.key, page, LIMIT, String(slug));
    const { forumCategories, total } = forumCategory || {};

    const totalPage = Math.ceil(total / LIMIT) === 0 ? 1 : Math.ceil(total / LIMIT);

    const { isLoggedIn } = useUserStore();

    const [opened, { open, close }] = useDisclosure(false);
    const [opendRequireLogin, { open: openRequireLogin, close: closeRequireLogin }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [storyId, setStoryId] = useState("");
    const [description, setDescription] = useState("");
    const [modalError, setModalError] = useState({
        title: false,
        description: false,
        storyId: false,
    });

    const showButton = forum?.key === "story" || forum?.key === "sideline" || forum?.key === "question";

    const handleChangePage = (newPage: number) => {
        navigate(`/community/forums/thao-luan-truyen/?page=${newPage}`);
    };

    const { data: listStoryData } = useAllStory();

    const listStory = listStoryData?.map((item: Story) => ({ value: item._id, label: item.title })) || [];

    const handleOpenModal = () => {
        if (!isLoggedIn) {
            openRequireLogin();
            return;
        }
        open();
    };

    const handleSubmitCreateForumCategory = async () => {
        if (!forum?.id || !forum?.key) {
            return;
        }
        if (!title || !title.trim() || (forum?.key === "story" && !storyId) || !description.trim()) {
            setModalError({ title: !title || !title.trim(), description: !description || !description.trim(), storyId: !storyId });
            return;
        }
        setLoading(true);
        console.log("data", { title, description, storyId });
        const data = await ForumService.createForumCategory(forum?.id, title, description, storyId, forum?.key);
        if (data) showSuccess("Tạo chủ đề diễn đàn theo truyện thành công.");
        handleCloseModal();
        setLoading(false);
        navigate(`/community/forums/thao-luan-truyen/${data.slug}`);
    }

    const handleCloseModal = () => {
        setTitle("");
        setDescription("");
        setStoryId("");
        setModalError({ title: false, description: false, storyId: false });
        close();
    }


    return (
        <Container size="md" mt={16} >
            <Group justify="space-between" mb="lg">
                <Title order={2}>{forum?.name}</Title>

                {showButton && <Button loading={loading} disabled={loading} onClick={handleOpenModal}>
                    Tạo chủ đề mới
                </Button>}
                <RequireLoginModal
                    opened={opendRequireLogin}
                    onClose={closeRequireLogin}
                    onLoginClick={() => navigate("/login")}
                    onSignUpClick={() => navigate("/register")}
                />
                <Modal
                    opened={opened}
                    onClose={close}
                    title="Tạo chủ đề theo truyện"
                    closeOnClickOutside={false}
                >
                    <Stack>
                        <TextInput
                            label="Tiêu đề"
                            placeholder="Nhập tiêu đề chủ đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            error={modalError.title && "Vui lòng nhập tiêu đề của diễn đàn."}
                            disabled={loading}
                        />


                        <Textarea
                            label="Mô tả"
                            placeholder="Nhập mô tả ngắn"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            minRows={3}
                            error={modalError.description && "Vui lòng nhập mô tả ngắn của diễn đàn."}
                            disabled={loading}
                        />

                        {forum?.key === "story" && <Select
                            label="Chọn truyện"
                            placeholder="Chọn truyện muốn thảo luận"
                            data={listStory}
                            value={storyId}
                            onChange={(value) => setStoryId(value || "")}
                            searchable
                            nothingFoundMessage="Không tìm thấy truyện"
                            required={forum?.key === "story"}
                            error={modalError.storyId && "Vui lòng chọn truyện chủ đề của diễn đàn."}
                            disabled={loading}
                        />}

                        <SimpleGrid cols={2} spacing="md" mt={12} className="w-full">
                            <Button disabled={loading} variant="outline" onClick={handleCloseModal}>
                                Hủy
                            </Button>

                            <Button loading={loading} disabled={loading} onClick={handleSubmitCreateForumCategory}>
                                Tạo chủ đề
                            </Button>
                        </SimpleGrid>
                    </Stack>
                </Modal>
            </Group>

            <Stack>
                {forumCategories && forumCategories?.map((fc: IForumCategory) => (
                    <Card
                        key={fc.id}
                        withBorder
                        padding="lg"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(`/community/forums/${forum?.slug}/${fc.slug}`)}
                    >
                        <Text fw={600}>{fc.title}</Text>

                        <Group gap="lg" mt="sm">
                            <Text size="sm">Tác giả: {fc.author.nickName}</Text>
                            <Text size="sm">💬 {fc.post} Bài viết</Text>
                            <Text size="sm">👁 {fc.view} Lượt xem</Text>
                        </Group>
                    </Card>
                ))}
            </Stack>
            <div className="flex justify-center mt-12 mb-8">
                <Pagination.Root
                    total={totalPage}
                    value={page}
                    boundaries={2}
                    onChange={(p) => handleChangePage(p)}
                >
                    <Group gap={5} justify="center">
                        <Pagination.First />
                        <Pagination.Previous />
                        <Pagination.Items />
                        <Pagination.Next />
                        <Pagination.Last />
                    </Group>
                </Pagination.Root>
            </div>
        </Container>
    );
}

export default ForumTopicPage;