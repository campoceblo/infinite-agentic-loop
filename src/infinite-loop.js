#!/usr/bin/env node

import chalk from 'chalk';
import { SpecificationAnalyzer, DirectoryAnalyzer } from './analyzers.js';
import { AgentOrchestrator } from './agent-orchestrator.js';
import dotenv from 'dotenv';
import fs from 'fs-extra';

dotenv.config();

class InfiniteAgenticLoop {
    constructor() {
        this.specAnalyzer = new SpecificationAnalyzer();
        this.dirAnalyzer = new DirectoryAnalyzer();
        this.orchestrator = new AgentOrchestrator();
    }

    async run() {
        console.log(chalk.bold.blue('🔄 INFINITE AGENTIC LOOP - MistralAI Implementation'));
        console.log(chalk.blue('================================================\n'));

        try {
            // Validate environment
            await this.validateEnvironment();

            // Parse arguments
            const args = this.parseArguments();
            
            // Execute the infinite loop
            await this.executeLoop(args);
            
        } catch (error) {
            console.error(chalk.red(`💥 Fatal error: ${error.message}`));
            process.exit(1);
        }
    }

    async validateEnvironment() {
        console.log(chalk.blue('🔍 Validating environment...'));
        
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('MISTRAL_API_KEY environment variable is required. Please copy .env.example to .env and add your API key.');
        }        // Test API connection
        try {
            const { Mistral } = await import('@mistralai/mistralai');
            const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
            
            // Simple test call
            await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [{ role: 'user', content: 'Hello' }],
                maxTokens: 10
            });
            
            console.log(chalk.green('✅ MistralAI API connection successful\n'));
        } catch (error) {
            throw new Error(`Failed to connect to MistralAI API: ${error.message}`);
        }
    }

    parseArguments() {
        const args = process.argv.slice(2);
        
        if (args.length === 0) {
            this.showUsage();
            process.exit(0);
        }
        
        if (args.length < 3) {
            throw new Error('Invalid arguments. Use: node infinite-loop.js <spec_file> <output_dir> <count>');
        }
        
        const [specFile, outputDir, count] = args;
        
        // Validate arguments
        if (!fs.existsSync(specFile)) {
            throw new Error(`Specification file not found: ${specFile}`);
        }
        
        if (count !== 'infinite' && (isNaN(count) || parseInt(count) < 1)) {
            throw new Error('Count must be a positive number or "infinite"');
        }
        
        return { specFile, outputDir, count };
    }

    showUsage() {
        console.log(chalk.blue('Usage: node infinite-loop.js <spec_file> <output_dir> <count>'));
        console.log('');
        console.log(chalk.yellow('Arguments:'));
        console.log('  spec_file   - Path to specification markdown file');
        console.log('  output_dir  - Directory where iterations will be saved');
        console.log('  count       - Number of iterations (1-N) or "infinite"');
        console.log('');
        console.log(chalk.yellow('Examples:'));
        console.log('  node infinite-loop.js specs/invent_new_ui_v3.md src 1');
        console.log('  node infinite-loop.js specs/invent_new_ui_v3.md src_new 5');
        console.log('  node infinite-loop.js specs/invent_new_ui_v3.md src_new 20');
        console.log('  node infinite-loop.js specs/invent_new_ui_v3.md infinite_src infinite');
        console.log('');
        console.log(chalk.yellow('NPM Scripts:'));
        console.log('  npm run single     - Generate 1 iteration');
        console.log('  npm run batch      - Generate 5 iterations');
        console.log('  npm run large-batch - Generate 20 iterations');
        console.log('  npm run infinite   - Infinite generation mode');
    }

    async executeLoop(args) {
        const { specFile, outputDir, count } = args;
        
        console.log(chalk.blue('⚙️  Configuration:'));
        console.log(`   Specification: ${chalk.yellow(specFile)}`);
        console.log(`   Output Directory: ${chalk.yellow(outputDir)}`);
        console.log(`   Count: ${chalk.yellow(count)}`);
        console.log(`   Max Concurrent: ${chalk.yellow(process.env.MAX_CONCURRENT_AGENTS || 5)}`);
        console.log('');

        // Phase 1: Specification Analysis
        console.log(chalk.bold.blue('📋 PHASE 1: SPECIFICATION ANALYSIS'));
        const specification = await this.specAnalyzer.analyzeSpecification(specFile);
        
        // Phase 2: Directory Reconnaissance  
        console.log(chalk.bold.blue('\n📁 PHASE 2: DIRECTORY RECONNAISSANCE'));
        const directoryAnalysis = await this.dirAnalyzer.analyzeOutputDirectory(outputDir);
        
        // Phase 3: Iteration Strategy
        console.log(chalk.bold.blue('\n🎯 PHASE 3: ITERATION STRATEGY'));
        await this.planIterationStrategy(specification, directoryAnalysis, count);
        
        // Phase 4: Parallel Agent Coordination
        console.log(chalk.bold.blue('\n🤖 PHASE 4: PARALLEL AGENT COORDINATION'));
        const startTime = Date.now();
        
        const results = await this.orchestrator.orchestrateGeneration(
            specification,
            directoryAnalysis,
            count,
            outputDir
        );
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        
        // Phase 5: Results Summary
        console.log(chalk.bold.blue('\n📊 PHASE 5: RESULTS SUMMARY'));
        this.showResults(results, duration, count);
    }

    async planIterationStrategy(specification, directoryAnalysis, count) {
        console.log(chalk.blue('🎯 Planning iteration strategy...'));
        
        const startingIteration = directoryAnalysis.highestIteration + 1;
        const endIteration = count === 'infinite' ? '∞' : startingIteration + parseInt(count) - 1;
        
        console.log(`   Starting iteration: ${chalk.yellow(startingIteration)}`);
        console.log(`   Ending iteration: ${chalk.yellow(endIteration)}`);
        console.log(`   File naming pattern: ${chalk.yellow(specification.fileNamingPattern)}`);
        console.log(`   Design dimensions: ${chalk.yellow(specification.designDimensions.length)} identified`);
        
        if (directoryAnalysis.existingFiles.length > 0) {
            console.log(`   Building upon: ${chalk.yellow(directoryAnalysis.existingFiles.length)} existing iterations`);
        }
        
        console.log(chalk.green('✓ Strategy planning complete'));
    }

    showResults(results, duration, count) {
        if (count === 'infinite') {
            console.log(chalk.green(`🎉 Infinite generation completed!`));
            console.log(`   Total generated: ${chalk.yellow(results.totalGenerated)} iterations`);
            console.log(`   Waves completed: ${chalk.yellow(results.waves)}`);
        } else {
            console.log(chalk.green(`🎉 Batch generation completed!`));
            console.log(`   Successful: ${chalk.yellow(results.successful.length)}/${chalk.yellow(results.total)}`);
            if (results.failed.length > 0) {
                console.log(`   Failed: ${chalk.red(results.failed.length)}`);
            }
        }
        
        console.log(`   Duration: ${chalk.yellow(duration)}s`);
        console.log('');
        console.log(chalk.blue('🚀 All iterations generated successfully!'));
        console.log(chalk.blue('Check your output directory for the new files.'));
    }
}

// Create and run the infinite agentic loop
const loop = new InfiniteAgenticLoop();
loop.run().catch(console.error);
