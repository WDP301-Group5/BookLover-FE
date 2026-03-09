import {
	Anchor,
	Badge,
	Breadcrumbs,
	Button,
	Container,
	Divider,
	Group,
	Image,
	Loader,
	Paper,
	Rating,
	Spoiler,
	Stack,
	Text,
	Textarea,
	Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
	Activity,
	ChevronRight,
	Clock,
	Eye,
	Heart,
	MessageCircle,
	Star,
	Tags,
	User,
} from "lucide-react";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import RequireLoginModal from "../../components/Modal/RequireLoginModal";
import { useChaptersByStory } from "../../hooks/useChapter";
import { useStoryDetail } from "../../hooks/useStory";
import { slugify } from "../../utils";

const StoryDetailPage: FC = () => {
	const { slug } = useParams<{ slug: string }>();

	const {
		data: story,
		isLoading: storyLoading,
		isError: storyError,
	} = useStoryDetail(slug || "");

  const { data: chapters, isLoading: chapterLoading } =
    useChaptersByStory(story?.id || "");

	const [followed, { toggle }] = useDisclosure(false);
	const [hoverRating, setHoverRating] = useState<number | null>(null);
	const [loginModalOpened, setLoginModalOpened] = useState(false);
	const isLoggedIn = false;

	const viewData = useMemo(() => {
		if (!story) return null;

		return {
			title: story.title,
			breadcrumbs: [
				{ label: "Trang chủ", href: "/" },
				...(story.topics || []).map((t) => ({
					label: t,
					href: `/the-loai/${slugify(t)}`,
				})),
			],
			coverUrl: story.image,
			author: story.author?.penName || story.author?.name || "Đang cập nhật",
			status: story.status || "Đang tiến hành",
			genres: story.topics || [],
			views: story.views || 0,
			rating:
				story.stars && story.rates
					? Number((story.stars / story.rates).toFixed(1))
					: 0,
			ratingCount: story.rates || 0,
			updatedAt: story.updatedAt
				? new Date(story.updatedAt).toLocaleString("vi-VN")
				: "",
			description: story.description || "",
			chapters:
				chapters?.map((c) => ({
					number: `Chapter ${c.chapterNumber}`,
					title: c.title,
					updatedAt: c.updatedAt
						? new Date(c.updatedAt).toLocaleString("vi-VN")
						: "",
					views: c.views || 0,
				})) || [],
		};
	}, [story, chapters]);

	if (storyLoading || chapterLoading) {
		return (
			<Container size="lg" py="xl" ta="center">
				<Loader />
			</Container>
		);
	}

	if (storyError || !viewData) {
		return (
			<Container size="lg" py="xl" ta="center">
				<Text c="red">Không thể tải dữ liệu truyện</Text>
			</Container>
		);
	}

	const {
		title,
		breadcrumbs,
		coverUrl,
		author,
		status,
		genres,
		views,
		rating,
		ratingCount,
		updatedAt,
		description,
		chapters: chapterList,
	} = viewData;

	return (
		<Container size="lg" py="md">
			<Breadcrumbs mb="sm">
				{breadcrumbs.map((item, index) => (
					<Anchor key={index} href={item.href} size="sm">
						{item.label}
					</Anchor>
				))}
				<Text size="sm" c="dimmed">
					{title}
				</Text>
			</Breadcrumbs>

			<Paper withBorder p="md" radius="md" mb="lg">
				<Group align="flex-start" gap={16} wrap="nowrap">
					<Image
						src={coverUrl}
						alt={title}
						w={200}
						h={260}
						radius="sm"
						fit="contain"
					/>

					<Stack flex={1} gap={6}>
						<Title order={2}>{title}</Title>

						<Stack gap={10}>
							<Group gap={6}>
								<User size={14} />
								<Text size="sm" fw={500}>
									Tác giả:
								</Text>
								<Text size="sm">{author}</Text>
							</Group>

							<Group gap={6}>
								<Activity size={14} />
								<Text size="sm" fw={500}>
									Tình trạng:
								</Text>
								<Badge size="xs" color="green">
									{status}
								</Badge>
							</Group>

							<Group gap={6} wrap="wrap">
								<Tags size={14} />
								<Text size="sm" fw={500}>
									Thể loại:
								</Text>
								{genres.map((g) => (
									<Badge key={g} size="xs" variant="light">
										{g}
									</Badge>
								))}
							</Group>

							<Group gap={6}>
								<Star size={14} />
								<Text size="sm" fw={500}>
									Đánh giá:
								</Text>
								<Rating
									value={hoverRating ?? rating}
									fractions={2}
									size="sm"
									onHover={setHoverRating}
									onMouseLeave={() => setHoverRating(null)}
								/>
								<Text size="xs" c="dimmed">
									{Math.max(0, hoverRating ?? rating)} / 5 ({ratingCount})
								</Text>
							</Group>

							<Group gap={6}>
								<Clock size={14} />
								<Text size="sm" fw={500}>
									Cập nhật cuối: {updatedAt}
								</Text>
							</Group>

							<Group gap={6}>
								<Eye size={14} />
								<Text size="sm" fw={500}>
									{views.toLocaleString("vi-VN")} lượt xem
								</Text>
							</Group>
						</Stack>

						<Group mt="xs">
							<Button
								size="xs"
								color="red"
								variant={followed ? "filled" : "outline"}
								leftSection={
									<Heart size={14} fill={followed ? "currentColor" : "none"} />
								}
								onClick={() => {
									if (!isLoggedIn) {
										setLoginModalOpened(true);
										return;
									}
									toggle();
								}}
							>
								{followed ? "Đã theo dõi" : "Theo dõi"}
							</Button>

							<Button
								size="xs"
								color="blue"
								disabled={!chapterList.length}
								component="a"
								href={
									chapterList.length
										? `/truyen/${slugify(title)}/chuong/${
												chapterList[0].number.split(" ")[1]
											}`
										: "#"
								}
							>
								Đọc từ đầu
							</Button>

							<Button
								size="xs"
								color="green"
								disabled={!chapterList.length}
								component="a"
								href={
									chapterList.length
										? `/truyen/${slugify(title)}/chuong/${
												chapterList[chapterList.length - 1].number.split(" ")[1]
											}`
										: "#"
								}
							>
								Đọc mới nhất
							</Button>
						</Group>
					</Stack>
				</Group>

				<Divider my="sm" />

				<Title order={4}>Giới thiệu truyện</Title>
				<Spoiler maxHeight={100} showLabel="Xem thêm" hideLabel="Ẩn bớt">
					<Text size="sm" style={{ whiteSpace: "pre-line" }}>
						{description}
					</Text>
				</Spoiler>
			</Paper>

			<Paper withBorder radius="md" p="md" mb="lg">
				<Group pb={6} mb={6} style={{ borderBottom: "2px solid #228be6" }}>
					<ChevronRight size={14} color="#228be6" />
					<Title order={5} c="blue">
						DANH SÁCH CHƯƠNG
					</Title>
				</Group>

				<Stack gap={0}>
					{chapterList.map((chapter, index) => (
						<Group
							key={index}
							justify="space-between"
							px="xs"
							py={6}
							style={{ borderBottom: "1px dashed #e9ecef" }}
						>
							<Anchor
								size="sm"
								fw={500}
								href={`/truyen/${slugify(title)}/chuong/${
									chapter.number.split(" ")[1]
								}`}
							>
								{chapter.number}
							</Anchor>

							<Text size="xs" c="dimmed">
								{chapter.updatedAt}
							</Text>
						</Group>
					))}
				</Stack>
			</Paper>

			<Paper withBorder radius="md" p="md">
				<Group mb="xs">
					<MessageCircle size={16} />
					<Title order={4}>Bình luận</Title>
				</Group>

				<Stack gap="xs">
					<Textarea size="sm" minRows={3} placeholder="Viết bình luận..." />
					<Button
						size="xs"
						w="fit-content"
						onClick={() => {
							if (!isLoggedIn) {
								setLoginModalOpened(true);
								return;
							}
						}}
					>
						Gửi bình luận
					</Button>
				</Stack>
			</Paper>

			<RequireLoginModal
				opened={loginModalOpened}
				onClose={() => setLoginModalOpened(false)}
			/>
		</Container>
	);
};

export default StoryDetailPage;
