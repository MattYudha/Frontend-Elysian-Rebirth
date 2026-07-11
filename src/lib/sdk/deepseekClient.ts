import type { ChatMessage, ModelConfig, StreamChunk } from './types';

/**
 * DeepSeek Client configuration
 */
export interface DeepSeekClientConfig {
    apiKey: string;
    baseURL?: string;
}

/**
 * DeepSeek Client for chat completions
 */
export class DeepSeekClient {
    private config: DeepSeekClientConfig;

    constructor(config: DeepSeekClientConfig) {
        this.config = config;
    }

    /**
     * Send a chat completion request (mock implementation)
     */
    async chat(messages: ChatMessage[], modelConfig: ModelConfig): Promise<ChatMessage> {
        // Mock implementation - replace with actual API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    id: `msg_${Date.now()}`,
                    role: 'assistant',
                    content: 'This is a mock response from DeepSeek. Replace with actual implementation.',
                    timestamp: new Date(),
                    metadata: { model: modelConfig.model },
                });
            }, 1000);
        });
    }

    /**
     * Stream a chat completion response (mock implementation)
     */
    async *chatStream(
        _messages: ChatMessage[],
        _modelConfig: ModelConfig
    ): AsyncGenerator<StreamChunk> {
        // Mock streaming implementation
        const chunks = [
            'DeepSeek ',
            'mock ',
            'streaming ',
            'response. ',
            'Implement ',
            'actual ',
            'API ',
            'integration.',
        ];

        for (let i = 0; i < chunks.length; i++) {
            await new Promise((resolve) => setTimeout(resolve, 120));
            yield {
                content: chunks[i],
                done: i === chunks.length - 1,
                metadata: { chunkIndex: i },
            };
        }
    }
}
