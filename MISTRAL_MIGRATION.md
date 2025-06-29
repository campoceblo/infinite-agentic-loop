# MistralAI Migration Guide

## Overview

This project has been successfully migrated from Claude Code to MistralAI Code. The core functionality remains the same - an infinite agentic loop pattern that orchestrates multiple AI agents in parallel to generate evolving iterations of themed hybrid UI components.

## Changes Made

### Directory Structure
- **Removed**: `.claude/` directory
- **Added**: `.mistral/` directory with identical structure
- **Updated**: All configuration files to reference MistralAI instead of Claude

### Configuration Files
- `.mistral/settings.json` - Permissions configuration
- `.mistral/commands/infinite.md` - Main infinite loop orchestrator command
- `.mistral/commands/prime.md` - Context priming command

### Documentation Updates
- `MISTRAL.md` (renamed from `CLAUDE.md`) - Main guidance document
- `README.md` - Updated all references to MistralAI
- `ai_docs/mistral_code_fresh_tutorials.md` - MistralAI-specific tutorials

### Command Interface
The command interface remains the same but now uses MistralAI:
```bash
mistral-code
/project:infinite specs/invent_new_ui_v3.md src 1
```

## MistralAI-Specific Adaptations

### Parallel Agent Orchestration
The infinite command has been adapted to leverage MistralAI's capabilities:
- Uses `create_and_run_task` for parallel execution
- Optimized context management for MistralAI's architecture
- Wave-based generation for infinite mode

### Agent Task Distribution
Each MistralAI agent receives:
1. Complete specification analysis
2. Directory state snapshot
3. Unique iteration assignment
4. Specific creative direction
5. Quality standards and requirements

### Context Management
- Progressive context optimization across waves
- Strategic pruning of less essential details
- Fresh agent instances for each wave to avoid accumulation

## Usage Instructions

1. **Start MistralAI Code**: `mistral-code`
2. **Run Commands**: Use `/project:infinite` with the same arguments as before
3. **Configuration**: All settings are in `.mistral/settings.json`
4. **Commands**: Custom commands are in `.mistral/commands/`

## Compatibility Notes

- All existing specifications (`specs/`) work unchanged
- Output directories (`src/`, `src_infinite/`, etc.) remain compatible
- Generated UI components maintain the same format and structure
- Command arguments and behavior are identical

## Next Steps

To fully utilize this MistralAI version:

1. **Test the Migration**: Run a simple command to verify functionality
2. **Customize Commands**: Adapt `.mistral/commands/infinite.md` for your specific needs
3. **Global Installation**: Copy commands to `~/.mistral/commands/` for global use
4. **Documentation**: Update any project-specific documentation to reference MistralAI

## Benefits of MistralAI

- Advanced parallel processing capabilities
- Efficient context management
- Robust agent coordination
- Scalable infinite generation patterns
