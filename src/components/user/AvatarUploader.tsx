import { useState } from "react";
import { Avatar, Button, Modal } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useUserStore } from "../../stores/useUserStore";
import style from "./style.module.scss";

const AvatarUploader = () => {
  const { user, updateUser } = useUserStore();
  const [opened, setOpened] = useState(false);

  const handleUpload = (files: File[]) => {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = () => {
      updateUser({ avatar: reader.result as string });
      setOpened(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className={style.avatarWrapper}>
      <Avatar
        src={user.avatar || undefined}
        size={140}
        radius="xl"
        className={style.avatar}
      />

      <Button color="blue" className={style.avatarButton} onClick={() => setOpened(true)}>
        Đổi ảnh
      </Button>

      <Modal opened={opened} onClose={() => setOpened(false)} title="Tải ảnh mới">
        <Dropzone
          multiple={false}
          onDrop={handleUpload}
          accept={IMAGE_MIME_TYPE}
          maxSize={2 * 1024 * 1024}
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
