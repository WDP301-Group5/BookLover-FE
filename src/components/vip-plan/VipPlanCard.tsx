import {
  Badge,
  Button,
  Card,
  Group,
  Text,
  Title,
  Divider,
} from "@mantine/core";
import { Check, Flame } from "lucide-react";

interface ISubcriptionPlan {
  id: string;
  name: string;
  level: number;
  features: string[];
  description: string;
  spiritStones: number;
  extendedTime: string;
  soldCount?: number;
  status: "active" | "inactive" | "pending" | "current";// current là gói vip hiện tại của user
}

const statusColorMap = {
  active: "blue",
  inactive: "gray",
  pending: "yellow",
  current: "green",
};

const VipPlanCard = ({ plan, onBuy }: { plan: ISubcriptionPlan, onBuy: () => void }) => {
  return (
    <Card
      withBorder
      radius="xl"
      p="xl"
      h="100%"
      className="
        flex flex-col relative
        transition-all duration-300
        hover:-translate-y-2 hover:shadow-xl"
    >
      {plan.level === 4 && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-300 text-white -translate-y-1/2 translate-x-1/2 rotate-45 flex items-center justify-center text-xs font-bold">
            <p className="absolute bottom-1 text-blue-600">Đề cử</p>
          </div>
        </div>
      )}
      {/* Header */}
      <Group justify="space-between" mb="xs">
        <Title order={3} className="font-semibold text-blue-700">
          {plan.name}
        </Title>
        <Badge color={statusColorMap[plan.status]} variant="light">
          {plan.status === "current" ? "Hiện tại" : plan.status}
        </Badge>
      </Group>

      {/* Description badge */}
      <Group mb="md" gap="xs">
        <Badge
          color="cyan"
          variant="light"
          radius="sm"
          size="xs"
        >
          {plan.description}
        </Badge>

        {plan.soldCount !== undefined && (
          <Badge
            color="orange"
            variant="light"
            leftSection={<Flame size={12} />}
          >
            {plan.soldCount} đã bán
          </Badge>
        )}
      </Group>

      {/* Spirit Stones */}
      <div
        className="
          mb-6 rounded-xl p-4 text-center
          bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-600
          text-white
        "
      >
        <Text className="text-3xl font-bold">
          {plan.spiritStones}
        </Text>
        <Text fw={500}>Spirit Stones</Text>
        <Text size="sm" className="opacity-90">
          {plan.extendedTime}
        </Text>
      </div>

      <Divider mb="md" />

      {/* Features */}
      <ul className="mb-6 space-y-3">
        {plan.features.map((feature, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 text-sm"
          >
            <span
              className="
                mt-0.5 flex h-5 w-5 items-center justify-center
                rounded-full bg-blue-100
              "
            >
              <Check size={12} className="text-blue-600" />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Button
        fullWidth
        size="md"
        radius="md"
        mt="auto"
        color="blue"
        variant={plan.status === "current" ? "light" : "filled"}
        onClick={onBuy}
      >
        {plan.status === "current" ? "Gia hạn" : "Mua ngay"}
      </Button>
    </Card>
  );
};

export default VipPlanCard;
