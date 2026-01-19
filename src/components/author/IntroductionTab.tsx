import { Text, Stack, Divider, Title, Grid, ScrollArea } from '@mantine/core';
import { authorProfileMock } from './authorProfile';
import { PinnedMessage } from '../common/PinnedMessage';
import StoryItemCard from '../story/StoryItemCard';

export function IntroductionTab() {
  const { bio, pinnedMessage, stories } = authorProfileMock;

  return (
    <Grid gutter="xl" className="max-w-7xl mx-auto px-4" align="start">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="xl" className="sticky top-4"> 
          <Text size="sm" lh={1.8} className="text-gray-700 whitespace-pre-line">
            {bio}
          </Text>
          <Divider />

          {pinnedMessage && <PinnedMessage date={pinnedMessage.date} content={pinnedMessage.content} />}
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 8 }}>
        <Stack gap="xl">
          <Title order={3}>Truyện của {authorProfileMock.displayName}</Title>

          <ScrollArea h={{ base: 'auto', md: 'none' }} type="auto">
            <Stack gap="md">
              {stories.map((story) => (
                <StoryItemCard key={story.id} story={story} type="author" />
              ))}
            </Stack>
          </ScrollArea>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}