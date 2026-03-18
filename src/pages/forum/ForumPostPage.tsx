import {
    Avatar,
    Box,
    Button,
    Card,
    Container,
    Group,
    HoverCard,
    Pagination,
    Stack,
    Text,
    Textarea,
    Title,
} from "@mantine/core";
import { useMemo, useState } from "react";
import { useForumPostByForumCategoryId, useOneForumCategoryBySlug, useReplyForumPost, useUserReactOfForumCategory } from "../../hooks/useForum";
import { useNavigate, useParams } from "react-router-dom";
import { IconHeartFilled, IconMessageCircle, IconMoodAngry, IconMoodSad, IconMoodSmile, IconMoodSurprised, IconThumbUp } from "@tabler/icons-react";
import { ReactIcons } from "../../components/reactComment/ReactIcon";
import { ReactType, type ReactTypeValue } from "../../interfaces/ReactComment";
import ForumService from "../../services/ForumService";
import { showSuccess } from "../../utils/notifications";
import type { IForumPost, IReply, ReactPost } from "../../interfaces/Forum";
import { getReactColor, totalReact } from "../../utils/reactComment";
import { useQueryClient } from "@tanstack/react-query";
import RequireLoginModal from "../../components/RequireLoginModal";
import { useUserStore } from "../../stores/useUserStore";

const LIMIT = 24;

const ForumPostPage = () => {
    const { topicSlug } = useParams();
    const [content, setContent] = useState("");
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const [showLoginModal, setShowLoginModal] = useState(false);
    const { isLoggedIn } = useUserStore();
    const navigate = useNavigate();

    const { data: forumCategory } = useOneForumCategoryBySlug(
        topicSlug || ""
    );

    const { data: forumPostData } = useForumPostByForumCategoryId(forumCategory?.id || "", page, LIMIT);
    const { forumPosts, total } = forumPostData || {};

    const [showReply, setShowReply] = useState("");
    const [replyingForumPostId, setReplyingForumPostId] = useState<string>("");
    const [replyContent, setReplyContent] = useState("");
    const [expandedReplys, setExpandedReplys] = useState<string[]>([]);
    const [repliesMap] = useState<Record<string, IReply[]>>({});

    console.log("replyMap", repliesMap)

    const { data: userReact } = useUserReactOfForumCategory(forumCategory?.id || "");
    const userReactMap = useMemo(() => {
        if (!userReact || !userReact.length) return new Map();
        return new Map(
            userReact?.map((r: ReactPost) => [r.forumPostId, r.react]) ?? [],
        );
    }, [userReact]);

    const toggleReplies = (forumPostId: string) => {
        if (expandedReplys.includes(forumPostId)) {
            setExpandedReplys((prev) => prev.filter((id) => id !== forumPostId));
        } else {
            setExpandedReplys((prev) => [...prev, forumPostId]);
            setShowReply(forumPostId);
        }
    };

    const { data: replyData, refetch: refetchReplyPosts } =
        useReplyForumPost(showReply);
    // console.log("reply", replyData)
    repliesMap[showReply] = replyData ?? [];

    const handleReply = async () => {
        if (!isLoggedIn) return setShowLoginModal(true);
        if (!replyingForumPostId || !replyContent || !replyContent.trim()) return;
        const data = await ForumService.replyForumPost(replyingForumPostId, replyContent);
        if (data) showSuccess("Trả lời bài đăng thành công.");
        await queryClient.invalidateQueries({ queryKey: ["forumPostByForumCategoryId", forumCategory.id, page, LIMIT] });
        await refetchReplyPosts();
        setReplyContent("");
        setShowReply("");
        setReplyingForumPostId("");
    };

    const handleComment = async () => {
        if (!isLoggedIn) return setShowLoginModal(true);
        if (!content || !forumCategory || !forumCategory.id || !forumCategory._id) return;
        const newPost = await ForumService.createForumPost(forumCategory.id, content);
        if (newPost) showSuccess("Đăng bài thành công.");
        await queryClient.invalidateQueries({ queryKey: ["forumPostByForumCategoryId", forumCategory.id, page, LIMIT] });
        setContent("");
    };

    const handleUserReact = async (forumPostId: string, react: ReactTypeValue) => {
        if (!isLoggedIn) return setShowLoginModal(true);
        if (!forumPostId || !react) return;
        const forumCategoryId = forumCategory?.id || "";
        if (!forumCategoryId) return;
        const submitResult = await ForumService.userReactForumPost(forumCategoryId, forumPostId, react);
        if (submitResult) showSuccess("Thành công.");
        await queryClient.invalidateQueries({ queryKey: ["userReactOfForumCategory", forumCategory.id] });
        await queryClient.invalidateQueries({ queryKey: ["forumPostByForumCategoryId", forumCategory.id, page, LIMIT] });
    };

    return (
        <Box className="h-screen pb-16 flex flex-col">
            {/* HEADER */}
            <Box className="p-4 border-b">
                <Container size="md">
                    <Title order={3}>
                        Chủ đề:{" "}
                        <span className="text-blue-500">
                            {forumCategory?.title}
                        </span>
                    </Title>
                    <Text c="dimmed">{forumCategory?.description}</Text>
                </Container>
            </Box>
            <RequireLoginModal
                onLoginClick={() => navigate("/login")}
                opened={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                onSignUpClick={() => navigate("/register")}
            />

            {/* CONTENT SCROLL */}
            <Box className="flex-1 h-96 overflow-y-auto">
                <Container size="md" py="md">
                    <Stack>
                        {forumPosts && forumPosts?.map((post: IForumPost) => (
                            <Card withBorder py={4} px={8} radius="md">
                                <Stack gap="xs">
                                    {/* HEADER */}
                                    <Group justify="space-between">
                                        <Group gap="sm">
                                            <Avatar src={post?.userId?.avatarURL} radius="xl" />
                                            <Box>
                                                <Text size="sm" fw={600}>{post?.userId?.nickName}</Text>
                                                <Group gap={4}>
                                                    <Text size="md" fw={400} >
                                                        {post?.content}
                                                    </Text>
                                                </Group>
                                            </Box>
                                        </Group>
                                    </Group>

                                    {/* ACTIONS */}
                                    <Group gap="lg" mt={0}>
                                        {/* REACT */}
                                        <HoverCard
                                            position="top-start"
                                            openDelay={800}
                                            closeDelay={800}
                                            shadow="md"
                                            transitionProps={{ transition: "pop", duration: 200 }}
                                            withinPortal
                                        >
                                            <HoverCard.Target>
                                                <Button
                                                    variant="outline"
                                                    radius="sm"
                                                    size="xs"
                                                    color={`${userReactMap?.get(post?.id) ? getReactColor(userReactMap?.get(post?.id) as ReactTypeValue) : "gray.5"}`}
                                                    onClick={() =>
                                                        handleUserReact(
                                                            post?.id,
                                                            (userReactMap?.get(post?.id) && userReactMap?.get(post?.id) !== ReactType.UNLIKE)
                                                                ? ReactType.UNLIKE
                                                                : ReactType.LIKE,
                                                        )
                                                    }
                                                >
                                                    <Group gap={6}>
                                                        {
                                                            ReactIcons[
                                                            (userReactMap?.get(post.id) as ReactTypeValue) ||
                                                            ReactType.UNLIKE
                                                            ]
                                                        }
                                                        <Text size="sm" fw={500}>
                                                            {totalReact(post?.react as Record<string, number>) || 0}
                                                        </Text>
                                                    </Group>
                                                </Button>
                                            </HoverCard.Target>

                                            <HoverCard.Dropdown
                                                p={6}
                                                className="rounded-xl border border-gray-200 bg-white shadow-lg"
                                            >
                                                <Group gap={6}>
                                                    {/* Like */}
                                                    <Button
                                                        variant="outline"
                                                        radius="xl"
                                                        size="xs"
                                                        className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                                        onClick={() =>
                                                            handleUserReact(post?.id, ReactType.LIKE)
                                                        }
                                                    >
                                                        <IconThumbUp size={18} className="text-blue-500" />
                                                    </Button>

                                                    {/* Love */}
                                                    <Button
                                                        variant="outline"
                                                        radius="xl"
                                                        size="xs"
                                                        className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                                        onClick={() =>
                                                            handleUserReact(post?.id, ReactType.LOVE)
                                                        }
                                                    >
                                                        <IconHeartFilled
                                                            size={18}
                                                            className="text-pink-500"
                                                        />
                                                    </Button>

                                                    {/* Haha */}
                                                    <Button
                                                        variant="outline"
                                                        radius="xl"
                                                        size="xs"
                                                        className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                                        onClick={() =>
                                                            handleUserReact(post?.id, ReactType.HAHA)
                                                        }
                                                    >
                                                        <IconMoodSmile
                                                            size={18}
                                                            className="text-yellow-500"
                                                        />
                                                    </Button>

                                                    {/* Wow */}
                                                    <Button
                                                        variant="outline"
                                                        radius="xl"
                                                        size="xs"
                                                        className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                                        onClick={() => handleUserReact(post?.id, ReactType.WOW)}
                                                    >
                                                        <IconMoodSurprised
                                                            size={18}
                                                            className="text-orange-500"
                                                        />
                                                    </Button>

                                                    {/* Sad */}
                                                    <Button
                                                        variant="outline"
                                                        radius="xl"
                                                        size="xs"
                                                        className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                                        onClick={() => handleUserReact(post?.id, ReactType.SAD)}
                                                    >
                                                        <IconMoodSad size={18} className="text-blue-400" />
                                                    </Button>

                                                    {/* Angry */}
                                                    <Button
                                                        variant="outline"
                                                        radius="xl"
                                                        size="xs"
                                                        className="transition-all duration-200 hover:-translate-y-1 hover:scale-125"
                                                        onClick={() =>
                                                            handleUserReact(post?.id, ReactType.ANGRY)
                                                        }
                                                    >
                                                        <IconMoodAngry size={18} className="text-red-600" />
                                                    </Button>
                                                </Group>
                                            </HoverCard.Dropdown>
                                        </HoverCard>

                                        {/* REPLY */}
                                        <Group
                                            gap={4}
                                            style={{ cursor: "pointer" }}
                                            onClick={() => setReplyingForumPostId(replyingForumPostId === post?.id ? "" : post?.id)}
                                        >
                                            <IconMessageCircle size={16} />
                                            <Text size="sm">Trả lời</Text>
                                        </Group>

                                        {/* VIEW REPLIES */}
                                        {post?.replyCount && post?.replyCount > 0 && (
                                            <Button
                                                variant="subtle"
                                                size="xs"
                                                onClick={() => toggleReplies(post?.id)}
                                            >
                                                {expandedReplys.includes(post?.id)
                                                    ? "Ẩn trả lời"
                                                    : `Xem ${post?.replyCount} trả lời`}
                                            </Button>
                                        )}
                                    </Group>

                                    {/* REPLY INPUT */}
                                    {replyingForumPostId === post?.id && (
                                        <Box className="border-t sticky bottom-0 p-0">
                                            <Container size="md">
                                                <Group mt={6} justify="space-between">
                                                    <Textarea
                                                        placeholder="Viết trả lời..."
                                                        value={replyContent}
                                                        onChange={(e) => setReplyContent(e.target.value)}
                                                        autosize
                                                        minRows={1}
                                                        className="w-[calc(100%-100px)]"
                                                    />

                                                    <Button className="w-[60px]" size="sm" onClick={handleReply}>
                                                        Gửi
                                                    </Button>
                                                </Group>
                                            </Container>
                                        </Box>
                                    )}

                                    {/* REPLIES */}
                                    {expandedReplys?.includes(post?.id) && repliesMap[post?.id] && (
                                        <Stack mt={8} ml={20} pl="lg">
                                            {repliesMap[post?.id].map((reply) => (
                                                <Card key={reply.id} withBorder p={1} px={8} radius="md">
                                                    <Group>
                                                        <Avatar src={reply.userId?.avatarURL} radius="xl" size="md" />
                                                        <Box>
                                                            <Text size="sm" fw={500}>{reply.userId.nickName}</Text>
                                                            <Text size="sm" mt={4}>
                                                                {reply.content}
                                                            </Text>
                                                        </Box>
                                                    </Group>

                                                </Card>
                                            ))}
                                        </Stack>
                                    )}
                                </Stack>
                            </Card>
                        ))}
                    </Stack>
                </Container>
            </Box>
            <Pagination
                value={page}
                total={Math.ceil(total / LIMIT)}
                onChange={setPage}
                mx={"auto"}
                my={12}
            />

            {/* INPUT FIXED BOTTOM */}
            <Box className="border-t sticky bottom-0 p-6">
                <Container size="md">
                    <Group align="flex-end">
                        <Textarea
                            placeholder="Viết bình luận..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            autosize
                            minRows={1}
                            maxRows={3}
                            className="flex-1"
                            autoFocus
                        />

                        <Button onClick={handleComment}>
                            Gửi
                        </Button>
                    </Group>
                </Container>
            </Box>
        </Box>
    );
};

export default ForumPostPage;