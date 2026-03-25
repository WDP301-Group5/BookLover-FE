// src/components/admin/ChapterAIAnalysisBadge.tsx
import { Badge, Group, Progress, Stack, Text, Tooltip } from "@mantine/core";
import type { AIAnalysis } from "../../services/AdminChapterCensorService";

interface ChapterAIAnalysisBadgeProps {
  aiAnalysis?: AIAnalysis | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const decisionConfig = {
  APPROVE: { color: "green", label: "An toàn" },
  FLAG: { color: "yellow", label: "Cần xem xét" },
  REJECT: { color: "red", label: "Rủi ro" },
} as const;

const finalDecisionConfig = {
  safe: { color: "green", label: "An toàn" },
  review: { color: "yellow", label: "Cần xem xét" },
  risky: { color: "red", label: "Rủi ro cao" },
  "hard-filter-rejected": { color: "red", label: "Lọc cứng" },
} as const;

/**
 * Get color for AI decision based on scores
 * Score represents risk level: higher = more dangerous
 * - score >= 0.7 means HIGH risk -> red
 * - score >= 0.4 means MEDIUM risk -> yellow
 * - score < 0.4 means LOW risk -> green
 */
function getRiskLevelColor(aiAnalysis?: AIAnalysis): string {
  if (!aiAnalysis?.geminiDecision?.scores) return "gray";
  const scores = aiAnalysis.geminiDecision.scores;
  const maxScore = Math.max(
    scores.toxicity ?? 0,
    scores.sexual ?? 0,
    scores.violence ?? 0,
    scores.political ?? 0,
  );
  if (maxScore >= 0.7) return "red"; // High risk
  if (maxScore >= 0.4) return "yellow"; // Medium risk
  return "green"; // Low risk
}

/**
 * Calculate risk score (0-100) from AI scores
 * Returns safety score where higher = safer
 */
function calculateRiskScore(analysis: AIAnalysis): number {
  if (!analysis.geminiDecision?.scores) return 0;

  const { scores } = analysis.geminiDecision;
  const maxScore = Math.max(
    scores.toxicity ?? 0,
    scores.sexual ?? 0,
    scores.violence ?? 0,
    scores.political ?? 0,
  );
  return Math.round((1 - maxScore) * 100);
}

/**
 * Chapter AI Analysis Badge Component
 * Shows the AI decision with color coding
 */
export function ChapterAIAnalysisBadge({
  aiAnalysis,
  size = "xs",
}: ChapterAIAnalysisBadgeProps) {
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
                <Text size="xs">An toàn:</Text>
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
 * Risk Score Display Component for chapters
 * Shows a progress bar with the risk score
 */
export function ChapterAIRiskScore({
  aiAnalysis,
}: {
  aiAnalysis?: AIAnalysis | null;
}) {
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
          Mức độ an toàn:
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
 * AI Warnings Display Component for chapters
 * Shows any warnings from the AI analysis
 */
export function ChapterAIWarnings({
  aiAnalysis,
}: {
  aiAnalysis?: AIAnalysis | null;
}) {
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
