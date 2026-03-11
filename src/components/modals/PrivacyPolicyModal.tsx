import { Modal, Text, Stack } from "@mantine/core";

interface PrivacyPolicyModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  opened,
  onClose,
}: PrivacyPolicyModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Chúng tôi là ai?"
      centered
      size="lg"
    >
      <Stack gap="md">
        <Text>Chúng tôi là BookLover, website độc truyện tranh online.</Text>

        <Text fw={600} size="sm">
          Thông tin cá nhân nào bị thu thập và tại sao thu thập
        </Text>

        <Text fw={600} size="sm">
          Bình luận
        </Text>
        <Text>
          Khi khách truy cập để lại bình luận trên trang web, chúng tôi thu thập
          dữ liệu được hiển thị trong biểu mẫu bình luận và cũng lưu trữ địa chỉ
          IP của người dùng tính duyệt để giúp phát hiện spam. Một chuỗi ký tự
          được tạo từ địa chỉ email của bạn (còn gọi là hash) có thể được cung
          cấp cho dịch vụ Gravatar để xem bạn có đang sử dụng nó hay không.
          Chính sách bảo mật của Gravatar có tại đây. Sau khi chấp nhận bình
          luận, ảnh đại diện của bạn sẽ hiển thị trong công khai bình luận của
          bạn.
        </Text>

        <Text fw={600} size="sm">
          Thông tin liên hệ
        </Text>
        <Text>
          Chúng tôi không thể thu thập bất cứ thông tin liên hệ nào của bạn
          ngoài câu hỏi của bạn.
        </Text>

        <Text fw={600} size="sm">
          Cookies
        </Text>
        <Text>
          Trong chỉ sử dụng cookies để lưu thôi hạn của quảng cáo để biết rất
          từng nhất định, điều này chức năng sẽ tua dữ liêu về các thực người
          dùng được định. Chúng tôi yêu cấu dụng Cookie và Local Storage để lưu
          trên email trong bình luận, các chương truyện yêu thích và các thông
          tin khác của bạn.
        </Text>

        <Text fw={600} size="sm">
          Nội dung nhúng từ website khác
        </Text>
        <Text>
          Các bài viết trên trang web này có thể bao gồm nội dung nhúng được
          nhưng ở các trang web khác hoặc dụi video, hình ảnh, bài viết, v.v.).
          Nội dung được nhúng từ các trang web khác hoạt động giống như nếu
          khách truy cập đã truy cập đến trang web khác. Những website này có
          thể thu thập dữ liệu về bạn, bao gồm như người dùng đã đăng nhập vào
          chúng, và dùng cookies để theo dõi nội dung nhúng nếu bạn có tài khoản
          và đã đăng nhập vào website đó.
        </Text>

        <Text fw={600} size="sm">
          Phân tích
        </Text>
        <Text>
          Chúng tôi sử dụng Google Analytics để phân tích lưu lượng truy cập.
        </Text>

        <Text fw={600} size="sm">
          Chúng tôi chia sẻ dữ liệu của bạn với ai
        </Text>
        <Text>
          Chúng tôi không chia sẻ dữ liệu của bạn bất kỳ bên thứ ba nào.
        </Text>

        <Text fw={600} size="sm">
          Dữ liệu của bạn tồn tại bao lâu
        </Text>
        <Text>
          Nếu bạn để lại bình luận, bình luận và siêu dữ liệu của nó sẽ được giữ
          lại vô thời hạn. Điều này là để chúng tôi có thể tự động phát hiện và
          phê duyệt các bình luận tiếp theo thay vì đặt chúng trong một hàng đợi
          để điều kiện. Đối với những người dùng hệ thống, chúng tôi cũng lưu
          trữ thông tin cá nhân mà họ cung cấp trong hồ sơ người dùng của họ.
          Tất cả người dùng có thể xem, chỉnh sửa hoặc xoá thông tin cá nhân của
          họ bất kỳ lúc nào (ngoại trừ họ không thể thay đổi tên tài khoản của
          họ). Quản trị viên trang web cũng có thể xem và chỉnh sửa thông tin
          đó.
        </Text>

        <Text fw={600} size="sm">
          Các quyền nào của bạn với dữ liệu của mình
        </Text>
        <Text>
          Nếu bạn có tài khoản trên trang web này hoặc để lại bình luận, bạn có
          thể yêu cầu xuất file dữ liệu cá nhân mà chúng tôi lưu giữ về bạn, bao
          gồm bất kỳ dữ liệu bạn đã cung cấp cho chúng tôi. Bạn cũng có thể yêu
          cầu chúng tôi xoá bất kỳ dữ liệu cá nhân mà chúng tôi lưu giữ về bạn.
          Điều này không bao gồm bất kỳ dữ liệu nào mà chúng tôi có bổn phận giữ
          lại vì các lý do pháp lý hoặc vì các mục đích khác.
        </Text>

        <Text fw={600} size="sm">
          Các quyền liệu của bạn được gửi tới đâu
        </Text>
        <Text>
          Các bình luận của khách (không phải là thành viên) có thể được kiểm
          tra qua một dịch vụ tự động phát hiện spam.
        </Text>
      </Stack>
    </Modal>
  );
}
