-- BRAHMO Legal AI Schema

CREATE TABLE IF NOT EXISTS legal_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id VARCHAR(100) UNIQUE NOT NULL,
    jurisdiction VARCHAR(50) DEFAULT 'IN',
    practice_area VARCHAR(50) NOT NULL, -- 'criminal', 'corporate', etc.
    document_type VARCHAR(100) NOT NULL,
    court_type VARCHAR(50) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    system_prompt TEXT NOT NULL,
    auto_research_query TEXT,
    quality_checks JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_type VARCHAR(50) NOT NULL, -- 'CONSTRAINT', 'ANTI_PATTERN', 'DECISION', 'CLIENT_FACT'
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    practice_area VARCHAR(50) NOT NULL,
    tags JSONB DEFAULT '[]'::jsonb,
    client_id VARCHAR(100),
    matter_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS section_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    old_section VARCHAR(50) NOT NULL,
    new_section VARCHAR(50) NOT NULL,
    old_act VARCHAR(100) NOT NULL,
    new_act VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS court_formats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_code VARCHAR(50) UNIQUE NOT NULL,
    court_name VARCHAR(255) NOT NULL,
    header_template TEXT NOT NULL,
    party_format TEXT NOT NULL,
    closing_format TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ik_case_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_query TEXT UNIQUE NOT NULL,
    results JSONB NOT NULL,
    searched_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
