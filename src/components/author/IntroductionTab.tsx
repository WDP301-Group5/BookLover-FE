import { Divider, Grid, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import AuthorStoryCard from "../story/AuthorStoryCard";

interface Story {
  _id: string;
  title: string;
  slug: string;
  image: string;
  description: string;
  views: number;
  stars: number;
  rates: number;
  followers: number;
  isPremium: boolean;
  isFinish: boolean;
}

interface AuthorProfile {
  fullName: string;
  bio?: string;
  stories: Story[];
}

export function IntroductionTab() {
  const { authorId } = useParams();
  const [author, setAuthor] = useState<AuthorProfile | null>(null);

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthor = async () => {
      try {
        const data = await UserService.getPublicProfile(authorId);
        setAuthor(data);
      } catch (error) {
        console.error("Error loading author:", error);
      }
    };

    fetchAuthor();
  }, [authorId]);

  if (!author) return null;

  return (
    <Grid gutter="xl" className="max-w-7xl mx-auto px-4" align="start">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="xl" className="sticky top-4">
          <Text
            size="sm"
            lh={1.8}
            className="text-gray-700 whitespace-pre-line"
          >
            {author.bio}
          </Text>
          <Divider />
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="xl">
          <Title order={3}>Truyện của {author.fullName}</Title>

          <ScrollArea h={{ base: "auto", md: "none" }} type="auto">
            <Stack gap="md">
              {author.stories?.map((story) => (
                <AuthorStoryCard key={story._id} story={story} />
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
