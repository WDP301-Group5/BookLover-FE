import { SimpleGrid, Stack, Title } from "@mantine/core";
import React from "react";
import { authorProfileMock } from "../../author/authorProfile";
import { UserFollowCard } from "../UserFollowCard";

const AuthorFollow = () => {
  return (
    <Stack gap="xl" className="max-w-6xl mx-auto px-4">
      <Title order={3} className="text-[#228be6]">Đang theo dõi</Title>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {authorProfileMock.following.map((user) => (
          <UserFollowCard key={user.id} {...user} />
        ))}
      </SimpleGrid>
    </Stack>
  );
};

export default AuthorFollow;
