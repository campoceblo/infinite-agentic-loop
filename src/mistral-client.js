import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';

dotenv.config();

class MistralAPIClient {
    constructor() {
        if (!process.env.MISTRAL_API_KEY) {
            throw new Error('MISTRAL_API_KEY environment variable is required');
        }
        
        this.client = new Mistral({
            apiKey: process.env.MISTRAL_API_KEY
        });
        
        this.defaultModel = process.env.MISTRAL_MODEL || 'mistral-large-latest';
        this.codeModel = process.env.MISTRAL_CODE_MODEL || 'codestral-latest';
        this.temperature = parseFloat(process.env.DEFAULT_TEMPERATURE) || 0.7;
        this.maxTokens = parseInt(process.env.DEFAULT_MAX_TOKENS) || 4000;
        this.retryAttempts = parseInt(process.env.RETRY_ATTEMPTS) || 3;
        this.retryDelay = parseInt(process.env.RETRY_DELAY) || 1000;
    }

    async generateCompletion(messages, options = {}) {
        const config = {
            model: options.useCodeModel ? this.codeModel : this.defaultModel,
            messages,
            temperature: options.temperature || this.temperature,
            maxTokens: options.maxTokens || this.maxTokens,
            ...options
        };

        let lastError;        for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
            try {
                const response = await this.client.chat.complete(config);
                return response.choices[0].message.content;
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt < this.retryAttempts) {
                    await this.delay(this.retryDelay * attempt);
                }
            }
        }
        
        throw new Error(`Failed after ${this.retryAttempts} attempts: ${lastError.message}`);
    }

    async generateCodeCompletion(prompt, context = '', options = {}) {
        const messages = [
            {
                role: 'system',
                content: 'You are an expert developer. Generate high-quality code based on the specifications provided.'
            },
            {
                role: 'user',
                content: context ? `Context:\n${context}\n\nRequest:\n${prompt}` : prompt
            }
        ];

        return this.generateCompletion(messages, { useCodeModel: true, ...options });
    }

    async analyzeAndGenerate(specification, existingContent, iterationNumber, creativeFocus) {
        const messages = [
            {
                role: 'system',
                content: `You are an AI agent specialized in generating unique iterations based on specifications. 
You must create content that is genuinely unique and follows the exact specification format.
Focus on: ${creativeFocus}`
            },
            {
                role: 'user',
                content: `SPECIFICATION:\n${specification}\n\nEXISTING CONTENT ANALYSIS:\n${existingContent}\n\nGENERATE ITERATION ${iterationNumber}:\nCreate a completely unique iteration that follows the specification exactly. Focus your innovation on: ${creativeFocus}\n\nEnsure your output is a complete, valid file that matches the specification format.`
            }
        ];

        return this.generateCompletion(messages, { maxTokens: 6000 });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default MistralAPIClient;
