# Setup Instructions for MistralAI API Implementation

## Prerequisites

1. **Node.js**: Version 18 or higher
2. **MistralAI Account**: Sign up at [console.mistral.ai](https://console.mistral.ai/)
3. **API Key**: Get your API key from the MistralAI console

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and add your API key:

```bash
cp .env.example .env
```

Edit `.env` file and add your MistralAI API key:
```
MISTRAL_API_KEY=your_actual_api_key_here
```

### 3. Test Installation

Test that everything is working:
```bash
npm run single
```

## Usage

### Command Line Interface

Basic syntax:
```bash
node src/infinite-loop.js <spec_file> <output_dir> <count>
```

### NPM Scripts (Recommended)

```bash
# Generate 1 iteration
npm run single

# Generate 5 iterations in parallel
npm run batch

# Generate 20 iterations in coordinated batches
npm run large-batch

# Infinite generation mode
npm run infinite
```

### Custom Commands

```bash
# Single generation
node src/infinite-loop.js specs/invent_new_ui_v3.md output 1

# Small batch (5 iterations)
node src/infinite-loop.js specs/invent_new_ui_v3.md output_new 5

# Large batch (20 iterations)
node src/infinite-loop.js specs/invent_new_ui_v3.md output_new 20

# Infinite mode (continuous generation)
node src/infinite-loop.js specs/invent_new_ui_v3.md infinite_output infinite
```

## Configuration Options

Edit `.env` file to customize:

```bash
# Required
MISTRAL_API_KEY=your_api_key

# Optional Model Configuration
MISTRAL_MODEL=mistral-large-latest          # Main model for reasoning
MISTRAL_CODE_MODEL=codestral-latest         # Model for code generation
MISTRAL_EMBED_MODEL=mistral-embed           # Model for embeddings

# Optional Performance Settings
MAX_CONCURRENT_AGENTS=5                     # Max parallel agents
MAX_CONTEXT_LENGTH=32000                    # Context limit
DEFAULT_TEMPERATURE=0.7                     # Creativity level (0-1)
DEFAULT_MAX_TOKENS=4000                     # Max tokens per response
RETRY_ATTEMPTS=3                            # API retry attempts
RETRY_DELAY=1000                            # Delay between retries (ms)
```

## Features

### 🤖 Multi-Agent Orchestration
- Parallel agent execution with configurable concurrency
- Each agent focuses on a unique creative dimension
- Intelligent load balancing and error handling

### 📋 Specification-Driven Generation
- Analyzes specification files to understand requirements
- Maintains consistency across all generated iterations
- Extracts naming patterns, design dimensions, and quality standards

### 📁 Directory Intelligence
- Analyzes existing iterations to avoid duplication
- Identifies patterns and gaps in existing content
- Ensures each new iteration is genuinely unique

### ♾️ Infinite Generation Mode
- Continuous generation in waves until limits reached
- Progressive sophistication across multiple waves
- Intelligent context management to maximize output

### 🎯 Creative Focus Assignment
- Each agent receives a unique creative direction
- Ensures diverse innovation across parallel streams
- Balances consistency with creative exploration

## Troubleshooting

### API Key Issues
```bash
# Check if API key is set
echo $MISTRAL_API_KEY

# Test API connection
npm run single
```

### Permission Errors
```bash
# On Unix/macOS, ensure script is executable
chmod +x src/infinite-loop.js
```

### Memory Issues
```bash
# Reduce concurrent agents if running out of memory
# Edit .env: MAX_CONCURRENT_AGENTS=3
```

### Rate Limiting
The system includes automatic retry logic and respects MistralAI rate limits. If you hit limits:
- Reduce `MAX_CONCURRENT_AGENTS`
- Increase `RETRY_DELAY`
- Use smaller batch sizes

## Output

Generated files will be saved in your specified output directory with:
- Unique content based on specification requirements
- Progressive numbering (e.g., `ui_hybrid_1.html`, `ui_hybrid_2.html`)
- Complete HTML files ready for use
- Diverse themes and creative approaches

## Advanced Usage

### Custom Specifications
Create your own specification files in the `specs/` directory following the pattern of existing files.

### Integration with CI/CD
The tool can be integrated into automated workflows:
```bash
# Generate daily iterations
node src/infinite-loop.js specs/invent_new_ui_v3.md daily_output 5
```

### Monitoring and Logging
The tool provides detailed console output with:
- Progress bars for batch operations
- Color-coded status messages
- Performance metrics and timing
- Error handling and recovery information
