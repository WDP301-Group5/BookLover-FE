import { Container, Tabs, Title, Text } from "@mantine/core";
import { IconBook, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StoriesTab from "./StoriesTab";
import ProfilesTab from "./ProfilesTab";

const SearchStoryPage = () => {
  const [activeTab, setActiveTab] = useState<string | null>("stories");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const keyword = searchParams.get("q") || "";
    setSearchTerm(keyword);
  }, [searchParams]);

  return (
    <Container size="lg" py="md">
      {!searchTerm && (
        <Text c="dimmed" mb="md">
          Hãy nhập từ khóa ở thanh tìm kiếm để tìm truyện hoặc hồ sơ.
        </Text>
      )}

      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="default"
        color="blue"
        radius="md"
      >
        <Tabs.List
          justify="left"
          grow={false}
          mb="lg"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Tabs.Tab
            value="stories"
            leftSection={<IconBook size={20} stroke={2.5} />}
            pt={8}
            pb={8}
          >
            <Title order={4} fw={600} size="h4">
              Truyện
            </Title>
          </Tabs.Tab>

          <Tabs.Tab
            value="profiles"
            leftSection={<IconUser size={20} stroke={2.5} />}
            pt={8}
            pb={8}
          >
            <Title order={4} fw={600} size="h4">
              Hồ sơ
            </Title>
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="stories" pt="md">
          <StoriesTab searchTerm={searchTerm} />
        </Tabs.Panel>

        <Tabs.Panel value="profiles" pt="md">
          <ProfilesTab searchTerm={searchTerm} />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default SearchStoryPage;