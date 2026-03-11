import { Divider, Grid, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthorStoryCard from "../story/AuthorStoryCard";
import type { AuthorPublicProfile } from "../../services/UserService";
import UserService from "../../services/UserService";

export function IntroductionTab() {
  const { authorId } = useParams<{ authorId: string }>();
  const [author, setAuthor] = useState<AuthorPublicProfile | null>(null);

  useEffect(() => {
    if (!authorId) return;

    const fetchAuthor = async () => {
      try {
        const res = await UserService.getPublicProfile(authorId);

        const mergedAuthor: AuthorPublicProfile = {
          ...res.profile,
          stories: (res.stories ?? []).map((story) => ({
            ...story,
            chapterNumber: story.chapterNumber ?? 0,
          })),
          relationship: res.relationship,
          totalViews: res.profile.totalViews,
          totalVotes: res.profile.totalVotes,
        };

        setAuthor(mergedAuthor);
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
            {author.bio || "Chưa có thông tin giới thiệu."}
          </Text>
          <Divider />
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="xl">
          <Title order={3}>
            Truyện của {author.penName || author.fullName}
          </Title>

          <ScrollArea h={{ base: "auto", md: "none" }} type="auto">
            <Stack gap="md">
              {author.stories?.length ? (
                author.stories.map((story) => (
                  <AuthorStoryCard key={story._id} story={story} />
                ))
              ) : (
                <Text>Chưa có truyện nào.</Text>
              )}
            </Stack>
          </ScrollArea>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}