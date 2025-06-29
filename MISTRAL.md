# MISTRAL.md

This file provides guidance when working with code in this repository.

⚠️ **Important Note**: This project was conceptually migrated from Claude Code to demonstrate the infinite agentic loop pattern. The real [Mistral Code](https://mistral.ai/products/mistral-code) is an IDE extension (not a command-line tool). See `HOW_TO_GET_MISTRAL_CODE.md` for information about the actual Mistral Code product.

## Project Overview

This is an experimental project demonstrating the Infinite Agentic Loop pattern. The project orchestrates multiple AI agents in parallel to generate evolving iterations of themed hybrid UI components based on specifications.

**Note**: This was originally designed for Claude Code's custom slash commands. The migration to "MistralAI Code" is conceptual - to use this with real MistralAI products, you would need to adapt it to work with their IDE extensions and APIs.

## Key Commands

### Running the Infinite Agentic Loop

**Note**: The commands below are conceptual. The real Mistral Code is an IDE extension, not a command-line tool.

```bash
# This is conceptual - real Mistral Code works in your IDE
mistral-code
```

Conceptual command variants (would need adaptation for real Mistral Code APIs):

```bash
# Single generation
/project:infinite specs/invent_new_ui_v3.md src 1

# Small batch (5 iterations)
/project:infinite specs/invent_new_ui_v3.md src_new 5

# Large batch (20 iterations)
/project:infinite specs/invent_new_ui_v3.md src_new 20

# Infinite mode (continuous generation)
/project:infinite specs/invent_new_ui_v3.md infinite_src_new/ infinite
```

## Architecture & Structure

### Command System
**Note**: This configuration is conceptual. Real Mistral Code uses IDE extensions.

The project conceptually uses custom commands:
- `.mistral/commands/infinite.md` - Main infinite loop orchestrator command
- `.mistral/commands/prime.md` - Additional command (if present)  
- `.mistral/settings.json` - Permissions configuration

**For Real Mistral Code**: Install the [VS Code extension](https://marketplace.visualstudio.com/items?itemName=mistralai.mistral-code) or [JetBrains plugin](https://plugins.jetbrains.com/plugin/27493-mistral-code-enterprise).

### Specification-Driven Generation
- Specifications in `specs/` directory define what type of content to generate
- Current main spec: `specs/invent_new_ui_v3.md` - Themed Hybrid UI Component Specification
- Specs define naming patterns, content structure, design dimensions, and quality standards

### Multi-Agent Orchestration Pattern
The infinite command implements sophisticated parallel agent coordination:
1. **Specification Analysis** - Deeply understands the spec requirements
2. **Directory Reconnaissance** - Analyzes existing iterations to maintain uniqueness
3. **Parallel Sub-Agent Deployment** - Launches multiple agents with distinct creative directions
4. **Wave-Based Generation** - For infinite mode, manages successive agent waves
5. **Context Management** - Optimizes context usage across all agents

### Generated Content Organization
- `src/` - Primary output directory for generated UI components
- `src_infinite/` - Alternative output for infinite generation runs
- `legacy/` - Previous iteration attempts and experiments

### Key Implementation Details
- Sub-agents receive complete context including spec, existing iterations, and unique creative assignments
- Parallel execution managed through Task tool with batch sizes optimized by count
- Progressive sophistication strategy for infinite mode waves
- Each iteration must be genuinely unique while maintaining spec compliance