'use client';

interface LevelData {
  title: string;
  subtitle: string;
  score: string;
  content: string;
  isLoading: boolean;
}

export default function ThreeLevelComparison({
  level1,
  level2,
  level3
}: {
  level1: LevelData;
  level2: LevelData;
  level3: LevelData;
}) {
  const Column = ({ data, levelClass }: { data: LevelData; levelClass: string }) => (
    <div className={`flex flex-col h-full bg-slate-900 border ${levelClass} rounded-xl overflow-hidden`}>
      <div className={`p-4 border-b ${levelClass} bg-slate-800`}>
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-bold text-lg text-white">{data.title}</h3>
          <span className="bg-slate-700 text-slate-200 px-2 py-1 rounded text-sm font-mono">
            Score: {data.score}
          </span>
        </div>
        <p className="text-slate-400 text-sm">{data.subtitle}</p>
      </div>
      <div className="p-4 flex-grow overflow-y-auto min-h-[400px] max-h-[600px] whitespace-pre-wrap font-serif text-slate-300 text-sm">
        {data.isLoading ? (
          <div className="flex items-center justify-center h-full text-slate-500 animate-pulse">
            Generating...
          </div>
        ) : (
          data.content || "Ready to generate."
        )}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
      <Column data={level1} levelClass="border-slate-700" />
      <Column data={level2} levelClass="border-blue-800" />
      <Column data={level3} levelClass="border-emerald-600 ring-2 ring-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" />
    </div>
  );
}
