import { Stack, Title } from '@mantine/core';
import { authorProfileMock } from './authorProfile';
import { ConversationItem } from '../common/ConversationItem';

export function ConversationTab() {
  return (
    <Stack gap="xl" className="max-w-4xl mx-auto px-4">
      <Title order={3}>Hội thoại</Title>
      {authorProfileMock.conversations.map((conv) => (
        <ConversationItem key={conv.id} {...conv} />
      ))}
    </Stack>
  );
}