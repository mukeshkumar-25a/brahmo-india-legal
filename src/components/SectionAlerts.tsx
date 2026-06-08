'use client';

export default function SectionAlerts({ replacements }: { replacements: { old: string; new: string }[] }) {
  if (!replacements || replacements.length === 0) return null;

  return (
    <div className="bg-orange-950 border border-orange-800 rounded-xl p-4 text-orange-200 mb-6">
      <h3 className="font-bold flex items-center gap-2 mb-2">
        <span>⚠️</span> SECTION NORMALIZER ACTIVE
      </h3>
      <p className="text-sm mb-3">
        The AI generated outdated IPC/CrPC references. They have been automatically converted to BNS/BNSS.
      </p>
      <ul className="text-sm space-y-1 list-disc list-inside opacity-90">
        {replacements.map((r, i) => (
          <li key={i}>
            <span className="line-through opacity-70">{r.old}</span> → <span className="font-bold">{r.new}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
