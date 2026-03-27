import {
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { Bell, Book, BookCheck, ChartNoAxesCombined, Lock, Pencil, Save, User, UserRoundPlus, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

import AvatarUploader from "./AvatarUploader";
import style from "./style.module.scss";

import UserService from "../../services/UserService";
import { useUserStore } from "../../stores/useUserStore";
import { showError, showSuccess } from "../../utils/notifications";
import ChangePassword from "./user-navbar/ChangePassword";
import ListStoryFollowed from "./user-navbar/ListStoryFollowed";
import MyStory from "./user-navbar/MyStory";
import { useNavigate, useSearchParams } from "react-router-dom";
import Followers from "./user-navbar/Followers";
import { FollowingTab } from "../author/FollowingTab";
import RevenueTab from "./user-navbar/RevenueTab";

const SIDEBAR_MENU = [
  { key: "info", label: "Thông tin cá nhân", icon: <User size={18} /> },
  { key: "my-stories", label: "Truyện của tôi", icon: <Book size={18} /> },
  {
    key: "following-stories",
    label: "Truyện đang theo dõi",
    icon: <BookCheck size={18} />,
  },
  {
    key: "followers",
    label: "Người theo dõi",
    icon: <Users size={18} />,
  },
  {
    key: "following",
    label: "Đang theo dõi",
    icon: <UserRoundPlus size={18} />,
  },
  { key: "change-password", label: "Đổi mật khẩu", icon: <Lock size={18} /> },
  { key: "revenue", label: "Thống kê doanh thu", icon: <ChartNoAxesCombined size={18} /> },
];

export default function UserInfoForm() {
  const { user, updateUser } = useUserStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    nickName: "",
    penName: "",
    bio: "",
  });

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UserService.getProfile();
        updateUser(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

  fetchProfile();
}, [updateUser]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        username: user.username || "",
        nickName: user.nickName || "",
        penName: user.penName || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updatedData = await UserService.updateProfile(form);

      updateUser(updatedData);

      showSuccess("Cập nhật thông tin thành công");

      setEditMode(false);
    } catch (error: { message?: string } | unknown) {
      const errorMessage =
        (error instanceof Error ? error.message : undefined) ||
        "Không thể cập nhật thông tin.";

      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Text>Vui lòng đăng nhập.</Text>;
  }

  const handleChangeActiveTab = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const TAB_CONTENT: Record<string, React.ReactNode> = {
    "my-stories": <MyStory />,
    "following-stories": <ListStoryFollowed />,
    "following": <FollowingTab authorId={user.id} layout="compact" showTitle />,
    "followers": <Followers authorId={user.id} layout="compact" showTitle />,
    "change-password": <ChangePassword />,
    "revenue": <RevenueTab />,
  };

  return (
    <Paper className={style.container}>
      {/* LEFT SIDEBAR */}
      <Box className={style.left}>
        <AvatarUploader />
        <SidebarNav activeTab={activeTab} onChangeTab={handleChangeActiveTab} />
      </Box>

      <Divider orientation="vertical" />

      {/* RIGHT CONTENT */}
      <Box className={style.right}>
        {activeTab === "info" ? (
          <>
            {!editMode && (
              <Group position="apart" mb="md">
                <Button
                  variant="subtle"
                  color="blue"
                  leftSection={<Pencil size={18} />}
                  className={style.editBtn}
                  onClick={() => setEditMode(true)}
                >
                  Chỉnh sửa
                </Button>

                {/* Nút điều hướng sang trang author-profile */}
                {(user.role === "author" || user.role === "user") && (
                  <Button
                    variant="outline"
                    color="green"
                    onClick={() => navigate(`/author-profile/${user.id}`)}
                  >
                    Xem trang tác giả
                  </Button>
                )}
              </Group>
            )}

            <Title order={3} className={style.sectionTitle}>
              Thông tin tài khoản
            </Title>

            {!editMode ? (
              <>
                {/* ACCOUNT */}
                <Title order={4} mt="md" mb="sm">
                  Tài khoản
                </Title>
                <SimpleGrid cols={2} spacing="md">
                  <DisplayItem label="Username" value={user.username} />
                  <DisplayItem label="Email" value={user.email} />
                </SimpleGrid>

                <Divider my="md" />

                {/* PERSONAL */}
                <Title order={4} mb="sm">
                  Cá nhân
                </Title>
                <SimpleGrid cols={3} spacing="md">
                  <DisplayItem label="Họ và tên" value={user.fullName} />
                  <DisplayItem label="Biệt danh" value={user.nickName || "-"} />
                  {user.role === "author" && (
                    <DisplayItem label="Bút danh" value={user.penName || "-"} />
                  )}
                </SimpleGrid>
                <DisplayItem label="Giới thiệu" value={user.bio || "-"} />

                <Divider my="md" />

                {/* VIP */}
                <Title order={4} mb="sm">
                  VIP
                </Title>
                <SimpleGrid cols={2} spacing="md">
                  <DisplayItem label="Cấp độ VIP" value={String(user.vipLevel)} />
                  <DisplayItem
                    label="Linh thạch"
                    value={user.spiritStones != null ? String(user.spiritStones) : "-"}
                  />
                </SimpleGrid>

                <Divider my="md" />

                {/* STATISTICS */}
                <Title order={4} mb="sm">
                  Thống kê
                </Title>
                <SimpleGrid cols={2} spacing="md">
                  <DisplayItem
                    label="Người theo dõi"
                    value={user.followersCount != null ? String(user.followersCount) : "-"}
                  />
                  <DisplayItem
                    label="Đang theo dõi"
                    value={
                      user.followingCount != null
                        ? String(user.followingCount)
                        : "-"
                    }
                  />
                  <DisplayItem
                    label="Truyện đang theo dõi"
                    value={
                      user.followingStoriesCount != null
                        ? String(user.followingStoriesCount)
                        : "-"
                    }
                  />
                  <DisplayItem
                    label="Truyện của bạn"
                    value={user.storiesCount != null ? String(user.storiesCount) : "-"}
                  />
                </SimpleGrid>
              </>
            ) : (
              // EDIT MODE
              <>
                <SimpleGrid cols={2} spacing="md">
                  <TextInput
                    label="Họ và tên"
                    value={form.fullName}
                    onChange={(e) =>
                      handleChange("fullName", e.currentTarget.value)
                    }
                  />
                  <TextInput
                    label="Username"
                    value={form.username}
                    onChange={(e) =>
                      handleChange("username", e.currentTarget.value.toLowerCase().replace(/\s/g, ""))
                    }
                  />
                  <TextInput
                    label="Biệt danh"
                    value={form.nickName}
                    onChange={(e) =>
                      handleChange("nickName", e.currentTarget.value)
                    }
                  />
                  {user.role === "author" && (
                    <TextInput
                      label="Bút danh"
                      value={form.penName}
                      onChange={(e) =>
                        handleChange("penName", e.currentTarget.value)
                      }
                    />
                  )}
                </SimpleGrid>

                <Textarea
                  label="Giới thiệu"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.currentTarget.value)}
                  minRows={3}
                  mt="md"
                />

                <Group mt="lg">
                  <Button
                    leftSection={<Save size={18} />}
                    color="blue"
                    onClick={handleSave}
                    loading={loading}
                  >
                    Lưu thay đổi
                  </Button>

                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<X size={18} />}
                    onClick={() => setEditMode(false)}
                  >
                    Hủy thay đổi
                  </Button>
                </Group>
              </>
            )}
          </>
        ) : (
          TAB_CONTENT[activeTab]
        )}
      </Box>
    </Paper>
  );
}

function SidebarNav({
  activeTab,
  onChangeTab,
}: {
  activeTab: string;
  onChangeTab: (key: string) => void;
}) {
  return (
    <Box mt="lg" className={style.sidebar}>
      {SIDEBAR_MENU.map((item) => (
        <Box
          key={item.key}
          onClick={() => onChangeTab(item.key)}
          className={`${style.sidebarItem} ${
            activeTab === item.key ? style.active : ""
          }`}
        >
          {item.icon}
          <Text ml="sm">{item.label}</Text>
        </Box>
      ))}
    </Box>
  );
}

function DisplayItem({ label, value }: { label: string; value: string | number | undefined | null }) {
  return (
    <Paper withBorder radius="md" p="md" className={style.item}>
      <Text size="xs" c="dimmed">
        {label}
      </Text>

      <Text fw={600} size="lg">
        {value != null && value !== "" ? value : "-"}
      </Text>
    </Paper>
  );
}