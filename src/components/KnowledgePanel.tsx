'use client';

import { KnowledgeNode } from '@/lib/types';

export default function KnowledgePanel({
  nodes,
  tokenUsage,
  templateName
}: {
  nodes: KnowledgeNode[];
  tokenUsage: { used: number; total: number };
  templateName: string;
}) {
  const percentUsed = Math.round((tokenUsage.used / tokenUsage.total) * 100) || 0;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 text-white my-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span>📋</span> KNOWLEDGE INJECTION PANEL
        </h3>
        {templateName && (
          <div className="bg-emerald-900/50 text-emerald-400 border border-emerald-800 px-3 py-1 rounded text-sm flex items-center gap-2">
            Template: {templateName} <span>✅</span>
          </div>
        )}
      </div>

      <div className="space-y-3 mb-6">
        {nodes.map(node => (
          <div key={node.id} className="flex items-start gap-3 bg-slate-800 p-3 rounded-lg border border-slate-700">
            <div className="mt-1">
              {node.node_type === 'CONSTRAINT' && '⚖️'}
              {node.node_type === 'ANTI_PATTERN' && '🚫'}
              {node.node_type === 'DECISION' && '📜'}
              {node.node_type === 'CLIENT_FACT' && '👤'}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-300">
                {node.node_type} {node.title}:
              </div>
              <div className="text-sm text-slate-400 mt-1">"{node.content}"</div>
            </div>
            <div className="ml-auto text-emerald-400">✅</div>
          </div>
        ))}
        {nodes.length === 0 && (
          <div className="text-slate-500 text-sm italic py-4">No knowledge nodes injected.</div>
        )}
      </div>

      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Token Budget: {tokenUsage.used} / {tokenUsage.total}</span>
          <span className="text-slate-400">{percentUsed}% used</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2.5">
          <div 
            className={`h-2.5 rounded-full ${percentUsed > 90 ? 'bg-orange-500' : 'bg-emerald-500'}`}
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
