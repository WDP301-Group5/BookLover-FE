import {
  Avatar,
  Box,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  ActionIcon,
  Center,
  Title,
  Button,
} from "@mantine/core";
import { IconSend, IconSearch } from "@tabler/icons-react";
import { useEffect, useRef, useState, useMemo } from "react";
import socket from "../../lib/socket";
import { JOIN_ROOM_KEY, RECEIVE_MESSAGE_KEY, SEND_MESSAGE_KEY } from "../../constants/socket";
import { DateFormat, DateHourFormat, rangeTime } from "../../utils";
import { useChatingContent, useListChatingUser, useSearchUser } from "../../hooks/useChating";
import { useUserStore } from "../../stores/useUserStore";
import { CirclePlus } from "lucide-react";
import ChatingService from "../../services/ChatingService";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface Message {
  id: string;
  tempId?: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: Date;
}

interface SearchUser {
  _id: string;
  id: string;
  username: string;
  avatarURL: string;
  fullName: string;
  penName: string;
}

interface UserConversation {
  _id: string;
  fullName: string;
  username: string;
  avatarURL: string;
  online: string;
}

interface Conversation {
  id: string;
  member: UserConversation;
  lastMessage: {
    _id: string;
    senderId: string;
    content: string;
    createdAt: Date;
    updatedAt: Date
  };
}

const ChatingPage = () => {

  const { user } = useUserStore();
  const userId = user && user?.id;

  const navigate = useNavigate();

  if (!userId) {
    return (
      <Center h="70vh">
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack align="center" gap="sm">
            <Title order={3}>Bạn chưa đăng nhập</Title>

            <Text c="dimmed" size="sm" ta="center">
              Bạn cần đăng nhập để sử dụng tính năng trò chuyện.
            </Text>

            <Button
              mt="sm"
              onClick={() => navigate("/login")}
            >
              Đi đến trang đăng nhập
            </Button>
          </Stack>
        </Paper>
      </Center>
    );
  }
  const prevScrollHeightRef = useRef(0);
  const [lastMessageTime, setLastMessageTime] = useState<string>(() => new Date().getTime().toString());

  const [searchUser, setSearchUser] = useState<string>("");
  const [searchConversation, setSearchConversation] = useState<string>("");

  const [isSearchNewUser, setIsSearchNewUser] = useState<boolean>(false);

  const { data: listChatingUsers } = useListChatingUser();

  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState<Conversation | null>(listChatingUsers?.[0] || null);
  const conversationId = selectedUser ? selectedUser?.id : "";

  useEffect(() => {
    if (listChatingUsers?.length) {
      setSelectedUser(listChatingUsers[0]);
    }
  }, [listChatingUsers]);

  useEffect(() => {
    if (conversationId) {
      socket.emit(JOIN_ROOM_KEY, conversationId);
    }
  }, [conversationId]);

  const { data: messageWithUser } = useChatingContent(conversationId, lastMessageTime);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    if (messageWithUser?.length) {
      setMessages((prev) => {
        if (prev.length === 0) return messageWithUser;
        if (prev[0].conversationId !== messageWithUser[0].conversationId) return messageWithUser;
        return [...messageWithUser, ...prev];
      });
    }
    if (messageWithUser?.length === 0) {
      setMessages((prev) => {
        if (prev.length === 0) return [];
        if (prev[0].conversationId !== conversationId) return [];
        return [...prev];
      });
    }
  }, [conversationId, messageWithUser]);

  const [input, setInput] = useState("");

  const viewportRef = useRef<HTMLDivElement>(null);

  const updateListUser = (converId: string) => {
    const index = listChatingUsers?.findIndex((item: Conversation) => item.id === converId) || 0;
    const temp = listChatingUsers?.[index];
    listChatingUsers?.splice(index, 1);
    listChatingUsers?.unshift(temp!);
  };

  useEffect(() => {
    socket.on(RECEIVE_MESSAGE_KEY, (newMsg: Message) => {
      if (newMsg.conversationId !== conversationId) {
        // lưu vào cache conversation đó
        queryClient.setQueriesData(
          { queryKey: ["chatingContent", newMsg.conversationId] },
          (old: Message[] = []) => {
            return [...old, newMsg];
          }
        );

        return;
      };
      if (newMsg.senderId === userId) {
        let isAdded = false;

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === newMsg.tempId) {
              isAdded = true;
              return {
                ...msg,
                id: newMsg.id,
                createdAt: newMsg.createdAt || new Date(),
              };
            }
            return msg;
          })
        );

        if (!isAdded) {
          setMessages((prev) => [
            ...prev,
            {
              id: newMsg.id,
              conversationId: newMsg.conversationId,
              senderId: newMsg.senderId,
              content: newMsg.content,
              createdAt: newMsg.createdAt,
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: newMsg.id || new Date().getTime().toString(),
            conversationId: newMsg.conversationId,
            senderId: newMsg.senderId,
            content: newMsg.content,
            createdAt: newMsg.createdAt,
          },
        ]);
      }
    });

    return () => {
      socket.off(RECEIVE_MESSAGE_KEY);
    };
  }, [conversationId]);

  useEffect(() => {
    if (!viewportRef.current) return;

    // nếu đang load more thì không scroll
    if (prevScrollHeightRef.current > 0) return;

    viewportRef.current.scrollTo({
      top: viewportRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const loadMoreMessages = () => {
    if (!messages.length || !viewportRef.current) return;

    const viewport = viewportRef.current;

    // Lưu chiều cao trước khi load
    prevScrollHeightRef.current = viewport.scrollHeight;

    const oldest = messages[0];

    setLastMessageTime(
      new Date(oldest.createdAt).getTime().toString()
    );
  };

  useEffect(() => {
    if (!viewportRef.current) return;

    const viewport = viewportRef.current;

    if (prevScrollHeightRef.current > 0) {
      const newHeight = viewport.scrollHeight;

      // giữ nguyên vị trí scroll
      viewport.scrollTop += newHeight - prevScrollHeightRef.current;

      prevScrollHeightRef.current = 0;
    }
  }, [messages]);

  const sendMessage = () => {
    if (input?.trim()) {
      const now = new Date()
      const nowTime = now.getTime().toString();

      socket.emit(SEND_MESSAGE_KEY, {
        conversationId,
        tempId: nowTime,
        content: input,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: nowTime,
          conversationId,
          senderId: userId,
          content: input,
          createdAt: now,
        },
      ]);

      updateListUser(conversationId);

      setInput("");
    }
  };

  const { data: listUserData } = useSearchUser(searchUser);

  const listUsers = listUserData && listUserData?.filter((user: SearchUser) => user.id !== userId)
    .map((user: SearchUser) => { return { ...user, id: user._id } });

  const changeChatingUser = (conversation: Conversation) => {
    setSelectedUser(conversation);
    setIsSearchNewUser(false);
    setSearchUser("");
    setLastMessageTime(new Date().getTime().toString());
  };

  const handleSelectUser = async (user: SearchUser) => {
    if (!user?._id || user._id === userId) return;

    const newConversation = await ChatingService.checkAndCreateConversation(user.id);

    setIsSearchNewUser(false);
    setSearchUser("");
    setSelectedUser(newConversation);
  };

  /** ========================
   * SEARCH CONVERSATION
   ========================= */

  const filteredConversations = useMemo(() => {
    if (!searchConversation.trim()) return listChatingUsers || [];

    const keyword = searchConversation?.toLowerCase();

    return listChatingUsers?.filter((c: Conversation) =>
      c.member.fullName?.toLowerCase().includes(keyword) ||
      c.member.username?.toLowerCase().includes(keyword)
    );
  }, [searchConversation, listChatingUsers]);

  return (
    <Paper
      mt={20}
      withBorder
      radius="md"
      style={{
        display: "flex",
        height: "80vh",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR */}
      <Box
        w={300}
        p="sm"
        style={{
          borderRight: "1px solid #eee",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Group justify="space-between" mb="sm">
          <Text fw={700} size="lg">
            {isSearchNewUser ? "Tìm người dùng" : "Trò chuyện"}
          </Text>

          <CirclePlus
            size={24}
            className="hover:cursor-pointer"
            style={{
              transform: isSearchNewUser ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.25s ease",
            }}
            onClick={() => setIsSearchNewUser(!isSearchNewUser)}
          />
        </Group>

        {!isSearchNewUser &&
          <TextInput
            placeholder="Tìm cuộc trò chuyện..."
            leftSection={<IconSearch size={16} />}
            mb="sm"
            value={searchConversation}
            onChange={(e) => setSearchConversation(e.currentTarget.value)}
          />
        }

        {isSearchNewUser &&
          <Group w={"100%"} pos={"relative"} >
            <TextInput
              placeholder="Tìm người dùng..."
              leftSection={<IconSearch size={16} />}
              value={searchUser}
              w={"100%"}
              onChange={(e) => setSearchUser(e.currentTarget.value)}
            />

            {listUsers && listUsers?.length > 0 && (
              <Paper
                shadow="sm"
                withBorder
                style={{
                  position: "absolute",
                  width: "100%",
                  top: 36,
                  marginTop: 4,
                  zIndex: 10
                }}
              >
                <Stack gap={0} className="max-h-[60vh] overflow-y-auto">
                  {listUsers?.map((chatingUser: SearchUser) => (
                    <Group
                      key={chatingUser.id}
                      p="xs"
                      gap="sm"
                      className="hover:bg-gray-200 hover:text-blue-500"
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSelectUser(chatingUser)}
                      align="flex"
                    >
                      {/* Avatar */}
                      <Avatar
                        src={chatingUser.avatarURL || "/images/default-avatar.png"}
                        radius="xl"
                        size="md"
                      />

                      {/* Info */}
                      <Stack gap={2} className="max-w-[80%] overflow-hidden">
                        <Text fw={500} size="sm">
                          {chatingUser.fullName}
                        </Text>

                        <Text size="xs" c="dimmed">
                          @{chatingUser.username || "--"} - {chatingUser.penName}
                        </Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </Paper>
            )}
          </Group>
        }

        <ScrollArea style={{ flex: 1 }}>
          <Stack gap="xs">

            {!isSearchNewUser ? (

              filteredConversations?.length > 0 ?

                filteredConversations.map((c: Conversation) => (

                  <Group
                    key={c.id}
                    p="xs"
                    style={{
                      cursor: "pointer",
                      borderRadius: 8,
                      background:
                        selectedUser?.member._id === c.member._id ? "#f1f3f5" : "transparent",
                    }}
                    onClick={() => changeChatingUser(c)}
                  >

                    <Avatar src={c.member.avatarURL || "/images/default-avatar.png"} radius="xl" />

                    <Box style={{ flex: 1 }}>
                      <Group justify="space-between">

                        <Text size="sm" fw={500}>
                          {c.member.fullName}
                        </Text>

                        {(c.member.online === "online") ? (
                          <>
                            <span className="inline-flex items-center gap-1 text-green-600">
                              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1 text-gray-600">
                              <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                            </span>
                          </>
                        )}

                      </Group>

                      <Text size="xs" c="dimmed" lineClamp={1}>
                        @{c.member.username || "-----"}
                      </Text>

                    </Box>

                  </Group>

                ))

                :

                <Text size="sm" c="dimmed">
                  Không tìm thấy cuộc trò chuyện.
                </Text>

            ) : (

              <Text size="sm" mt={12} c="dimmed">
                Tìm kiếm người dùng
              </Text>

            )}

          </Stack>
        </ScrollArea>
      </Box>

      {/* CHAT AREA */}
      <Box
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >

        {selectedUser && selectedUser?.member ? (

          <>
            {/* HEADER */}

            <Group
              p="sm"
              style={{ borderBottom: "1px solid #eee" }}
            >

              <Avatar src={selectedUser?.member?.avatarURL || "/images/default-avatar.png"} radius="xl" />

              <Box>

                <Text fw={600}>
                  {selectedUser?.member?.username}
                </Text>

                <Text size="xs" c="dimmed">
                  {(selectedUser?.member?.online === "online") ? (
                    <>
                      <span className="inline-flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                      </span>
                    </>
                  ) : rangeTime(Number(selectedUser?.member?.online))}
                </Text>

              </Box>

            </Group>

            {/* MESSAGE LIST */}

            <ScrollArea
              style={{ flex: 1 }}
              p="md"
              viewportRef={viewportRef}
              onScrollPositionChange={({ y }) => {
                if (y === 0) {
                  loadMoreMessages();
                }
              }}
            >

              <Stack gap="sm">

                {messages?.length > 0 && messages?.map((msg, index) => (
                  <>
                    {index > 0 && new Date(messages[index - 1]?.createdAt).getDate() !== new Date(msg.createdAt).getDate() && (
                      <Divider my="xs" label={DateFormat(msg.createdAt) || ""} labelPosition="center" />
                    )}
                    <Group
                      key={msg.id}
                      justify={msg.senderId === userId ? "flex-end" : "flex-start"}
                    >

                      {msg.senderId !== userId && (
                        <Avatar src={selectedUser?.member?.avatarURL || "/images/default-avatar.png"} size="sm" />
                      )}

                      <Box
                        p="sm"
                        style={{
                          maxWidth: 300,
                          borderRadius: 12,
                          background:
                            msg.senderId === userId ? "#228be6" : "#f1f3f5",
                          color: msg.senderId === userId ? "white" : "black",
                        }}
                      >

                        <Text size="sm">
                          {msg.content}
                        </Text>

                        <Text size="xs" opacity={0.7} mt={4}>
                          {DateHourFormat(msg.createdAt)}
                        </Text>

                      </Box>

                    </Group>
                  </>
                ))}

              </Stack>

            </ScrollArea>

            <Divider />

            {/* INPUT */}

            <Group p="sm">

              <TextInput
                placeholder="Nhắn tin cho tác giả..."
                style={{ flex: 1 }}
                value={input}
                autoFocus
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
              />

              <ActionIcon size="lg" color="blue" onClick={sendMessage}>
                <IconSend size={18} />
              </ActionIcon>

            </Group>

          </>

        ) : (

          <Text size="sm">
            Hãy bắt đầu cuộc trò chuyện với những người bạn.
          </Text>

        )}

      </Box>

    </Paper>
  );
};

export default ChatingPage;