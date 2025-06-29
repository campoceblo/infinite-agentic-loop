#!/usr/bin/env node

import chalk from 'chalk';
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';
import fs from 'fs-extra';

dotenv.config();

async function testInstallation() {
    console.log(chalk.bold.blue('🧪 Testing MistralAI API Implementation'));
    console.log(chalk.blue('=====================================\n'));

    let allTestsPassed = true;

    // Test 1: Environment Variables
    console.log(chalk.blue('1. Testing environment variables...'));
    if (!process.env.MISTRAL_API_KEY) {
        console.log(chalk.red('   ❌ MISTRAL_API_KEY not found in environment'));
        console.log(chalk.yellow('   💡 Copy .env.example to .env and add your API key'));
        allTestsPassed = false;
    } else {
        console.log(chalk.green('   ✅ MISTRAL_API_KEY found'));
    }

    // Test 2: API Connection
    if (process.env.MISTRAL_API_KEY) {
        console.log(chalk.blue('\n2. Testing MistralAI API connection...'));        try {
            const client = new Mistral({ 
                apiKey: process.env.MISTRAL_API_KEY 
            });
            
            const response = await client.chat.complete({
                model: 'mistral-small-latest',
                messages: [{ 
                    role: 'user', 
                    content: 'Reply with just "Hello" to test the connection.' 
                }],
                maxTokens: 10
            });
            
            console.log(chalk.green('   ✅ API connection successful'));
            console.log(chalk.gray(`   📝 Response: ${response.choices[0].message.content.trim()}`));
        } catch (error) {
            console.log(chalk.red('   ❌ API connection failed'));
            console.log(chalk.red(`   💥 Error: ${error.message}`));
            allTestsPassed = false;
        }
    }

    // Test 3: File Structure
    console.log(chalk.blue('\n3. Testing file structure...'));
    const requiredFiles = [
        'src/infinite-loop.js',
        'src/mistral-client.js', 
        'src/analyzers.js',
        'src/agent-orchestrator.js',
        'specs/invent_new_ui_v3.md',
        'package.json'
    ];

    for (const file of requiredFiles) {
        if (await fs.pathExists(file)) {
            console.log(chalk.green(`   ✅ ${file} exists`));
        } else {
            console.log(chalk.red(`   ❌ ${file} missing`));
            allTestsPassed = false;
        }
    }

    // Test 4: Dependencies
    console.log(chalk.blue('\n4. Testing dependencies...'));
    try {
        await import('@mistralai/mistralai');
        console.log(chalk.green('   ✅ @mistralai/mistralai loaded'));
        
        await import('chalk');
        console.log(chalk.green('   ✅ chalk loaded'));
        
        await import('cli-progress');
        console.log(chalk.green('   ✅ cli-progress loaded'));
        
        await import('p-limit');
        console.log(chalk.green('   ✅ p-limit loaded'));
        
    } catch (error) {
        console.log(chalk.red('   ❌ Dependencies missing'));
        console.log(chalk.yellow('   💡 Run: npm install'));
        allTestsPassed = false;
    }

    // Test 5: Quick Generation Test
    if (allTestsPassed && process.env.MISTRAL_API_KEY) {
        console.log(chalk.blue('\n5. Testing quick generation...'));
        try {
            const { SpecificationAnalyzer } = await import('./src/analyzers.js');
            const analyzer = new SpecificationAnalyzer();
            
            const spec = await analyzer.analyzeSpecification('specs/invent_new_ui_v3.md');
            console.log(chalk.green('   ✅ Specification analysis successful'));
            console.log(chalk.gray(`   📝 File pattern: ${spec.fileNamingPattern}`));
            console.log(chalk.gray(`   📝 Design dimensions: ${spec.designDimensions.length} found`));
            
        } catch (error) {
            console.log(chalk.red('   ❌ Generation test failed'));
            console.log(chalk.red(`   💥 Error: ${error.message}`));
            allTestsPassed = false;
        }
    }

    // Final Results
    console.log(chalk.blue('\n🏁 Test Results'));
    console.log(chalk.blue('================'));
    
    if (allTestsPassed) {
        console.log(chalk.bold.green('🎉 All tests passed! Your installation is ready.'));
        console.log(chalk.blue('\nNext steps:'));
        console.log(chalk.yellow('   npm run single      # Generate 1 iteration'));
        console.log(chalk.yellow('   npm run batch       # Generate 5 iterations'));
        console.log(chalk.yellow('   npm run infinite    # Infinite generation'));
    } else {
        console.log(chalk.bold.red('❌ Some tests failed. Please fix the issues above.'));
        console.log(chalk.blue('\nCommon fixes:'));
        console.log(chalk.yellow('   1. Copy .env.example to .env'));
        console.log(chalk.yellow('   2. Add your MistralAI API key to .env'));
        console.log(chalk.yellow('   3. Run: npm install'));
    }
}

testInstallation().catch(console.error);
