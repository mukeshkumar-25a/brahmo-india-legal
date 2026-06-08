'use client';

import { IKCase } from '@/lib/types';

export default function IKResearchPanel({ cases, query }: { cases: IKCase[]; query: string }) {
  if (!cases || cases.length === 0) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-white mb-6">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
        <span>📋</span> IK RESEARCH
      </h3>
      <div className="text-sm text-slate-400 mb-4 flex items-center justify-between">
        <span>Found {cases.length} cases for "{query}"</span>
      </div>

      <div className="space-y-3">
        {cases.map((c, i) => (
          <div key={i} className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
            <div className="mt-1 text-blue-400">✅</div>
            <div>
              <div className="text-sm font-bold text-blue-300">
                {c.title} {c.citation ? `[${c.citation}]` : ''}
              </div>
              <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                {c.headline.replace(/<[^>]*>?/gm, '')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
