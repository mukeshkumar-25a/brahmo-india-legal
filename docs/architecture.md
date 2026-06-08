# BRAHMO Legal AI - Option C Architecture

## Overview
This system implements the "Option C" legal AI engine capable of handling multiple practice areas (Criminal, Corporate, Family, Property) using a single, unified database schema.

## Scalability Approach

### "Adding Family Law Tomorrow"
If we need to add Family Law tomorrow, the process requires **ZERO code changes**. 

Here is the exact step-by-step process:
1. **Add Templates**: Insert new rows into `legal_templates` with `practice_area = 'family'`.
   - e.g., `document_type = 'divorce_petition'`, `court_type = 'family_court'`.
2. **Add Knowledge Nodes**: Insert firm-specific rules into `knowledge_nodes`.
   - e.g., `node_type = 'DECISION'`, `practice_area = 'family'`, `tags = ["maintenance", "divorce"]`.
3. **Add Court Formats**: Insert the Family Court formatting rules into `court_formats`.
4. **Add Section Mappings**: Insert any required mappings (e.g., Hindu Marriage Act specific normalizations) into `section_mappings`.

The `Template Selector` LLM prompt automatically infers "family" and "divorce" from natural language, mapping to the new rows seamlessly.

## Relevance Ranking & Injection
We use a hybrid ranking system:
1. **Filtering**: The database query strictly isolates nodes by `practice_area` (preventing corporate nodes from bleeding into criminal cases), OR specifically by `client_id` (so universal client facts always inject).
2. **Scoring**: A keyword heuristic matches `tags` and `title` to the user's natural language query.
3. **Token Budgeting**: A strict priority-based truncator iterates through nodes (CONSTRAINT -> ANTI_PATTERN -> DECISION -> CLIENT_FACT) until 3,000 tokens are exhausted.

## Three-Level Generation
The application makes 3 discrete LLM calls to isolate the quality improvements:
1. **Level 1**: LLM is given only the raw user query. (Vulnerable to generic arguments and outdated IPC laws).
2. **Level 2**: LLM is given the `system_prompt` from `legal_templates`, but with all `{INJECTION_*}` markers empty. (Achieves correct court format but lacks firm strategy).
3. **Level 3**: The Knowledge Injection engine fully populates the `{INJECTION_*}` markers with relevant constraints, decisions, and IK research. (The true "Option C").

All three outputs are passed through the `Section Normalizer` engine to catch and autocorrect any rogue IPC/CrPC hallucinations back to BNS/BNSS.
