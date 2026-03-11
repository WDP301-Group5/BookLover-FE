import { Modal, Text, Stack } from "@mantine/core";

interface TermsModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function TermsModal({ opened, onClose }: TermsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Điều khoản"
      centered
      size="lg"
    >
      <Stack gap="md">
        <Text>
          Trang web của chúng tôi cung cấp dịch vụ đọc truyện tranh online với
          mục đích viết và chia sẻ nội dung. Toàn bộ các truyện tranh được đăng
          tải trên trang web được sưu tầm từ nhiều người trên internet và chúng
          tôi không chịu trách nhiệm về bản quyền và pháp luật quyền của bạn,
          vui lòng liên hệ với chúng tôi để được hỗ trợ nếu mất thông tin về bản
          quyền của bạn.
        </Text>

        <Text>
          Ngoài ra, chúng tôi không chịu trách nhiệm về các nội dung quảng cáo
          hiển thị trên trang web, bảo gồm như không gửi hạn ở việc quảng cáo
          sản phẩm hoặc dịch vụ của bên thứ ba. Nhưng quảng cáo này không phán
          ánh quan điểm hoặc cam kết của chúng tôi. Người dùng cần tu vấn hỏ
          trách nhiệm với các quảng cáo đó.
        </Text>

        <Text fw={600} size="sm">
          Miễn trừ trách nhiệm
        </Text>

        <Text>
          Trang web của chúng tôi chi chi cung cấp dịch vụ để đọc truyện tranh
          online với mục đích vui và chia sẻ nói dung. Toàn bộ các truyện tranh
          được đăng tải trên trang web được sưu tầm từ nhiều người trên internet
          và chúng tôi không chịu trách nhiệm về bản quyền và pháp luật quyền
          của bạn, vui lòng liên hệ với chúng tôi để được hỗ trợ nếu mất thông
          tin về bản quyền của bạn.
        </Text>

        <Text>
          Ngoài ra, chúng tôi không chịu trách nhiệm về các nội dung quảng cáo
          hiển thị trên trang web, bảo gồm như không gửi hạn ở việc quảng cáo
          sản phẩm hoặc dịch vụ của bên thứ ba. Nhưng quảng cáo này không phán
          ánh quan điểm hoặc cam kết của chúng tôi. Người dùng cần tu vấn hỏ
          trách nhiệm với các quảng cáo đó.
        </Text>
      </Stack>
    </Modal>
  );
}
