#!/usr/bin/env node

import chalk from 'chalk';
import { SpecificationAnalyzer, DirectoryAnalyzer } from './src/analyzers.js';
import dotenv from 'dotenv';

dotenv.config();

async function demonstrateNextGeneration() {
    console.log(chalk.bold.blue('🔮 PREVIEW: Next Generation Analysis'));
    console.log(chalk.blue('=========================================\n'));

    try {
        // Analyze current state
        const specAnalyzer = new SpecificationAnalyzer();
        const dirAnalyzer = new DirectoryAnalyzer();

        console.log(chalk.blue('📋 Analyzing current specification...'));
        const spec = await specAnalyzer.analyzeSpecification('specs/invent_new_ui_v3.md');
        
        console.log(chalk.blue('📁 Analyzing existing content in src/...'));
        const dirAnalysis = await dirAnalyzer.analyzeOutputDirectory('src');

        // Show what we found
        console.log(chalk.green('\n✅ Current State Analysis:'));
        console.log(`   📄 Specification: ${chalk.yellow('Themed Hybrid UI Components')}`);
        console.log(`   📝 File pattern: ${chalk.yellow(spec.fileNamingPattern)}`);
        console.log(`   🎨 Design dimensions: ${chalk.yellow(spec.designDimensions.length)} innovation areas`);
        console.log(`   📊 Existing files: ${chalk.yellow(dirAnalysis.existingFiles.length)} iterations`);
        console.log(`   🔢 Highest iteration: ${chalk.yellow(dirAnalysis.highestIteration)}`);
        console.log(`   🚀 Next iteration will be: ${chalk.bold.green(dirAnalysis.highestIteration + 1)}`);

        // Show themes already used
        if (dirAnalysis.contentSummary.length > 0) {
            console.log(chalk.blue('\n🎨 Themes already explored:'));
            const allThemes = new Set();
            dirAnalysis.contentSummary.forEach(item => {
                item.themes.forEach(theme => allThemes.add(theme));
            });
            
            const themeArray = Array.from(allThemes);
            if (themeArray.length > 0) {
                themeArray.forEach(theme => {
                    console.log(`   • ${chalk.cyan(theme)}`);
                });
            } else {
                console.log(`   ${chalk.gray('(Theme detection in progress - content analysis needed)')}`);
            }
        }

        // Show what's next
        console.log(chalk.blue('\n🔮 Next Generation Preview:'));
        console.log(`   📁 Output directory: ${chalk.yellow('src/')}`);
        console.log(`   📝 Next filename: ${chalk.yellow(spec.fileNamingPattern.replace('[iteration_number]', (dirAnalysis.highestIteration + 1).toString()))}`);
        console.log(`   🎯 Innovation focus: ${chalk.cyan('Visual theme innovation and unique aesthetic direction')}`);
        console.log(`   🧠 Context: Will analyze all ${dirAnalysis.existingFiles.length} existing files to ensure uniqueness`);

        // Show example commands
        console.log(chalk.blue('\n🚀 Ready to Generate:'));
        console.log(chalk.yellow('   npm run single      # Generate 1 new iteration'));
        console.log(chalk.yellow('   npm run batch       # Generate 5 new iterations in parallel'));
        console.log(chalk.yellow('   npm run infinite    # Continuous generation mode'));

        // Show API requirement
        if (!process.env.MISTRAL_API_KEY || process.env.MISTRAL_API_KEY === 'your_mistral_api_key_here') {
            console.log(chalk.red('\n⚠️  API Key Required:'));
            console.log(chalk.yellow('   1. Get API key from: https://console.mistral.ai/'));
            console.log(chalk.yellow('   2. Add to .env file: MISTRAL_API_KEY=your_key_here'));
            console.log(chalk.yellow('   3. Run: npm test (to verify connection)'));
        } else {
            console.log(chalk.green('\n✅ API Key detected - ready for generation!'));
        }

    } catch (error) {
        console.error(chalk.red(`❌ Error: ${error.message}`));
    }
}

demonstrateNextGeneration().catch(console.error);
