---
description: Guidelines for creating and maintaining Cline rules to ensure consistency and effectiveness.
globs: .cline/rules/*.md
alwaysApply: true
---

- **Required Rule Structure:**
  ```markdown
  ---
  description: Clear, one-line description of what the rule enforces
  globs: path/to/files/*.ext, other/path/**/*
  alwaysApply: boolean
  ---

  - **Main Points in Bold**
    - Sub-points with details
    - Examples and explanations
  ```

- **File References:**
  - Use `[filename](mdc:path/to/file)` ([filename](mdc:filename)) to reference files
  - Example: [prisma.md](.clinerules/prisma.md) for rule references
  - Example: [schema.prisma](mdc:prisma/schema.prisma) for code references

- **Code Examples:**
  - Use language-specific code blocks
  ```typescript
  // ✅ DO: Show good examples
  const goodExample = true;
  
  // ❌ DON'T: Show anti-patterns
  const badExample = false;
  ```

- **Rule Content Guidelines:**
  - Start with high-level overview
  - Include specific, actionable requirements
  - Show examples of correct implementation
  - Reference existing code when possible
  - Keep rules DRY by referencing other rules

- **Rule Maintenance:**
  - Update rules when new patterns emerge
  - Add examples from actual codebase
  - Remove outdated patterns
  - Cross-reference related rules

- **Best Practices:**
  - Use bullet points for clarity
  - Keep descriptions concise
  - Include both DO and DON'T examples
  - Reference actual code over theoretical examples
  - Use consistent formatting across rules 

**Project Rules**
 - Always use Chakra UI (v2) for component markup, never v3.
 - Always keep the design minimal but good looking
 - Use Context7 MCP Tool to always gather latest documentation / knowledge about a library
 - Use Firecrawl MCP Tool to search / scrape web pages whenever necessary
 - Leverage the context7 API tool as your main discovery engine for UI primitives, tokens, and unknown packages. Cross-reference the context when you need more advanced usage access tutorials. If needed.
 - Maintain a tasks.json file for high level tasks that need step by step implementation and always update task completion status after completing implementation of a task. 
