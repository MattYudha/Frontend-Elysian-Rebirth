import type { StreamChunk } from '../types';

/**
 * Stream adapter options
 */
export interface StreamAdapterOptions {
    onChunk?: (chunk: StreamChunk) => void;
    onComplete?: (fullContent: string) => void;
    onError?: (error: Error) => void;
}

/**
 * Create a stream adapter for handling AI response streams
 * 
 * @param generator - AsyncGenerator yielding stream chunks
 * @param options - Callback options for handling chunks
 * @returns Full accumulated content
 */
export async function createStreamAdapter(
    generator: AsyncGenerator<StreamChunk>,
    options: StreamAdapterOptions = {}
): Promise<string> {
    let fullContent = '';

    try {
        for await (const chunk of generator) {
            fullContent += chunk.content;
            options.onChunk?.(chunk);

            if (chunk.done) {
                options.onComplete?.(fullContent);
                break;
            }
        }
    } catch (error) {
        options.onError?.(error as Error);
        throw error;
    }

    return fullContent;
}
