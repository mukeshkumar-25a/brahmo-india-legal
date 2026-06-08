'use client';

import { useState } from 'react';

export interface Matter {
  id: string;
  client_id: string;
  name: string;
  client: string;
  practice: string;
  court: string;
  charge: string;
  status: string;
  query: string;
}

export const PRELOADED_MATTERS: Matter[] = [
  {
    id: 'matter_bail_001',
    client_id: 'client_rajesh',
    name: 'Bail Application',
    client: 'Rajesh Kumar, 45M',
    practice: 'Criminal',
    court: 'Delhi High Court',
    charge: 'Section 318 BNS (cheating) | FIR 189/2026, PS Saket',
    status: 'First-time offender, cooperated (3 police notices)',
    query: 'Draft anticipatory bail for client Rajesh Kumar accused Section 318 BNS, FIR 189/2026, PS Saket. First-time offender, cooperated with 3 police notices.'
  },
  {
    id: 'matter_quash_001',
    client_id: 'client_anil',
    name: 'FIR Quashing',
    client: 'Anil Verma, 52M',
    practice: 'Criminal',
    court: 'Delhi High Court',
    charge: 'Section 351 BNS + Section 61 BNS | FIR 312/2026, PS Mehrauli',
    status: 'Alleges civil dispute dressed as criminal',
    query: 'Draft FIR quashing petition for Anil Verma under Section 528 BNSS. Sections 351 and 61 BNS, FIR 312/2026, PS Mehrauli. Purely civil dispute.'
  },
  {
    id: 'matter_theft_001',
    client_id: 'client_suresh',
    name: 'Affordable Defense',
    client: 'Suresh, 28M',
    practice: 'Criminal',
    court: 'Sessions Court, Patiala House',
    charge: 'Section 303 BNS (theft) | FIR 445/2026, PS CP',
    status: 'Daily wage laborer, needs legal aid',
    query: 'Draft bail application for Suresh, daily wage laborer under Section 303 BNS. First-time offender, requires legal aid consideration.'
  },
  {
    id: 'matter_nda_001',
    client_id: 'client_techcorp',
    name: 'NDA Review',
    client: 'TechCorp Pvt Ltd',
    practice: 'Corporate',
    court: 'N/A',
    charge: 'Vendor data sharing NDA with US cloud provider',
    status: 'Series B startup',
    query: 'Review and draft NDA for TechCorp Pvt Ltd sharing vendor data with a US cloud provider. Ensure protection of trade secrets.'
  },
  {
    id: 'matter_nclt_001',
    client_id: 'client_ravi',
    name: 'Shareholder Dispute',
    client: 'Ravi Investments',
    practice: 'Corporate',
    court: 'NCLT Delhi Bench',
    charge: 'Section 241 Companies Act — minority oppression',
    status: '15% minority shareholder',
    query: 'Draft NCLT petition under Section 241 Companies Act for Ravi Investments. Minority shareholder (15%) facing systematic exclusion from board.'
  },
  {
    id: 'matter_overlap_001',
    client_id: 'client_vikram',
    name: 'Criminal + Corporate Overlap',
    client: 'Vikram Mehta, 48M',
    practice: 'Criminal + Corporate',
    court: 'Delhi HC + NCLT',
    charge: 'Sec 318 BNS + Sec 241 Companies Act',
    status: 'Criminal fraud + corporate proceedings',
    query: 'Draft strategy combining anticipatory bail for Section 318 BNS and NCLT defense under Section 241 for Vikram Mehta.'
  }
];

export default function MatterCard({ onSelect }: { onSelect: (matter: Matter) => void }) {
  const [selected, setSelected] = useState<Matter | null>(PRELOADED_MATTERS[0]);

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const matter = PRELOADED_MATTERS.find(m => m.id === e.target.value) || null;
    setSelected(matter);
    if (matter) onSelect(matter);
  };

  return (
    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="bg-blue-600 px-2 py-1 rounded text-sm">BRAHMO</span>
        Select Legal Matter
      </h2>
      
      <select 
        className="w-full bg-slate-800 border border-slate-600 rounded-lg p-3 mb-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
        onChange={handleSelect}
        value={selected?.id}
      >
        {PRELOADED_MATTERS.map(m => (
          <option key={m.id} value={m.id}>[Matter: {m.name}] - {m.client}</option>
        ))}
      </select>

      {selected && (
        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300 bg-slate-800 p-4 rounded-lg">
          <div><strong className="text-slate-400">Practice:</strong> {selected.practice}</div>
          <div><strong className="text-slate-400">Court:</strong> {selected.court}</div>
          <div className="col-span-2"><strong className="text-slate-400">Charge/Topic:</strong> {selected.charge}</div>
          <div className="col-span-2"><strong className="text-slate-400">Status:</strong> {selected.status}</div>
        </div>
      )}
    </div>
  );
}
