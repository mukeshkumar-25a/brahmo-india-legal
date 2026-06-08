// Database Types
export interface LegalTemplate {
  id: string;
  template_id: string;
  jurisdiction: string;
  practice_area: 'criminal' | 'corporate' | 'family' | 'property';
  document_type: string;
  court_type: string;
  display_name: string;
  system_prompt: string;
  auto_research_query: string;
  quality_checks: any[];
}

export interface KnowledgeNode {
  id: string;
  node_type: 'CONSTRAINT' | 'ANTI_PATTERN' | 'DECISION' | 'CLIENT_FACT';
  title: string;
  content: string;
  practice_area: string;
  tags: string[];
  client_id?: string;
  matter_id?: string;
}

export interface SectionMapping {
  old_section: string;
  new_section: string;
  old_act: string;
  new_act: string;
}

export interface CourtFormat {
  court_code: string;
  court_name: string;
  header_template: string;
  party_format: string;
  closing_format: string;
}

export interface IKCase {
  docid: number;
  title: string;
  headline: string;
  citation?: string;
  court?: string;
  date?: string;
}

// Request / Response Types
export interface ClassifyQueryRequest {
  query: string;
}

export interface ClassifyQueryResponse {
  practice_area: string;
  document_type: string;
  court_type: string;
  template_id?: string;
}

export interface InjectKnowledgeRequest {
  query: string;
  template_id: string;
  client_id?: string;
  matter_id?: string;
}

export interface InjectKnowledgeResponse {
  enriched_prompt: string;
  injected_nodes: KnowledgeNode[];
  token_usage: {
    used: number;
    total: number;
  };
}

export interface IndianKanoonRequest {
  query: string;
}

export interface IndianKanoonResponse {
  cases: IKCase[];
}

export interface NormalizeSectionsRequest {
  text: string;
}

export interface NormalizeSectionsResponse {
  normalized_text: string;
  replacements: { old: string; new: string }[];
}
