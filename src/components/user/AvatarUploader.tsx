import { Avatar, Button, Modal } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Image as ImageIcon, Upload, X, Edit2 } from "lucide-react";
import { useState } from "react";
import UserService from "../../services/UserService";
import { useUserStore } from "../../stores/useUserStore";
import { showError, showSuccess } from "../../utils/notifications";
import style from "./style.module.scss";

const AvatarUploader = () => {
  const { user, updateUser } = useUserStore();
  const [avatarModal, setAvatarModal] = useState(false);
  const [bgModal, setBgModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (files: File[], type: "avatar" | "background") => {
    const file = files[0];
    if (!file) return;

    try {
      setLoading(true);

      const updatedUser = await UserService.updateProfile(
        type === "avatar" ? { avatarFile: file } : { backgroundFile: file }
      );

      updateUser(updatedUser);
      showSuccess(
        type === "avatar" ? "Cập nhật avatar thành công 🎉" : "Cập nhật background thành công 🎉"
      );
      type === "avatar" ? setAvatarModal(false) : setBgModal(false);
    } catch (error) {
      console.error("Upload failed:", error);
      showError("Upload thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={style.avatarWrapper}>
      {/* Background */}
      <div
        className={style.backgroundWrapper}
        style={{
          backgroundImage: `url(${user?.backgroundURL || ""})`,
        }}
      >
        <Button
          size="xs"
          variant="filled"
          className={style.editBgButton}
          onClick={() => setBgModal(true)}
        >
          <Edit2 size={14} />
        </Button>
      </div>

      {/* Avatar */}
      <div className={style.avatarContainer} onClick={() => setAvatarModal(true)}>
        <Avatar
          src={user?.avatarURL || undefined}
          size={140}
          radius="xl"
          className={style.avatar}
        />
      </div>

      {/* Avatar Modal */}
      <Modal opened={avatarModal} onClose={() => setAvatarModal(false)} title="Tải avatar mới">
        <Dropzone
          multiple={false}
          onDrop={(files) => handleUpload(files, "avatar")}
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

      {/* Background Modal */}
      <Modal opened={bgModal} onClose={() => setBgModal(false)} title="Tải background mới">
        <Dropzone
          multiple={false}
          onDrop={(files) => handleUpload(files, "background")}
          accept={IMAGE_MIME_TYPE}
          maxSize={5 * 1024 * 1024}
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
            <small>Chỉ hỗ trợ JPG/PNG, tối đa 5MB</small>
          </div>
        </Dropzone>
      </Modal>
    </div>
  );
};

export default AvatarUploader;