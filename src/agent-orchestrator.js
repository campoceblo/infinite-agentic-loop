import pLimit from 'p-limit';
import chalk from 'chalk';
import cliProgress from 'cli-progress';
import fs from 'fs-extra';
import path from 'path';
import MistralAPIClient from './mistral-client.js';

export class AgentOrchestrator {
    constructor() {
        this.mistralClient = new MistralAPIClient();
        this.maxConcurrent = parseInt(process.env.MAX_CONCURRENT_AGENTS) || 5;
        this.limit = pLimit(this.maxConcurrent);
        this.creativeFoci = [
            'Visual theme innovation and unique aesthetic direction',
            'Interaction paradigm creativity and user experience',
            'Functional integration uniqueness and component synergy',
            'Technical implementation novelty and code architecture',
            'Responsive design excellence and mobile-first approach',
            'Accessibility innovation and inclusive design patterns',
            'Performance optimization and efficient rendering',
            'Animation and micro-interaction sophistication',
            'Color theory application and visual hierarchy',
            'Typography creativity and readability enhancement'
        ];
    }

    async orchestrateGeneration(specification, directoryAnalysis, count, outputDir) {
        console.log(chalk.blue(`🚀 Orchestrating ${count === 'infinite' ? 'infinite' : count} agent(s)...`));
        
        if (count === 'infinite') {
            return this.runInfiniteGeneration(specification, directoryAnalysis, outputDir);
        } else {
            return this.runBatchGeneration(specification, directoryAnalysis, parseInt(count), outputDir);
        }
    }

    async runBatchGeneration(specification, directoryAnalysis, count, outputDir) {
        const startingIteration = directoryAnalysis.highestIteration + 1;
        const tasks = [];
        
        // Create progress bar
        const progressBar = new cliProgress.SingleBar({
            format: 'Progress |{bar}| {percentage}% | {value}/{total} agents | ETA: {eta}s',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        });
        
        progressBar.start(count, 0);
        
        for (let i = 0; i < count; i++) {
            const iterationNumber = startingIteration + i;
            const creativeFocus = this.creativeFoci[i % this.creativeFoci.length];
            
            const task = this.limit(async () => {
                try {
                    const result = await this.generateIteration(
                        specification,
                        directoryAnalysis,
                        iterationNumber,
                        creativeFocus,
                        outputDir
                    );
                    
                    progressBar.increment();
                    return result;
                } catch (error) {
                    progressBar.increment();
                    console.error(chalk.red(`❌ Agent ${iterationNumber} failed: ${error.message}`));
                    return { success: false, iteration: iterationNumber, error: error.message };
                }
            });
            
            tasks.push(task);
        }
        
        const results = await Promise.all(tasks);
        progressBar.stop();
        
        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);
        
        console.log(chalk.green(`✅ Completed: ${successful.length}/${count} agents successful`));
        if (failed.length > 0) {
            console.log(chalk.yellow(`⚠️  Failed: ${failed.length} agents`));
        }
        
        return { successful, failed, total: count };
    }

    async runInfiniteGeneration(specification, directoryAnalysis, outputDir) {
        console.log(chalk.blue('♾️  Starting infinite generation mode...'));
        
        let currentIteration = directoryAnalysis.highestIteration + 1;
        let waveNumber = 1;
        let totalGenerated = 0;
        const maxContextUsage = parseInt(process.env.MAX_CONTEXT_LENGTH) || 32000;
        
        try {
            while (true) {
                console.log(chalk.cyan(`\n🌊 Wave ${waveNumber} - Starting from iteration ${currentIteration}`));
                
                // Determine wave size (3-5 agents)
                const waveSize = Math.min(5, Math.max(3, this.maxConcurrent));
                
                // Update directory analysis for this wave
                const updatedAnalysis = await this.updateDirectoryAnalysis(outputDir);
                
                // Generate wave
                const waveResult = await this.runBatchGeneration(
                    specification,
                    updatedAnalysis,
                    waveSize,
                    outputDir
                );
                
                totalGenerated += waveResult.successful.length;
                currentIteration += waveSize;
                waveNumber++;
                
                console.log(chalk.green(`Wave ${waveNumber - 1} complete. Total generated: ${totalGenerated}`));
                
                // Check if we should continue (simple heuristic based on iterations)
                if (totalGenerated >= 50) {
                    console.log(chalk.blue('🎯 Infinite generation completed - reached iteration limit'));
                    break;
                }
                
                // Brief pause between waves
                await this.delay(2000);
            }
        } catch (error) {
            console.error(chalk.red(`Infinite generation stopped due to error: ${error.message}`));
        }
        
        return { totalGenerated, waves: waveNumber - 1 };
    }

    async generateIteration(specification, directoryAnalysis, iterationNumber, creativeFocus, outputDir) {
        console.log(chalk.blue(`🤖 Agent ${iterationNumber}: Generating with focus on "${creativeFocus}"`));
        
        // Prepare context for the agent
        const existingContent = this.summarizeExistingContent(directoryAnalysis);
        
        // Generate the iteration using MistralAI
        const generatedContent = await this.mistralClient.analyzeAndGenerate(
            specification.content,
            existingContent,
            iterationNumber,
            creativeFocus
        );
        
        // Determine output filename
        const filename = this.generateFilename(specification.fileNamingPattern, iterationNumber);
        const outputPath = path.join(outputDir, filename);
        
        // Save the generated content
        await fs.writeFile(outputPath, generatedContent, 'utf-8');
        
        console.log(chalk.green(`✅ Agent ${iterationNumber}: Generated ${filename}`));
        
        return {
            success: true,
            iteration: iterationNumber,
            filename,
            outputPath,
            creativeFocus,
            size: generatedContent.length
        };
    }

    generateFilename(pattern, iterationNumber) {
        return pattern.replace('[iteration_number]', iterationNumber.toString());
    }

    summarizeExistingContent(directoryAnalysis) {
        let summary = `Existing files: ${directoryAnalysis.existingFiles.length}\n`;
        summary += `Highest iteration: ${directoryAnalysis.highestIteration}\n\n`;
        
        if (directoryAnalysis.contentSummary.length > 0) {
            summary += "Previous iterations:\n";
            for (const item of directoryAnalysis.contentSummary) {
                summary += `- ${item.file}: "${item.title}" (themes: ${item.themes.join(', ') || 'none detected'})\n`;
            }
        }
        
        summary += "\nPatterns observed:\n";
        summary += `- Naming: ${directoryAnalysis.patterns.namingPattern}\n`;
        summary += `- Extensions: ${directoryAnalysis.patterns.extensions.join(', ')}\n`;
        
        summary += "\nIMPORTANT: Create something completely unique that hasn't been done before!";
        
        return summary;
    }

    async updateDirectoryAnalysis(outputDir) {
        const { DirectoryAnalyzer } = await import('./analyzers.js');
        const analyzer = new DirectoryAnalyzer();
        return analyzer.analyzeOutputDirectory(outputDir);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
