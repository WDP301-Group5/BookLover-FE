import { useState } from "react";
import { Avatar, Button, Modal } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import UserService from "../../services/UserService";
import { showError, showSuccess } from "../../utils/notifications";
import style from "./style.module.scss";

const AvatarUploader = () => {
  const { user, updateUser } = useUserStore();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    try {
      setLoading(true);

      const updatedUser = await UserService.updateProfile({
        avatarFile: file,
      });

      // Cập nhật lại store
      updateUser(updatedUser);

      showSuccess("Cập nhật avatar thành công 🎉");
      setOpened(false);
    } catch (error) {
      console.error("Upload avatar failed:", error);
      showError("Upload avatar thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.avatarWrapper}>
      <Avatar
        src={user.avatarURL || undefined}
        size={140}
        radius="xl"
        className={style.avatar}
      />

      <Button
        color="blue"
        className={style.avatarButton}
        onClick={() => setOpened(true)}
      >
        Đổi ảnh
      </Button>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Tải ảnh mới"
      >
        <Dropzone
          multiple={false}
          onDrop={handleUpload}
          accept={IMAGE_MIME_TYPE}
          maxSize={2 * 1024 * 1024}
          loading={loading}
        >
          <div className={style.dropzoneBox}>
            <Dropzone.Accept>
              <Upload size={40} strokeWidth={1.5} />
            </Dropzone.Accept>

            <Dropzone.Reject>
              <X size={40} strokeWidth={1.5} />
            </Dropzone.Reject>

            <Dropzone.Idle>
              <ImageIcon size={40} strokeWidth={1.5} />
            </Dropzone.Idle>

            <p>Kéo thả ảnh hoặc bấm để chọn</p>
            <small>Chỉ hỗ trợ JPG/PNG, tối đa 2MB</small>
          </div>
        </Dropzone>
      </Modal>
    </div>
  );
};

export default AvatarUploader;