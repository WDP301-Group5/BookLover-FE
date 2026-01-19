// import styles from "./HomePage.module.scss";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import type { Story } from '../../interfaces/Story';
import StoryCard from '../../components/story/StoryCard';
import HistoryTable from '../../components/HistoryTable';
import { Carousel } from '@mantine/carousel';
import { Paper, Text } from '@mantine/core';
import TopStoryTable from '../../components/TopStoryTable';


const HomePage = () => {
    const story: Story =
    {
        id: "1",
        title: "Hành Trình Tu Tiên Bắt Đầu Hành Trình Tu Tiên Bắt Đầu",
        slug: "hanh-trinh-tu-tien-bat-dau",
        description:
            "Một thiếu niên bình thường vô tình bước vào con đường tu tiên đầy hiểm nguy. Một thiếu niên bình thường vô tình bước vào con đường tu tiên đầy hiểm nguy. Một thiếu niên bình thường vô tình bước vào con đường tu tiên đầy hiểm nguy.",
        image: "https://tuanluupiano.com/wp-content/uploads/2026/01/hinh-anh-anime-nu-dep-nhat-11.jpg",
        author: {
            id: "a1",
            name: "Mộng Thiên",
            penName: "Thiên Mộng",
        },
        topics: ["Tiên Hiệp", "Huyền Huyễn"],
        tags: [
            "tu tiên",
            "trưởng thành",
            "phiêu lưu",
        ],
        status: "ongoing",
        isFinish: true,
        isPremium: true,
        views: 125430,
        stars: 4.6,
        followers: 8420,
        rates: 512,
        chapters: 100,
        createdAt: "2025-12-01T10:15:30Z",
        updatedAt: "2026-01-10T08:20:00Z",
    };
    const stories: Story[] = Array(10).fill(story);
    return (
        <div className='w-full p-4 bg-custom-bg'>
            <Paper shadow="xs" p="sm">
                <Carousel
                    slideSize={{ base: '60%', sm: '20%', md: '18.33%' }}
                    slideGap={{ base: 0, sm: 'md' }}
                    loop
                    align='start'
                >
                    {stories.map((story) => (
                        <Carousel.Slide>
                        <StoryCard
                            key={story.id}
                            story={story}
                            type="home"
                        />
                    </Carousel.Slide>
                ))}
                </Carousel>
            </Paper>
            <Paper shadow="xs" p="sm" my={24}>
                <Text size="lg" fw={600}>Đây là thẻ giới thiệu trang web</Text>
                <Text lineClamp={4}>
                    Content test: Use it to create cards, dropdowns, modals and other components that require background
                    with shadow
                </Text>
            </Paper>
            <div className='grid col-span-2 gap-8 lg:grid-cols-3 '>
                <div className='col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                    {
                        stories.map((story) => (
                            <StoryCard
                                key={story.id}
                                story={story}
                                type="home"
                            />
                        ))
                    }
                </div>
                <div className='flex flex-col gap-4 md:gap-8'>
                    <HistoryTable />
                    <TopStoryTable />
                </div>
            </div>
        </div>
    );
};

export default HomePage;