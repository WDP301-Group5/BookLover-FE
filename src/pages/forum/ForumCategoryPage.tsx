import { Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useAllForums } from "../../hooks/useForum";
import type { IForum } from "../../interfaces/Forum";
import { MessagesSquare } from "lucide-react";

const ForumCategoriesPage = () => {
  const navigate = useNavigate();

  const { data: forums } = useAllForums();

  return (
    <Container size="md" mt={12}>
      <Title mb="lg">Diễn đàn</Title>
      <Stack>
        {forums?.map((forum: IForum) => (
          <Card
            key={forum.id}
            shadow="sm"
            padding="lg"
            withBorder
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/community/forums/${forum.slug}`)}
          >
            <Group justify="space-between">
              <div>
                <Text fw={600}>👉 {forum.name}</Text>
                <Text size="sm" c="dimmed">
                  {forum.description}
                </Text>
              </div>

              <Group gap={4} >
                <Text size="sm">{forum?.categoryCount || 0}</Text>
                <MessagesSquare size={18} />
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
    </Container>
  );
}

export default ForumCategoriesPage;