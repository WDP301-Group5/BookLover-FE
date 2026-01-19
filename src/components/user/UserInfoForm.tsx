import { useState } from "react";
import {
  Box,
  Paper,
  Text,
  Title,
  Button,
  Group,
  TextInput,
  Divider,
} from "@mantine/core";
import { Pencil, Save, X, User, Book, Bell, Lock } from "lucide-react";

import AvatarUploader from "./AvatarUploader";
import style from "./style.module.scss";

import MyStory from "./user-navbar/MyStory";
import ListStoryFollowed from "./user-navbar/ListStoryFollowed";
import AuthorFollow from "./user-navbar/AuthorFollow";
import Notification from "./user-navbar/Notification";
import ChangePassword from "./user-navbar/ChangePassword";

const SIDEBAR_MENU = [
  { key: "info", label: "Thông tin cá nhân", icon: <User size={18} /> },
  { key: "my-stories", label: "Truyện của tôi", icon: <Book size={18} /> },
  { key: "following-stories", label: "Truyện đang theo dõi", icon: <Book size={18} /> },
  { key: "following-authors", label: "Tác giả đang theo dõi", icon: <User size={18} /> },
  { key: "notifications", label: "Thông báo", icon: <Bell size={18} /> },
  { key: "change-password", label: "Đổi mật khẩu", icon: <Lock size={18} /> },
];

export default function UserInfoForm() {
  const [activeTab, setActiveTab] = useState("info");
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    fullName: "Nguyen Thien Nga",
    email: "ngannguyen@example.com",
    phone: "0123 456 789",
    address: "195 Điện Biên Phủ, Bình Thạnh, HCM",
  });

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => setEditMode(false);

  const TAB_CONTENT: Record<string, React.ReactNode> = {
    "my-stories": <MyStory />,
    "following-stories": <ListStoryFollowed />,
    "following-authors": <AuthorFollow />,
    "notifications": <Notification />,
    "change-password": <ChangePassword />,
  };

  return (
    <Paper className={style.container}>
      {/* LEFT SIDEBAR */}
      <Box className={style.left}>
        <AvatarUploader />

        <SidebarNav
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />
      </Box>

      <Divider orientation="vertical" />

      {/* RIGHT CONTENT */}
      <Box className={style.right}>
        {activeTab === "info" ? (
          <UserInfoSection
            form={form}
            editMode={editMode}
            onChange={handleChange}
            onSave={handleSave}
            onCancel={() => setEditMode(false)}
            onEdit={() => setEditMode(true)}
          />
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
          className={`${style.sidebarItem} ${activeTab === item.key ? style.active : ""}`}
        >
          {item.icon}
          <Text ml="sm">{item.label}</Text>
        </Box>
      ))}
    </Box>
  );
}

function UserInfoSection({
  form,
  editMode,
  onChange,
  onEdit,
  onSave,
  onCancel,
}: {
  form: Record<string, string>;
  editMode: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (key: string, value: string) => void;
}) {
  const fields = [
    { key: "fullName", label: "Full name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];

  return (
    <>
      {!editMode && (
        <Button
          variant="subtle"
          color="blue"
          leftSection={<Pencil size={18} />}
          className={style.editBtn}
          onClick={onEdit}
        >
          Edit
        </Button>
      )}

      <Title order={3} className={style.sectionTitle}>
        Thông tin tài khoản
      </Title>

      {!editMode ? (
        <Box>
          {fields.map((f) => (
            <DisplayItem key={f.key} label={f.label} value={form[f.key]} />
          ))}
        </Box>
      ) : (
        <Box>
          {fields.map((f) => (
            <TextInput
              key={f.key}
              label={f.label}
              value={form[f.key]}
              onChange={(e) => onChange(f.key, e.currentTarget.value)}
              mb="md"
            />
          ))}

          <Group mt="lg">
            <Button leftSection={<Save size={18} />} color="blue" onClick={onSave}>
              Save
            </Button>

            <Button variant="light" color="gray" leftSection={<X size={18} />} onClick={onCancel}>
              Cancel
            </Button>
          </Group>
        </Box>
      )}
    </>
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
