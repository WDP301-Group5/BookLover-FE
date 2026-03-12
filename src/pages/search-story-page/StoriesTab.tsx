import { Stack, Group, Loader, Text, Button, Divider, Anchor, Title } from "@mantine/core";
import { useState, useEffect } from "react";
import StoryCard from "../../components/story/StoryCard";
import { useStories } from "../../hooks/useStory";
import { useGenres } from "../../hooks/useGenre";
import { useTopics } from "../../hooks/useTopics";
import type { Story } from "../../interfaces/Story";
import type { Genre } from "../../interfaces/genre";

const ITEMS_PER_PAGE = 10;
const statuses = ["Tất cả", "Hoàn thành", "Đang tiến hành"];
const sortOptions = ["Ngày cập nhật", "Truyện mới", "Top tháng", "Top tuần", "Top ngày", "Top theo dõi", "Bình luận", "Số chapter"];

interface Props {
  searchTerm: string;
}

const StoriesTab = ({ searchTerm }: Props) => {
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Ngày cập nhật");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: categoriesData, isLoading: loadingGenres } = useGenres();
  const categories: Genre[] = categoriesData || [];

  const { data: topicsData, isLoading: loadingTopics } = useTopics();
  const topics = topicsData || [];

  const { data: storyData, isLoading: loadingStories } = useStories({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    status: statusFilter,
    category: categoryFilter,
    search: searchTerm,
    sortBy,
  });

  const stories: Story[] = storyData?.story || [];
  const totalStories = storyData?.total || 0;
  const totalPages = Math.ceil(totalStories / ITEMS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, categoryFilter, sortBy, searchTerm]);

  return (
    <Group align="flex-start" wrap="nowrap">
      {/* Main story list */}
      <Stack w="70%">
        {/* Trạng thái */}
        <Stack mb="sm">
          <Text fw={500}>Trạng thái:</Text>
          <Group gap={8}>
            {statuses.map((s) => (
              <Button
                key={s}
                size="xs"
                variant={statusFilter === s ? "filled" : "outline"}
                radius="sm"
                style={{ minWidth: 100 }}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </Group>
        </Stack>

        {/* Sắp xếp theo */}
        <Stack mb="sm">
          <Text fw={500}>Sắp xếp theo:</Text>
          <Group gap={8} wrap="wrap">
            {sortOptions.map((opt) => (
              <Button
                key={opt}
                size="xs"
                variant={sortBy === opt ? "filled" : "outline"}
                radius="sm"
                onClick={() => setSortBy(opt)}
              >
                {opt}
              </Button>
            ))}
          </Group>
        </Stack>

        <Divider />

        {/* Story cards */}
        {loadingStories ? (
          <Group justify="center"><Loader /></Group>
        ) : stories.length ? (
          <Group wrap="wrap" gap={16}>
            {stories.map((story, idx) => (
              <StoryCard key={story._id || `${story._id}-${idx}`} story={story} type="search" />
            ))}
          </Group>
        ) : (
          <Text>Không tìm thấy truyện nào</Text>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Group justify="center" gap={8} mt={12}>
            <Button size="xs" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>« Trước</Button>
            {[...Array(totalPages)].map((_, idx) => (
              <Button
                key={idx + 1}
                size="xs"
                variant={currentPage === idx + 1 ? "filled" : "outline"}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </Button>
            ))}
            <Button size="xs" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Sau »</Button>
          </Group>
        )}
      </Stack>

      {/* Sidebar y hệt cũ */}
      <Stack w="18%" ml="auto">
        <Title order={5}>Thể loại / Chủ đề</Title>
        <Divider />

        <Anchor
          href="#"
          c={!selectedGenre && !selectedTopic ? "blue" : undefined}
          fw={!selectedGenre && !selectedTopic ? 600 : 400}
          onClick={(e) => {
            e.preventDefault();
            setSelectedGenre(null);
            setSelectedTopic(null);
            setCategoryFilter("");
          }}
        >
          Tất cả
        </Anchor>
        <Divider />

        {loadingGenres || loadingTopics ? (
          <Loader size="sm" />
        ) : (
          <>
            <Text fw={500}>Genres</Text>
            <Stack gap={2}>
              {categories.map((g) => (
                <Anchor
                  key={g._id}
                  href="#"
                  c={selectedGenre === g._id ? "blue" : "dimmed"}
                  fw={selectedGenre === g._id ? 600 : 400}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedGenre(g._id);
                    setSelectedTopic(null);
                    setCategoryFilter(g._id);
                  }}
                >
                  {g.name}
                </Anchor>
              ))}
            </Stack>

            <Divider />

            <Text fw={500}>Topics</Text>
            <Stack gap={2}>
              {topics?.map((t: { _id: string; name: string }) => (
                <Anchor
                  key={t._id}
                  href="#"
                  c={selectedTopic === t._id ? "blue" : "dimmed"}
                  fw={selectedTopic === t._id ? 600 : 400}
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedTopic(t._id);
                    setSelectedGenre(null);
                    setCategoryFilter(t._id);
                  }}
                >
                  {t.name}
                </Anchor>
              ))}
            </Stack>
          </>
        )}
      </Stack>
    </Group>
  );
};

export default StoriesTab;