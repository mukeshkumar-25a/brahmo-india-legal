# BRAHMO Legal AI: Template & Knowledge Injection Engine (Option C)

This repository contains the solution for the BRAHMO Lead Full-Stack Developer Assessment. It is a legal AI application designed for Indian Criminal and Corporate Law that bridges the gap between generic AI outputs and firm-specific expertise.

## 🚀 Project Overview

The system features a 3-level output comparison:
*   **Level 1 (Raw AI):** Generic law interpretation with no specific formatting.
*   **Level 2 (Template Only):** Injects court-specific formats (e.g., Delhi High Court) and structured legal frameworks.
*   **Level 3 (Template + Firm Knowledge):** The "Option C" system. It injects firm-specific strategies (Constraints, Decisions, Anti-patterns), applies Indian Kanoon case precedents, and normalizes outdated IPC sections to the new BNS/BNSS codes.

## 🛠 Tech Stack

*   **Frontend & Backend:** Next.js (App Router), React, TypeScript, Tailwind CSS
*   **Database:** Supabase (PostgreSQL)
*   **AI Engine:** Google Gemini (auto-fallback mechanism) / Anthropic Claude / OpenAI
*   **Legal Data API:** Indian Kanoon API (with mock fallback)

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   A [Supabase](https://supabase.com/) free account
*   An LLM API Key (Google Gemini / OpenAI / Anthropic)
*   An [Indian Kanoon API](https://api.indiankanoon.org/) Key (optional for testing)

## 💻 Installation & Setup

**1. Clone the repository:**
```bash
git clone https://github.com/mukeshkumar-25a/brahmo-india-legal.git
cd brahmo-india-legal
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure Environment Variables:**
Create a `.env.local` file in the root directory and add the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Add your preferred LLM provider key (The system auto-detects Gemini vs OpenAI vs Anthropic)
LLM_API_KEY=your_llm_api_key

# Optional: For real-time case law injection
IK_API_KEY=your_indian_kanoon_api_key
```

**4. Setup the Supabase Database:**
1. Navigate to your Supabase project dashboard.
2. Open the **SQL Editor**.
3. Copy the contents of `supabase/schema.sql` and run it to create the unified tables.
4. Copy the contents of `supabase/seed.sql` and run it to populate the firm knowledge and templates.
5. **Important:** Ensure Row Level Security (RLS) is disabled for the tables (`legal_templates`, `knowledge_nodes`, etc.) or that you have created policies to allow public reads during development.

**5. Start the Application:**
```bash
npm run dev
```
Navigate to `http://localhost:3000` in your browser.

## 🏗 Architecture & Scalability

This system uses a **Database-Driven Architecture**. The `legal_templates`, `knowledge_nodes`, and `court_formats` tables are completely unified. 

**How to add "Family Law" tomorrow without writing code:**
1. **Add Templates**: Insert new rows into `legal_templates` with `practice_area = 'family'`.
2. **Add Knowledge Nodes**: Insert firm-specific rules into `knowledge_nodes` tagged with `family`.
3. **Add Court Formats**: Insert the Family Court formatting rules into `court_formats`.

The LLM orchestrator automatically parses natural language to find the matching template, ranks the relevant firm knowledge by priority (truncating safely within token budgets), and injects the context directly into the prompt stream.
