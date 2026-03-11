// import styles from "./HomePage.module.scss";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { Carousel } from "@mantine/carousel";
import { Group, Pagination, Paper, Text } from "@mantine/core";
import { useNavigate, useSearchParams } from "react-router-dom";
import HistoryTable from "../../components/HistoryTable";
import StoryCard from "../../components/story/StoryCard";
import TopStoryTable from "../../components/TopStoryTable";
import { useNewChapterStory, useRecommendStory } from "../../hooks/useStory";
import type { Story } from "../../interfaces/Story";
import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";

const HomePage = () => {
	const [searchParams] = useSearchParams();
	const page = Number(searchParams.get("page") ?? 1);
	const LIMIT = 24;
	const navigate = useNavigate();
	const autoplay = useRef(Autoplay({ delay: 2000 }));

	const { data: recommendStory } = useRecommendStory();
	const { data: newChapterData } = useNewChapterStory(page, LIMIT);
	const { story: newChapterStory, total } = newChapterData || {
		newChapterStory: [],
		total: 0,
	};

	const handleChangePage = (newPage: number) => {
		navigate(`/?page=${newPage}`);
	};

	return (
		<div className="w-full p-4 bg-custom-bg">
			<Paper shadow="xs" p="sm">
				<Text fw={600} size="lg" mb={8}>
					Truyện đề cử
				</Text>
				<Carousel
					slideSize={{ base: "34%", sm: "20%", md: "18.33%", lg: "14.33%" }}
					slideGap={{ base: 0, sm: "md" }}
					loop
					align="start"
					controlSize={40}
					plugins={[autoplay.current]}
					onMouseEnter={autoplay.current.reset}
					onMouseLeave={autoplay.current.reset}
					onClick={autoplay.current.reset}
				>
					{recommendStory?.map((story: Story) => (
						<Carousel.Slide key={story.id}>
							<StoryCard story={story} type="home" />
						</Carousel.Slide>
					))}
				</Carousel>
			</Paper>
			<Paper shadow="xs" p="sm" my={24}>
				<Text size="lg" fw={600}>
					Khám phá thế giới truyện hấp dẫn
				</Text>

				<Text lineClamp={4}>
					Nền tảng đọc truyện online với hàng nghìn chương truyện được cập nhật
					liên tục. Theo dõi những bộ truyện yêu thích, lưu lại lịch sử đọc và
					mở khóa các chương mới một cách nhanh chóng. Trải nghiệm đọc mượt mà,
					tiện lợi trên mọi thiết bị.
				</Text>
			</Paper>
			<Text fw={600} size="lg" mb={8}>
				Truyện có chương mới
			</Text>
			<div className="grid grid-cols-2 gap-8 lg:grid-cols-3 ">
				<div className="flex flex-col gap-4 md:gap-8 col-span-2">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{newChapterStory?.map((story: Story) => (
							<StoryCard key={story.id} story={story} type="home" />
						))}
					</div>
					<div className="flex justify-center mb-8">
						<Pagination.Root
							total={Math.ceil(total / LIMIT)}
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
				</div>
				<div className="flex flex-col col-span-2 lg:col-span-1 gap-4 md:gap-8">
					<HistoryTable />
					<TopStoryTable />
				</div>
			</div>
		</div>
	);
};

export default HomePage;
