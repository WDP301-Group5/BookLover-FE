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
import { Pencil, Save, X } from "lucide-react";
import AvatarUploader from "./AvatarUploader";
import style from "./style.module.scss";

export default function UserInfoForm() {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    fullName: "Nguyen Thien Nga",
    email: "ngannguyen@example.com",
    phone: "0123 456 789",
    address: "195 Điện Biên Phủ, Bình Thạnh, HCM",
  });

  const handleSave = () => {
    setEditMode(false);
  };

  return (
    <Paper className={style.container}>
      {/* LEFT - AVATAR */}
      <Box className={style.left}>
        <AvatarUploader />
      </Box>

      <Divider orientation="vertical" />

      {/* RIGHT - INFO */}
      <Box className={style.right}>
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

        {!editMode && (
          <Box>
            <Item label="Full name" value={form.fullName} />
            <Item label="Email" value={form.email} />
            <Item label="Phone" value={form.phone} />
            <Item label="Address" value={form.address} />
          </Box>
        )}

        {editMode && (
          <Box>
            <TextInput
              label="Full name"
              value={form.fullName}
              onChange={(e) =>
                setForm({ ...form, fullName: e.currentTarget.value })
              }
              mb="md"
            />

            <TextInput
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.currentTarget.value })
              }
              mb="md"
            />

            <TextInput
              label="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.currentTarget.value })
              }
              mb="md"
            />

            <TextInput
              label="Address"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.currentTarget.value })
              }
              mb="md"
            />

            <Group mt="lg">
              <Button leftSection={<Save size={18} />} color="blue" onClick={handleSave}>
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
      </Box>
    </Paper>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <Box className={style.item}>
      <Text size="sm" c="dimmed">
        {label}
      </Text>
      <Text fw={500}>{value}</Text>
    </Box>
  );
}
