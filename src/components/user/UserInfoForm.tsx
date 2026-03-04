import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Text,
  Title,
  Button,
  Group,
  TextInput,
  Divider,
  Textarea,
} from "@mantine/core";
import { Pencil, Save, X, User, Book, Bell, Lock } from "lucide-react";

import AvatarUploader from "./AvatarUploader";
import style from "./style.module.scss";

import MyStory from "./user-navbar/MyStory";
import ListStoryFollowed from "./user-navbar/ListStoryFollowed";
import AuthorFollow from "./user-navbar/AuthorFollow";
import Notification from "./user-navbar/Notification";
import ChangePassword from "./user-navbar/ChangePassword";
import { useUserStore } from "../../stores/useUserStore";
import UserService from "../../services/UserService";
import { showError, showSuccess } from "../../utils/notifications";

const SIDEBAR_MENU = [
  { key: "info", label: "Thông tin cá nhân", icon: <User size={18} /> },
  { key: "my-stories", label: "Truyện của tôi", icon: <Book size={18} /> },
  {
    key: "following-stories",
    label: "Truyện đang theo dõi",
    icon: <Book size={18} />,
  },
  {
    key: "following-authors",
    label: "Tác giả đang theo dõi",
    icon: <User size={18} />,
  },
  { key: "notifications", label: "Thông báo", icon: <Bell size={18} /> },
  { key: "change-password", label: "Đổi mật khẩu", icon: <Lock size={18} /> },
];

export default function UserInfoForm() {
  const { user, updateUser } = useUserStore();

  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    nickName: "",
    penName: "",
    bio: "",
  });

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      console.log("Calling GET profile...");
      const data = await UserService.getProfile();
      updateUser(data);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  fetchProfile();
}, []);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
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
      console.error("Update failed:", error);
      const errorMessage = (error instanceof Error ? error.message : undefined) || "Không thể cập nhật thông tin. Vui lòng thử lại.";
      showError(
        errorMessage
      );
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Text>Vui lòng đăng nhập.</Text>;
  }

  const TAB_CONTENT: Record<string, React.ReactNode> = {
    "my-stories": <MyStory />,
    "following-stories": <ListStoryFollowed />,
    "following-authors": <AuthorFollow />,
    notifications: <Notification />,
    "change-password": <ChangePassword />,
  };

  return (
    <Paper className={style.container}>
      {/* LEFT SIDEBAR */}
      <Box className={style.left}>
        <AvatarUploader avatarURL={user.avatarURL} />

        <SidebarNav activeTab={activeTab} onChangeTab={setActiveTab} />
      </Box>

      <Divider orientation="vertical" />

      {/* RIGHT CONTENT */}
      <Box className={style.right}>
        {activeTab === "info" ? (
          <>
            {!editMode && (
              <Button
                variant="subtle"
                color="blue"
                leftSection={<Pencil size={18} />}
                className={style.editBtn}
                onClick={() => setEditMode(true)}
              >
                Edit
              </Button>
            )}

            <Title order={3} className={style.sectionTitle}>
              Thông tin tài khoản
            </Title>

            {!editMode ? (
              <Box>
                <DisplayItem label="Username" value={user.username} />
                <DisplayItem label="Full name" value={user.fullName} />
                <DisplayItem label="Nick name" value={user.nickName || "-"} />
                {user.role === "author" && (
                  <DisplayItem label="Pen name" value={user.penName || "-"} />
                )}
                <DisplayItem label="Bio" value={user.bio || "-"} />
                <DisplayItem label="Role" value={user.role} />
                <DisplayItem label="VIP Level" value={String(user.vipLevel)} />
              </Box>
            ) : (
              <Box>
                <TextInput
                  label="Full name"
                  value={form.fullName}
                  onChange={(e) =>
                    handleChange("fullName", e.currentTarget.value)
                  }
                  mb="md"
                />

                <TextInput
                  label="Nick name"
                  value={form.nickName}
                  onChange={(e) =>
                    handleChange("nickName", e.currentTarget.value)
                  }
                  mb="md"
                />

                {user.role === "author" && (
                  <TextInput
                    label="Pen name"
                    value={form.penName}
                    onChange={(e) =>
                      handleChange("penName", e.currentTarget.value)
                    }
                    mb="md"
                  />
                )}

                <Textarea
                  label="Bio"
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.currentTarget.value)}
                  mb="md"
                  minRows={3}
                />

                <Group mt="lg">
                  <Button
                    leftSection={<Save size={18} />}
                    color="blue"
                    onClick={handleSave}
                    loading={loading}
                  >
                    Save
                  </Button>

                  <Button
                    variant="light"
                    color="gray"
                    leftSection={<X size={18} />}
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                </Group>
              </Box>
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

function DisplayItem({ label, value }: { label: string; value: string }) {
  return (
    <Box className={style.item}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={500}>{value}</Text>
    </Box>
  );
}
