import { SimpleGrid, Stack, Title } from "@mantine/core";
import { UserFollowCard } from "../user/UserFollowCard";
import { authorProfileMock } from "./authorProfile";

export function FollowingTab() {
	return (
		<Stack gap="xl" className="max-w-6xl mx-auto px-4">
			<Title order={3}>Đang theo dõi</Title>
			<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg">
				{authorProfileMock.following.map((user) => (
					<UserFollowCard key={user.id} {...user} />
				))}
			</SimpleGrid>
		</Stack>
	);
}
