interface PieChartProps {
  data: number[];
  title?: string;
}

export default function PieChart({ data, title = 'Transaktioner 12 mån' }: PieChartProps) {
  const [buy, sell] = data;
  const total = buy + sell;

  if (total === 0) {
    return null;
  }

  const buyDeg = (buy / total) * 360;
  const style = {
    background: `conic-gradient(#22c55e 0deg ${buyDeg}deg, #F44336 ${buyDeg}deg 360deg)`,
  } as const;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>

      <div className="relative w-48 h-48">
        <div className="w-full h-full rounded-full" style={style} />
        <div className="absolute inset-4 bg-white rounded-full" />
      </div>

      <div className="flex justify-center mt-2 space-x-4 text-sm">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-full bg-green-500" />
          <span>{buy} Förvärv</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-full bg-red-500" />
          <span>{sell} Avyttring</span>
        </div>
      </div>
    </div>
  );
}
