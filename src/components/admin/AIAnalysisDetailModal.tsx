// src/components/admin/AIAnalysisDetailModal.tsx
import {
  Badge,
  Box,
  Divider,
  Group,
  Modal,
  Progress,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import {
  IconAlertTriangle,
  IconBrain,
  IconList,
  IconScoreboard,
} from "@tabler/icons-react";
import type { Story } from "../../interfaces/Story";

interface AIAnalysisDetailModalProps {
  story: Story;
  opened: boolean;
  onClose: () => void;
}

const decisionConfig = {
  APPROVE: { color: "green", label: "DUYỆT", description: "Nội dung an toàn" },
  FLAG: {
    color: "yellow",
    label: "THEO DÕI",
    description: "Cần theo dõi thêm",
  },
  REJECT: { color: "red", label: "TỪ CHỐI", description: "Vi phạm nội dung" },
} as const;

const finalDecisionConfig = {
  "auto-approved": {
    color: "green",
    label: "Tự duyệt",
    description: "Tự động phê duyệt",
  },
  flagged: { color: "yellow", label: "Theo dõi", description: "Cần theo dõi" },
  "auto-rejected": {
    color: "red",
    label: "Tự từ chối",
    description: "Tự động từ chối",
  },
  "hard-filter-rejected": {
    color: "red",
    label: "Lọc cứng",
    description: "Bị từ chối bởi bộ lọc",
  },
} as const;

/**
 * Get color for risk level based on score (0-1)
 */
function getRiskColor(score: number): string {
  if (score >= 0.7) return "green";
  if (score >= 0.4) return "yellow";
  return "red";
}

/**
 * Get Vietnamese label for score type
 */
function getScoreLabel(key: string): string {
  const labels: Record<string, string> = {
    overallRisk: "Rủi ro tổng thể",
    inappropriateName: "Tên không phù hợp",
    inappropriateDescription: "Mô tả không phù hợp",
    inappropriateGenre: "Thể loại không phù hợp",
    toxicity: "Độc hại",
    sexual: "Nội dung khiêu dâm",
    violence: "Bạo lực",
    political: "Chính trị",
  };
  return labels[key] || key;
}

/**
 * AI Analysis Detail Modal Component
 * Shows complete AI analysis data including scores, reasons, and warnings
 */
export function AIAnalysisDetailModal({
  story,
  opened,
  onClose,
}: AIAnalysisDetailModalProps) {
  // Check if story is null/undefined first
  if (!story) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <Group gap="xs">
            <IconBrain size={20} />
            <Text fw={600}>Chi tiết phân tích AI</Text>
          </Group>
        }
        size="lg"
      >
        <Text c="dimmed" ta="center" py="xl">
          Chưa có phân tích AI
        </Text>
      </Modal>
    );
  }

  const { aiAnalysis } = story;

  if (!aiAnalysis) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        title={
          <Group gap="xs">
            <IconBrain size={20} />
            <Text fw={600}>Chi tiết phân tích AI</Text>
          </Group>
        }
        size="lg"
      >
        <Text c="dimmed" ta="center" py="xl">
          Chưa có dữ liệu phân tích AI cho truyện này.
        </Text>
        <Text c="dimmed" ta="center" size="sm">
          Nhấn nút "Phân tích" để chạy kiểm tra AI.
        </Text>
      </Modal>
    );
  }

  // Get decision info
  const geminiDecision = aiAnalysis.geminiDecision?.decision;
  const decisionInfo = geminiDecision
    ? decisionConfig[geminiDecision]
    : finalDecisionConfig[aiAnalysis.finalDecision];

  // Get scores from gemini decision
  const scores = aiAnalysis.geminiDecision?.scores;
  const reasons =
    aiAnalysis.geminiDecision?.reasons || aiAnalysis.reasons || [];
  const warnings = aiAnalysis.geminiDecision?.warnings || [];

  // Get perspective scores if available
  const perspectiveScores = aiAnalysis.perspectiveScores;

  // Calculate overall risk score
  const overallRiskScore = scores?.overallRisk
    ? Math.round(scores.overallRisk * 100)
    : 0;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconBrain size={20} />
          <Text fw={600}>Chi tiết phân tích AI</Text>
        </Group>
      }
      size="xl"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="md">
        {/* Story Info */}
        <Box>
          <Text size="sm" c="dimmed">
            Truyện
          </Text>
          <Text fw={600}>{story.title}</Text>
        </Box>

        <Divider />

        {/* Decision Section */}
        <Box>
          <Group gap="xs" mb="xs">
            <IconScoreboard size={16} />
            <Text size="sm" fw={600}>
              Quyết định
            </Text>
          </Group>
          <Group gap="md">
            <Badge size="xl" variant="filled" color={decisionInfo.color}>
              {decisionInfo.label}
            </Badge>
            <Text size="sm" c="dimmed">
              {decisionInfo.description}
            </Text>
          </Group>
        </Box>

        {/* Risk Score Section */}
        {scores && (
          <Box>
            <Group gap="xs" mb="xs">
              <IconScoreboard size={16} />
              <Text size="sm" fw={600}>
                Điểm rủi ro
              </Text>
            </Group>
            <Group gap="md" align="flex-start">
              <Box style={{ flex: 1 }}>
                <Group gap="xs" justify="space-between" mb={4}>
                  <Text size="sm">Rủi ro tổng thể:</Text>
                  <Text
                    size="sm"
                    fw={600}
                    c={getRiskColor(scores.overallRisk || 0)}
                  >
                    {overallRiskScore}%
                  </Text>
                </Group>
                <Progress
                  value={overallRiskScore}
                  color={getRiskColor(scores.overallRisk || 0)}
                  size="lg"
                  radius="xl"
                />
              </Box>
            </Group>
          </Box>
        )}

        {/* Detailed Scores Table */}
        {scores && (
          <Box>
            <Text size="sm" fw={600} mb="xs">
              Chi tiết điểm số
            </Text>
            <Table withTableBorder withColumnBorders variant="simple">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tiêu chí</Table.Th>
                  <Table.Th>Điểm</Table.Th>
                  <Table.Th>Mức độ</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(scores).map(([key, value]) => {
                  if (value === undefined || value === null) return null;
                  const percentage = Math.round(value * 100);
                  return (
                    <Table.Tr key={key}>
                      <Table.Td>
                        <Text size="sm">{getScoreLabel(key)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={600}>
                          {percentage}%
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge
                          size="sm"
                          variant="light"
                          color={getRiskColor(value)}
                        >
                          {value >= 0.7
                            ? "An toàn"
                            : value >= 0.4
                              ? "Trung bình"
                              : "Nguy hiểm"}
                        </Badge>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Box>
        )}

        {/* Perspective Scores (if available) */}
        {perspectiveScores && (
          <Box>
            <Text size="sm" fw={600} mb="xs">
              Điểm Perspective API
            </Text>
            <Table withTableBorder variant="simple" striped>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Tiêu chí</Table.Th>
                  <Table.Th>Điểm</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(perspectiveScores).map(([key, value]) => {
                  if (value === undefined || value === null) return null;
                  const percentage = Math.round(value * 100);
                  return (
                    <Table.Tr key={key}>
                      <Table.Td>
                        <Text size="sm">{getScoreLabel(key)}</Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Progress
                            value={percentage}
                            color={getRiskColor(value)}
                            size="sm"
                            style={{ width: 80 }}
                          />
                          <Text size="sm" fw={500}>
                            {percentage}%
                          </Text>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          </Box>
        )}

        {/* Reasons Section */}
        {reasons.length > 0 && (
          <>
            <Divider />
            <Box>
              <Group gap="xs" mb="xs">
                <IconList size={16} />
                <Text size="sm" fw={600}>
                  Lý do ({reasons.length})
                </Text>
              </Group>
              <Stack gap="xs">
                {reasons.map((reason, index) => (
                  <Box
                    key={index}
                    p="xs"
                    style={{
                      backgroundColor: "var(--mantine-color-gray-0)",
                      borderRadius: 4,
                    }}
                  >
                    <Text size="sm">{reason}</Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}

        {/* Warnings Section */}
        {warnings.length > 0 && (
          <>
            <Divider />
            <Box>
              <Group gap="xs" mb="xs">
                <IconAlertTriangle size={16} color="orange" />
                <Text size="sm" fw={600} c="orange">
                  Cảnh báo ({warnings.length})
                </Text>
              </Group>
              <Stack gap="xs">
                {warnings.map((warning, index) => (
                  <Box
                    key={index}
                    p="xs"
                    style={{
                      backgroundColor: "var(--mantine-color-orange-0)",
                      borderRadius: 4,
                      borderLeft: "3px solid var(--mantine-color-orange-6)",
                    }}
                  >
                    <Text size="sm" c="orange.9">
                      {warning}
                    </Text>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}

        {/* Processing Info */}
        <Divider />
        <Group justify="space-between">
          <Text size="xs" c="dimmed">
            Xử lý lúc:{" "}
            {new Date(aiAnalysis.processedAt).toLocaleString("vi-VN")}
          </Text>
          {aiAnalysis.createdAt !== aiAnalysis.processedAt && (
            <Text size="xs" c="dimmed">
              Tạo: {new Date(aiAnalysis.createdAt).toLocaleString("vi-VN")}
            </Text>
          )}
        </Group>
      </Stack>
    </Modal>
  );
}
