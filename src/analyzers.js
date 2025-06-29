import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export class SpecificationAnalyzer {
    async analyzeSpecification(specFilePath) {
        try {
            const specContent = await fs.readFile(specFilePath, 'utf-8');
            
            console.log(chalk.blue('📋 Analyzing specification...'));
            
            const analysis = {
                content: specContent,
                fileNamingPattern: this.extractFileNamingPattern(specContent),
                outputFormat: this.extractOutputFormat(specContent),
                designDimensions: this.extractDesignDimensions(specContent),
                qualityStandards: this.extractQualityStandards(specContent)
            };
            
            console.log(chalk.green('✓ Specification analysis complete'));
            return analysis;
        } catch (error) {
            throw new Error(`Failed to analyze specification: ${error.message}`);
        }
    }

    extractFileNamingPattern(content) {
        const match = content.match(/\*\*File Naming\*\*:\s*`([^`]+)`/);
        return match ? match[1] : 'output_[iteration_number].html';
    }

    extractOutputFormat(content) {
        const htmlMatch = content.match(/```html([\s\S]*?)```/);
        return htmlMatch ? htmlMatch[1].trim() : '';
    }

    extractDesignDimensions(content) {
        const dimensions = [];
        const lines = content.split('\n');
        
        let inDesignSection = false;
        for (const line of lines) {
            if (line.includes('Design Dimensions') || line.includes('design language')) {
                inDesignSection = true;
                continue;
            }
            
            if (inDesignSection && line.trim().startsWith('-')) {
                dimensions.push(line.trim().substring(1).trim());
            }
            
            if (inDesignSection && line.trim() === '' && dimensions.length > 0) {
                break;
            }
        }
        
        return dimensions.length > 0 ? dimensions : [
            'Visual theme innovation',
            'Interaction paradigm creativity', 
            'Functional integration uniqueness',
            'User experience enhancement',
            'Technical implementation novelty'
        ];
    }

    extractQualityStandards(content) {
        const standards = [];
        const requirementMatches = content.match(/(\d+\.\s*[^\n]+)/g);
        
        if (requirementMatches) {
            standards.push(...requirementMatches);
        }
        
        return standards.length > 0 ? standards : [
            'Must be completely functional',
            'Must follow specification format exactly',
            'Must be genuinely unique from existing iterations',
            'Must demonstrate clear innovation'
        ];
    }
}

export class DirectoryAnalyzer {
    async analyzeOutputDirectory(outputDir) {
        try {
            console.log(chalk.blue(`📁 Analyzing output directory: ${outputDir}`));
            
            await fs.ensureDir(outputDir);
            const files = await fs.readdir(outputDir);
            
            const analysis = {
                existingFiles: files,
                highestIteration: this.findHighestIteration(files),
                contentSummary: await this.generateContentSummary(outputDir, files),
                patterns: this.analyzePatterns(files)
            };
            
            console.log(chalk.green(`✓ Found ${files.length} existing files, highest iteration: ${analysis.highestIteration}`));
            return analysis;
        } catch (error) {
            throw new Error(`Failed to analyze directory: ${error.message}`);
        }
    }

    findHighestIteration(files) {
        let highest = 0;
        
        for (const file of files) {
            const match = file.match(/(\d+)/);
            if (match) {
                const num = parseInt(match[1]);
                if (num > highest) {
                    highest = num;
                }
            }
        }
        
        return highest;
    }

    async generateContentSummary(outputDir, files) {
        const summary = [];
        
        // Sample a few files to understand the evolution
        const sampleFiles = files.slice(0, Math.min(5, files.length));
        
        for (const file of sampleFiles) {
            try {
                const filePath = path.join(outputDir, file);
                const content = await fs.readFile(filePath, 'utf-8');
                
                // Extract title and key features
                const titleMatch = content.match(/<title>([^<]+)<\/title>/);
                const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
                
                summary.push({
                    file,
                    title: titleMatch ? titleMatch[1] : 'Unknown',
                    heading: h1Match ? h1Match[1] : 'Unknown',
                    themes: this.extractThemes(content)
                });
            } catch (error) {
                console.warn(`Could not analyze file ${file}: ${error.message}`);
            }
        }
        
        return summary;
    }

    extractThemes(content) {
        const themes = [];
        const themeKeywords = [
            'cyberpunk', 'retro', 'minimalist', 'steampunk', 'neon', 'glassmorphism',
            'neumorphism', 'brutalist', 'vintage', 'futuristic', 'organic', 'geometric'
        ];
        
        const lowercaseContent = content.toLowerCase();
        for (const keyword of themeKeywords) {
            if (lowercaseContent.includes(keyword)) {
                themes.push(keyword);
            }
        }
        
        return themes;
    }

    analyzePatterns(files) {
        const patterns = {
            namingPattern: this.detectNamingPattern(files),
            extensions: this.getExtensions(files),
            numberingGaps: this.findNumberingGaps(files)
        };
        
        return patterns;
    }

    detectNamingPattern(files) {
        if (files.length === 0) return 'unknown';
        
        const sample = files[0];
        return sample.replace(/\d+/, '[NUMBER]');
    }

    getExtensions(files) {
        const extensions = new Set();
        for (const file of files) {
            const ext = path.extname(file);
            if (ext) extensions.add(ext);
        }
        return Array.from(extensions);
    }

    findNumberingGaps(files) {
        const numbers = [];
        for (const file of files) {
            const match = file.match(/(\d+)/);
            if (match) {
                numbers.push(parseInt(match[1]));
            }
        }
        
        numbers.sort((a, b) => a - b);
        const gaps = [];
        
        for (let i = 1; i < numbers.length; i++) {
            if (numbers[i] - numbers[i-1] > 1) {
                gaps.push({ from: numbers[i-1], to: numbers[i] });
            }
        }
        
        return gaps;
    }
}
