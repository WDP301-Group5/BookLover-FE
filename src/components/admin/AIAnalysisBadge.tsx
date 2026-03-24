// src/components/admin/AIAnalysisBadge.tsx
import { Badge, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";
import type { AIAnalysis } from "../../interfaces/AIAnalysis";
import type { Story } from "../../interfaces/Story";

interface AIAnalysisBadgeProps {
  story: Story;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const decisionConfig = {
  APPROVE: { color: "green", label: "DUYỆT" },
  FLAG: { color: "yellow", label: "THEO DÕI" },
  REJECT: { color: "red", label: "TỪ CHỐI" },
} as const;

const finalDecisionConfig = {
  "auto-approved": { color: "green", label: "Tự duyệt" },
  flagged: { color: "yellow", label: "Theo dõi" },
  "auto-rejected": { color: "red", label: "Tự từ chối" },
  "hard-filter-rejected": { color: "red", label: "Lọc cứng" },
} as const;

/**
 * Get color for AI decision based on scores
 */
function getRiskLevelColor(aiAnalysis?: AIAnalysis): string {
  if (!aiAnalysis?.geminiDecision?.scores) return "gray";
  const scores = aiAnalysis.geminiDecision.scores;
  const riskScore = scores.overallRisk ?? 0;
  if (riskScore >= 0.7) return "green"; // Safe
  if (riskScore >= 0.4) return "yellow"; // Medium risk
  return "red"; // High risk
}

/**
 * Calculate risk score (0-100) from AI scores
 */
function calculateRiskScore(analysis: AIAnalysis): number {
  if (!analysis.geminiDecision?.scores) return 0;

  const { scores } = analysis.geminiDecision;
  // For story metadata, use overallRisk or calculate from individual scores
  if (scores.overallRisk !== undefined) {
    return Math.round(scores.overallRisk * 100);
  }

  // Calculate from individual scores
  const maxScore = Math.max(
    scores.inappropriateName ?? 0,
    scores.inappropriateDescription ?? 0,
    scores.inappropriateGenre ?? 0,
  );
  return Math.round(maxScore * 100);
}

/**
 * AI Analysis Badge Component
 * Shows the AI decision with color coding
 */
export function AIAnalysisBadge({ story, size = "xs" }: AIAnalysisBadgeProps) {
  const { aiAnalysis } = story;

  // No AI analysis yet
  if (!aiAnalysis) {
    return (
      <Badge size={size} variant="outline" color="gray">
        Chưa phân tích
      </Badge>
    );
  }

  // Get the decision to display (prefer gemini decision, fallback to finalDecision)
  const geminiDecision = aiAnalysis.geminiDecision?.decision;

  const config = geminiDecision
    ? decisionConfig[geminiDecision]
    : finalDecisionConfig[aiAnalysis.finalDecision];

  const riskScore = calculateRiskScore(aiAnalysis);

  return (
    <Tooltip
      label={
        <Stack gap={4} p={4}>
          <Text size="xs" fw={600}>
            Phân tích AI
          </Text>
          {aiAnalysis.geminiDecision?.scores && (
            <>
              <Group gap="xs">
                <Text size="xs">Rủi ro:</Text>
                <Progress
                  value={riskScore}
                  color={getRiskLevelColor(aiAnalysis)}
                  size="xs"
                  w={60}
                />
                <Text size="xs">{riskScore}%</Text>
              </Group>
              {aiAnalysis.geminiDecision.reasons.length > 0 && (
                <Text size="xs" c="dimmed">
                  Lý do: {aiAnalysis.geminiDecision.reasons.join(", ")}
                </Text>
              )}
              {aiAnalysis.geminiDecision.warnings &&
                aiAnalysis.geminiDecision.warnings.length > 0 && (
                  <Text size="xs" c="orange">
                    Cảnh báo: {aiAnalysis.geminiDecision.warnings.join(", ")}
                  </Text>
                )}
            </>
          )}
          {aiAnalysis.reasons.length > 0 && (
            <Text size="xs" c="dimmed">
              {aiAnalysis.reasons.join(", ")}
            </Text>
          )}
        </Stack>
      }
    >
      <Badge size={size} variant="filled" color={config.color}>
        {config.label}
      </Badge>
    </Tooltip>
  );
}

/**
 * Risk Score Display Component
 * Shows a progress bar with the risk score
 */
export function AIRiskScore({ story }: { story: Story }) {
  const { aiAnalysis } = story;

  if (!aiAnalysis?.geminiDecision?.scores) {
    return (
      <Text size="xs" c="dimmed">
        Chưa có dữ liệu
      </Text>
    );
  }

  const riskScore = calculateRiskScore(aiAnalysis);
  const color = getRiskLevelColor(aiAnalysis);

  return (
    <Stack gap={2}>
      <Group gap="xs" justify="space-between">
        <Text size="xs" c="dimmed">
          Mức độ rủi ro:
        </Text>
        <Text size="xs" fw={600}>
          {riskScore}%
        </Text>
      </Group>
      <Progress value={riskScore} color={color} size="sm" radius="xl" />
    </Stack>
  );
}

/**
 * AI Warnings Display Component
 * Shows any warnings from the AI analysis
 */
export function AIWarnings({ story }: { story: Story }) {
  const { aiAnalysis } = story;

  const warnings = aiAnalysis?.geminiDecision?.warnings || [];
  const reasons = aiAnalysis?.geminiDecision?.reasons || [];

  if (warnings.length === 0 && reasons.length === 0) {
    return null;
  }

  return (
    <Stack gap={4}>
      {reasons.length > 0 && (
        <div>
          <Text size="xs" c="dimmed" mb={2}>
            Lý do:
          </Text>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {reasons.map((reason, index) => (
              <li key={index}>
                <Text size="xs">{reason}</Text>
              </li>
            ))}
          </ul>
        </div>
      )}
      {warnings.length > 0 && (
        <div>
          <Text size="xs" c="orange" mb={2}>
            Cảnh báo:
          </Text>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {warnings.map((warning, index) => (
              <li key={index}>
                <Text size="xs" c="orange">
                  {warning}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Stack>
  );
}
