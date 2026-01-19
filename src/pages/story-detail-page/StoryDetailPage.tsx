import type { FC } from "react";
import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Stack,
  Button,
  Image,
  Rating,
  Paper,
  Divider,
  Breadcrumbs,
  Anchor,
  Spoiler,
  Textarea,
  Box,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  Heart,
  Clock,
  Eye,
  MessageCircle,
  ChevronRight,
  User,
  Activity,
  Tags,
  Star,
} from "lucide-react";

/* =======================
   Types
======================= */
interface Chapter {
  number: string;
  title: string;
  updatedAt: string;
  views: number;
}

interface Story {
  title: string;
  breadcrumbs: { label: string; href: string }[];
  coverUrl: string;
  author: string;
  status: string;
  genres: string[];
  views: number;
  rating: number;
  ratingCount: number;
  updatedAt: string;
  description: string;
  chapters: Chapter[];
}

/* =======================
   Fake Data
======================= */
const fakeStoryData: Story = {
  title: "Tiểu Thư Mà Tôi Phục Vụ Biến Thành Thiếu Gia Rồi",
  breadcrumbs: [
    { label: "Trang chủ", href: "/" },
    { label: "Manhua", href: "/the-loai/manhua" },
    { label: "Romance", href: "/the-loai/romance" },
  ],
  coverUrl:
    "https://bloganchoi.com/wp-content/uploads/2023/06/truyen-tranh-ngon-tinh-hay-2023-17-696x938.jpeg",
  author: "Đang cập nhật",
  status: "Đang tiến hành",
  genres: ["Manhua", "Romance", "Hài hước"],
  views: 1_234_567,
  rating: 4.5,
  ratingCount: 123,
  updatedAt: "1 giờ trước",
  description:
    `Chào mừng các đạo hữu thân mến của BookLover, hãy cùng thưởng thức bộ tiểu thuyết Tiểu thư mà tôi phục vụ biến thành thiếu gia rồi đầy cuốn hút trên website của chúng tôi. Bộ tiểu thuyết này thuộc về các thể loại Manhua, Romance và được cập nhật chương mới liên tục trên website BookLover. Đây là một trong những tác phẩm nổi bật nhất của Đang Cập Nhật và đã thu hút hàng triệu độc giả trên khắp thế giới.

BookLover là website đọc tiểu thuyết online hàng đầu tại Việt Nam, cung cấp cho bạn những bộ tiểu thuyết đa dạng và phong phú, từ những thể loại tiểu thuyết ngôn tình lãng mạn, tiểu thuyết đam mỹ hấp dẫn, tiểu thuyết xuyên không phiêu lưu, tiểu thuyết tu tiên huyền ảo, cho đến những thể loại tiểu thuyết adult gây cấn và kịch tính. Bạn có thể tìm kiếm và đọc tiểu thuyết theo nhiều tiêu chí khác nhau, như tên tác phẩm, tác giả, thể loại, năm xuất bản, số lượt xem, số lượt yêu thích và nhiều tiêu chí khác.

BookLover luôn cập nhật những bộ tiểu thuyết mới nhất và nhanh nhất, đảm bảo bạn sẽ không bỏ lỡ bất kỳ bộ tiểu thuyết nào mà bạn yêu thích. Hãy đến với BookLover để thưởng thức những giây phút giải trí tuyệt vời cùng với những bộ tiểu thuyết hấp dẫn nhất!

Xuyên vào thế giới trong cuốn tiểu thuyết mà mình thích nhất, tôi phải dùng thân phận của người hầu bên cạnh nữ chính để bắt đầu cuộc sống mới, giúp tiểu thư nhà tôi và nam chính có được cuộc sống hạnh phúc. Nhưng mọi thứ theo sự việc xảy ra đó, tất cả đều bỗng im bặt. Chính là vào ngày đó, tiểu thư mà tôi phục vụ thế mà lại biến thành thiếu gia?

Để trải nghiệm tiểu thuyết tốt nhất, bạn nên đăng ký tài khoản tại BookLover. Bạn sẽ có thể theo dõi những tiểu thuyết yêu thích, bình luận và giao lưu với cộng đồng độc giả sôi nổi. BookLover tự hào mang đến cho bạn thế giới tiểu thuyết đa dạng và phong phú, với nhiều thể loại và tác phẩm hấp dẫn. Hãy đăng ký ngay hôm nay để khám phá những điều thú vị cùng Tiểu thư mà tôi phục vụ biến thành thiếu gia rồi!`.trim(),
  chapters: [
    {
      number: "Chapter 94",
      title: "",
      updatedAt: "11 giờ trước",
      views: 12345,
    },
    {
      number: "Chapter 93",
      title: "",
      updatedAt: "11 giờ trước",
      views: 11345,
    },
    {
      number: "Chapter 92",
      title: "",
      updatedAt: "11 giờ trước",
      views: 10345,
    },
  ],
};

const slugify = (str: string) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

const StoryDetailPage: FC = () => {
  const [followed, { toggle }] = useDisclosure(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const {
    title,
    breadcrumbs,
    coverUrl,
    author,
    status,
    genres,
    views,
    rating,
    ratingCount,
    updatedAt,
    description,
    chapters,
  } = fakeStoryData;

  return (
    <Container size="lg" py="md">
      <Breadcrumbs mb="sm">
        {breadcrumbs.map((item, index) => (
          <Anchor key={index} href={item.href} size="sm">
            {item.label}
          </Anchor>
        ))}
        <Text size="sm" c="dimmed">
          {title}
        </Text>
      </Breadcrumbs>

      <Paper withBorder p="md" radius="md" mb="lg">
        <Group align="flex-start" gap={16} wrap="nowrap">
          <Image
            src={coverUrl}
            alt={title}
            w={200}
            h={260}
            radius="sm"
            fit="contain"
          />

          <Stack flex={1} gap={6}>
            <Title order={2} lh={1.3}>
              {title}
            </Title>

            <Stack gap={10}>
              <Group gap={6}>
                <User size={14} />
                <Text size="sm" fw={500}>
                  Tác giả:
                </Text>
                <Text size="sm">{author}</Text>
              </Group>

              <Group gap={6}>
                <Activity size={14} />
                <Text size="sm" fw={500}>
                  Tình trạng:
                </Text>
                <Badge size="xs" color="green">
                  {status}
                </Badge>
              </Group>

              <Group gap={6} wrap="wrap">
                <Tags size={14} />
                <Text size="sm" fw={500}>
                  Thể loại:
                </Text>
                {genres.map((g) => (
                  <Badge key={g} size="xs" variant="light">
                    {g}
                  </Badge>
                ))}
              </Group>

              <Group gap={6}>
                <Star size={14} />

                <Text size="sm" fw={500}>
                  Đánh giá:
                </Text>

                <Rating
                  value={hoverRating ?? rating}
                  fractions={2}
                  size="sm"
                  onHover={setHoverRating}
                  onMouseLeave={() => setHoverRating(null)}
                />

                <Text size="xs" c="dimmed">
                  {hoverRating ?? rating} / 5 ({ratingCount})
                </Text>
              </Group>

              <Group gap={6}>
                <Clock size={14} />
                <Text size="sm" fw={500}>
                  Cập nhật cuối: {updatedAt}
                </Text>
              </Group>

              <Group gap={6}>
                <Eye size={14} />
                <Text size="sm" fw={500}>
                  {views.toLocaleString("vi-VN")} lượt xem
                </Text>
              </Group>
            </Stack>

            <Group mt="xs">
              <Button
                size="xs"
                color="red"
                variant={followed ? "filled" : "outline"}
                leftSection={
                  <Heart size={14} fill={followed ? "currentColor" : "none"} />
                }
                onClick={toggle}
              >
                {followed ? "Đã theo dõi" : "Theo dõi"}
              </Button>

              <Button size="xs" color="blue">
                Đọc từ đầu
              </Button>
              <Button size="xs" color="green">
                Đọc mới nhất
              </Button>
            </Group>
          </Stack>
        </Group>

        <Divider my="sm" />

        <Title order={4} mb={4}>
          Giới thiệu truyện
        </Title>

        <Spoiler maxHeight={100} showLabel="Xem thêm" hideLabel="Ẩn bớt">
          <Text size="sm" lh={1.6} style={{ whiteSpace: "pre-line" }}>
            {description}
          </Text>
        </Spoiler>
      </Paper>

      <Paper withBorder radius="md" p="md" mb="lg">
        <Group pb={6} mb={6} style={{ borderBottom: "2px solid #228be6" }}>
          <ChevronRight size={14} color="#228be6" />
          <Title order={5} c="blue">
            DANH SÁCH CHƯƠNG
          </Title>
        </Group>

        <Group justify="space-between" px="xs" py={4}>
          <Text size="sm" fw={500}>
            Số chương
          </Text>
          <Text size="sm" fw={500}>
            Cập nhật
          </Text>
        </Group>

        <Divider mb="xs" />

        <Stack gap={0}>
          {chapters.map((chapter, index) => (
            <Group
              key={index}
              justify="space-between"
              px="xs"
              py={6}
              style={{ borderBottom: "1px dashed #e9ecef" }}
            >
              <Anchor
                size="sm"
                fw={500}
                href={`/truyen/${slugify(title)}/chuong/${
                  chapter.number.split(" ")[1]
                }`}
              >
                {chapter.number}
              </Anchor>

              <Text size="xs" c="dimmed" fs="italic">
                {chapter.updatedAt}
              </Text>
            </Group>
          ))}
        </Stack>

        <Box mt="sm" ta="center">
          <Button size="xs" variant="subtle">
            + Xem thêm
          </Button>
        </Box>
      </Paper>

      <Paper withBorder radius="md" p="md">
        <Group mb="xs">
          <MessageCircle size={16} />
          <Title order={4}>Bình luận</Title>
        </Group>

        <Stack gap="xs">
          <Textarea size="sm" minRows={3} placeholder="Viết bình luận..." />
          <Button size="xs" w="fit-content">
            Gửi bình luận
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default StoryDetailPage;
