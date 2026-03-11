import { Loader, Modal, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FollowUserRow } from "./FollowUserRow";
import UserService, { type AuthorPublicProfile } from "../../../services/UserService";

interface FollowListModalProps {
  opened: boolean;
  onClose: () => void;
  type: "followers" | "following";
  userId: string;
  title?: string;
}

export function FollowListModal({
  opened,
  onClose,
  type,
  userId,
  title,
}: FollowListModalProps) {
  const [users, setUsers] = useState<AuthorPublicProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!opened || !userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data =
          type === "followers"
            ? await UserService.getFollowers(userId, 1)
            : await UserService.getFollowing(userId, 1);

        setUsers(data);
      } catch (err) {
        console.error(err);
        setError("Không thể tải danh sách.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [opened, userId, type]);

  const handleToggleFollow = async (targetUserId: string) => {
    try {
      const res = await UserService.toggleFollow(targetUserId);

      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetUserId
            ? {
                ...u,
                relationship: {
                  amIFollowing: res.relationship.amIFollowing,
                  followsMe: u.relationship?.followsMe ?? false,
                  isMutual:
                    res.relationship.amIFollowing &&
                    (u.relationship?.followsMe ?? false),
                },
              }
            : u
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoProfile = (targetUserId: string) => {
    onClose();
    navigate(`/author-profile/${targetUserId}`);
  };

  const modalTitle =
    title || (type === "followers" ? "Người theo dõi" : "Đang theo dõi");

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      radius="lg"
      withCloseButton
      title={
        <Title order={2} ta="center" w="100%">
          {users.length} {modalTitle}
        </Title>
      }
      styles={{
        header: {
          width: "100%",
        },
        title: {
          width: "100%",
        },
        body: {
          paddingTop: 8,
        },
      }}
    >
      {loading ? (
        <Loader size="lg" />
      ) : error ? (
        <Text c="red">{error}</Text>
      ) : users.length === 0 ? (
        <Text c="dimmed">
          {type === "followers"
            ? "Chưa có người theo dõi."
            : "Chưa theo dõi ai."}
        </Text>
      ) : (
        <ScrollArea.Autosize mah={520} offsetScrollbars>
          <Stack gap="md">
            {users.map((user) => (
              <FollowUserRow
                key={user._id}
                displayName={user.penName || user.fullName}
                username={user.username}
                avatarUrl={user.avatarURL}
                storiesCount={user.storiesCount || 0}
                followersCount={user.followersCount || 0}
                isFollowing={!!user.relationship?.amIFollowing}
                onFollowToggle={() => handleToggleFollow(user._id)}
                onClickProfile={() => handleGoProfile(user._id)}
              />
            ))}
          </Stack>
        </ScrollArea.Autosize>
      )}
    </Modal>
  );
}