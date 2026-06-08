-- Seed Data for BRAHMO Legal AI

-- 1. Section Mappings
INSERT INTO section_mappings (old_section, new_section, old_act, new_act) VALUES
('Section 302 IPC', 'Section 101 BNS', 'IPC', 'BNS'),
('Section 304 IPC', 'Section 105 BNS', 'IPC', 'BNS'),
('Section 304A IPC', 'Section 106 BNS', 'IPC', 'BNS'),
('Section 304B IPC', 'Section 80 BNS', 'IPC', 'BNS'),
('Section 306 IPC', 'Section 108 BNS', 'IPC', 'BNS'),
('Section 307 IPC', 'Section 109 BNS', 'IPC', 'BNS'),
('Section 323 IPC', 'Section 115 BNS', 'IPC', 'BNS'),
('Section 326 IPC', 'Section 119 BNS', 'IPC', 'BNS'),
('Section 354 IPC', 'Section 74 BNS', 'IPC', 'BNS'),
('Section 376 IPC', 'Section 63 BNS', 'IPC', 'BNS'),
('Section 379 IPC', 'Section 303 BNS', 'IPC', 'BNS'),
('Section 384 IPC', 'Section 308 BNS', 'IPC', 'BNS'),
('Section 392 IPC', 'Section 309 BNS', 'IPC', 'BNS'),
('Section 406 IPC', 'Section 316 BNS', 'IPC', 'BNS'),
('Section 420 IPC', 'Section 318 BNS', 'IPC', 'BNS'),
('Section 467 IPC', 'Section 336 BNS', 'IPC', 'BNS'),
('Section 498A IPC', 'Section 85 BNS', 'IPC', 'BNS'),
('Section 499 IPC', 'Section 356 BNS', 'IPC', 'BNS'),
('Section 506 IPC', 'Section 351 BNS', 'IPC', 'BNS'),
('Section 34 IPC', 'Section 3(5) BNS', 'IPC', 'BNS'),
('Section 120B IPC', 'Section 61 BNS', 'IPC', 'BNS'),
('Section 125 CrPC', 'Section 144 BNSS', 'CrPC', 'BNSS'),
('Section 154 CrPC', 'Section 173 BNSS', 'CrPC', 'BNSS'),
('Section 156(3) CrPC', 'Section 175(3) BNSS', 'CrPC', 'BNSS'),
('Section 167 CrPC', 'Section 187 BNSS', 'CrPC', 'BNSS'),
('Section 437 CrPC', 'Section 480 BNSS', 'CrPC', 'BNSS'),
('Section 438 CrPC', 'Section 482 BNSS', 'CrPC', 'BNSS'),
('Section 439 CrPC', 'Section 483 BNSS', 'CrPC', 'BNSS'),
('Section 482 CrPC', 'Section 528 BNSS', 'CrPC', 'BNSS'),
('Section 65B IEA', 'Section 63 BSA', 'IEA', 'BSA');

-- 2. Knowledge Nodes
INSERT INTO knowledge_nodes (node_type, title, content, practice_area, tags, client_id, matter_id) VALUES
('CONSTRAINT', 'C-001', 'Standard bail argument sequence: cooperation with investigation first, then no flight risk, then no evidence tampering, then parity with co-accused.', 'criminal', '["bail", "argument_sequence"]', NULL, NULL),
('CONSTRAINT', 'C-002', 'For bail applications, always include undertaking to surrender passport if client has foreign travel history.', 'criminal', '["bail", "passport"]', NULL, NULL),
('CONSTRAINT', 'C-003', 'NEVER argue ''Section 482 is not a bar on bail'' as primary argument — Delhi HC judges find this patronizing.', 'criminal', '["bail", "delhi"]', NULL, NULL),
('CONSTRAINT', 'C-004', 'All NDAs must include carve-out for legally compelled disclosure per firm policy.', 'corporate', '["nda", "contract"]', NULL, NULL),
('CONSTRAINT', 'C-005', 'For divorce petitions, always verify whether client has filed DV Act complaint — impacts maintenance strategy.', 'family', '["divorce", "dv_act"]', NULL, NULL),
('ANTI_PATTERN', 'AP-001', 'Don''t cite Siddharth v. State of UP (2021) 10 SCC 1 without distinguishing the facts — judges have started pushing back on blanket Siddharth citations in economic offence bail.', 'criminal', '["bail", "citation"]', NULL, NULL),
('ANTI_PATTERN', 'AP-002', 'In economic offence bail, don''t lead with ''no flight risk'' — lead with ''cooperation with investigation'' because courts view flight risk as less relevant when accused has cooperated.', 'criminal', '["bail", "economic_offence"]', NULL, NULL),
('ANTI_PATTERN', 'AP-003', 'Don''t draft NDA with unlimited indemnity for Indian startups — investors flag this in DD. Cap at 1x contract value.', 'corporate', '["nda", "indemnity"]', NULL, NULL),
('ANTI_PATTERN', 'AP-004', 'In RERA complaints, don''t claim 18% interest — RERA authorities consistently cap at SBI PLR + 2%.', 'property', '["rera", "interest"]', NULL, NULL),
('DECISION', 'D-001', 'Malhotra anticipatory bail (2026): GRANTED by Justice Mehta, Delhi HC. Winning strategy: led with cooperation argument (3 police notices) + forensic audit showed legitimate expenses. Judge: ''blanket denial in economic offences is not the law.''', 'criminal', '["bail", "granted", "delhi", "section_318"]', NULL, NULL),
('DECISION', 'D-002', 'Gupta anticipatory bail (2025): DENIED. Judge noted accused had not appeared for ANY police notices. Lesson: always ensure 2-3 police appearances before filing bail.', 'criminal', '["bail", "denied", "lesson"]', NULL, NULL),
('DECISION', 'D-003', 'FSL report delay (2025): Bail GRANTED partly because FSL report pending 45 days. Citing investigation delay strengthened argument significantly.', 'criminal', '["bail", "granted", "strategy"]', NULL, NULL),
('DECISION', 'D-004', 'Sharma divorce (2026): Maintenance at 25% of husband''s income. Court rejected 40% claim citing working wife''s income. Lesson: factor wife''s earning capacity.', 'family', '["divorce", "maintenance"]', NULL, NULL),
('DECISION', 'D-005', 'TechCorp NDA (2026): Client lost trade secret protection — NDA had no ''return of materials'' clause. Now mandatory: every NDA must include return/destruction of materials.', 'corporate', '["nda", "lesson"]', NULL, NULL),
('DECISION', 'D-006', 'RERA Ganesh Heights (2025): Complaint dismissed — buyer hadn''t sent legal notice before filing. Now mandatory: legal notice 30 days before RERA complaint.', 'property', '["rera", "dismissed", "lesson"]', NULL, NULL),
('DECISION', 'D-007', 'Ravi Investments NCLT (2025): Petition under Section 241 allowed. Tribunal noted systematic exclusion from board meetings + dividend suppression. Key: 2 years of exclusion emails documented.', 'corporate', '["nclt", "oppression", "granted"]', NULL, NULL),
('DECISION', 'D-008', 'Kapoor FIR quashing (2026): FIR under Section 318 BNS quashed by Delhi HC under Section 528 BNSS. Ground: purely civil dispute dressed as criminal complaint.', 'criminal', '["quashing", "granted", "528"]', NULL, NULL),
('CLIENT_FACT', 'CF-001', 'Client Rajesh Kumar: first-time offender, no prior criminal record.', 'criminal', '[]', 'client_rajesh', 'matter_bail_001'),
('CLIENT_FACT', 'CF-002', 'Client Rajesh Kumar: cooperated with investigation — appeared for 3 police notices (15 Jan, 22 Jan, 5 Feb 2026).', 'criminal', '[]', 'client_rajesh', 'matter_bail_001'),
('CLIENT_FACT', 'CF-003', 'Client Rajesh Kumar: owns property worth ₹2 Cr in Delhi — strong community roots.', 'criminal', '[]', 'client_rajesh', 'matter_bail_001'),
('CLIENT_FACT', 'CF-004', 'Client TechCorp: Series B startup, $5M raised, 45 employees. NDA for vendor data sharing with US cloud provider.', 'corporate', '[]', 'client_techcorp', 'matter_nda_001'),
('CLIENT_FACT', 'CF-005', 'Client Ravi Investments: 15% minority shareholder, documented emails showing exclusion from board since March 2024.', 'corporate', '[]', 'client_ravi', 'matter_nclt_001');

-- 3. Court Formats
INSERT INTO court_formats (court_code, court_name, header_template, party_format, closing_format) VALUES
('delhi_hc', 'Delhi High Court', 'IN THE HIGH COURT OF DELHI AT NEW DELHI\n{case_type} No. ___ of {year}\n(Under Section {section})', '{accused_name} S/o {father_name}\nR/o {address}\n...Applicant\n\nVersus\n\nState of NCT of Delhi\n...Respondent', 'AND FOR THIS ACT OF KINDNESS, THE APPLICANT AS IN DUTY BOUND SHALL EVER PRAY.'),
('sessions_court', 'Sessions Court Patiala House', 'IN THE COURT OF SESSIONS JUDGE\nPATIALA HOUSE COURTS, NEW DELHI\nSESSIONS CASE No. ___ of {year}', '{accused_name}\n...Applicant\n\nVersus\n\nState\n...Respondent', 'It is therefore respectfully prayed that the applicant may be enlarged on bail.'),
('nclt_delhi', 'National Company Law Tribunal Delhi Bench', 'BEFORE THE NATIONAL COMPANY LAW TRIBUNAL\nNEW DELHI BENCH\nCP No. (IB)-___/ND/{year}', '{petitioner_name}\n...Petitioner\n\nVersus\n\n{respondent_name}\n...Respondent', 'In view of the facts and circumstances, the Petitioner prays for the reliefs as sought.');

-- 4. Legal Templates
INSERT INTO legal_templates (template_id, practice_area, document_type, court_type, display_name, system_prompt, auto_research_query) VALUES
('IN_CRIMINAL_BAIL_ANTICIPATORY_HC', 'criminal', 'anticipatory_bail', 'high_court', 'Anticipatory Bail - High Court', 'You are an expert Indian criminal defense lawyer drafting an anticipatory bail application for the High Court. Use the following firm knowledge:\n\nCONSTRAINTS:\n{INJECTION_CONSTRAINTS}\n\nANTI-PATTERNS (Avoid these):\n{INJECTION_ANTI_PATTERNS}\n\nPAST DECISIONS:\n{INJECTION_DECISIONS}\n\nCLIENT FACTS:\n{INJECTION_CLIENT_FACTS}\n\nRESEARCH:\n{INJECTION_RESEARCH}\n\nFormat the output correctly using standard Indian court formatting.', 'anticipatory bail Section 482 BNSS Delhi High Court'),
('IN_CRIMINAL_FIR_QUASHING_HC', 'criminal', 'fir_quashing', 'high_court', 'FIR Quashing - High Court', 'You are an expert Indian criminal defense lawyer drafting an FIR quashing petition under Section 528 BNSS. Use the following firm knowledge:\n\nCONSTRAINTS:\n{INJECTION_CONSTRAINTS}\n\nANTI-PATTERNS (Avoid these):\n{INJECTION_ANTI_PATTERNS}\n\nPAST DECISIONS:\n{INJECTION_DECISIONS}\n\nCLIENT FACTS:\n{INJECTION_CLIENT_FACTS}\n\nRESEARCH:\n{INJECTION_RESEARCH}\n\nFormat the output correctly using standard Indian court formatting.', 'FIR quashing Section 528 BNSS grounds Delhi'),
('IN_CORPORATE_NDA', 'corporate', 'nda_review', 'na', 'NDA Review', 'You are an expert Indian corporate lawyer drafting/reviewing a Non-Disclosure Agreement. Use the following firm knowledge:\n\nCONSTRAINTS:\n{INJECTION_CONSTRAINTS}\n\nANTI-PATTERNS (Avoid these):\n{INJECTION_ANTI_PATTERNS}\n\nPAST DECISIONS:\n{INJECTION_DECISIONS}\n\nCLIENT FACTS:\n{INJECTION_CLIENT_FACTS}\n\nRESEARCH:\n{INJECTION_RESEARCH}\n\nEnsure compliance with Indian Contract Act and corporate standards.', 'Indian Contract Act Section 27 restraint of trade'),
('IN_CORPORATE_NCLT_PETITION', 'corporate', 'nclt_petition', 'tribunal', 'NCLT Petition (Section 241)', 'You are an expert Indian corporate lawyer drafting an NCLT petition under Section 241 of the Companies Act, 2013 for oppression and mismanagement. Use the following firm knowledge:\n\nCONSTRAINTS:\n{INJECTION_CONSTRAINTS}\n\nANTI-PATTERNS (Avoid these):\n{INJECTION_ANTI_PATTERNS}\n\nPAST DECISIONS:\n{INJECTION_DECISIONS}\n\nCLIENT FACTS:\n{INJECTION_CLIENT_FACTS}\n\nRESEARCH:\n{INJECTION_RESEARCH}\n\nFormat the output correctly for the NCLT tribunal.', 'Section 241 Companies Act NCLT oppression');
