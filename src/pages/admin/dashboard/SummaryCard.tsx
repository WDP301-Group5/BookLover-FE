type SummaryCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export default function SummaryCard({
  title,
  value,
  subtitle,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="mt-2 text-2xl font-bold text-gray-900">{value}</h3>
      {subtitle ? (
        <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
      ) : null}
    </div>
  );
}