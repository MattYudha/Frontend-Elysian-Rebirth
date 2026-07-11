import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * STRICT MODE: Only allow safe markdown-compatible tags
 */
export function sanitizeHtml(html: string): string {
    if (typeof window === 'undefined') return html;
    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li', 'a', 'code', 'pre', 'blockquote', 'table', 'thead',
            'tbody', 'tr', 'th', 'td', 'hr', 'span', 'div',
        ],
        ALLOWED_ATTR: ['href', 'title', 'class', 'id'],
        // Block dangerous protocols
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        // Remove scripts and event handlers
        FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });
}

/**
 * Sanitize user input before sending to backend
 */
export function sanitizeInput(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .substring(0, 10000); // Limit length
}

/**
 * Mask sensitive data in logs
 */
export function maskSensitiveData(data: Record<string, unknown> | unknown): unknown {
    if (typeof data !== 'object' || data === null) return data;

    const masked = { ...(data as Record<string, unknown>) };
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'authorization', 'cookie'];

    for (const key in masked) {
        if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
            masked[key] = '***REDACTED***';
        } else if (typeof masked[key] === 'object') {
            masked[key] = maskSensitiveData(masked[key]);
        }
    }

    return masked;
}

/**
 * Validate file upload
 */
export interface FileValidationResult {
    valid: boolean;
    error?: string;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// STRICT WHITELIST - Block dangerous file types
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'text/csv',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

const ALLOWED_EXTENSIONS = ['pdf', 'txt', 'md', 'csv', 'json', 'doc', 'docx'];

// BLOCKED EXTENSIONS - Executable and archive files
const BLOCKED_EXTENSIONS = [
    'exe', 'bat', 'cmd', 'sh', 'ps1', 'msi', 'app', 'deb', 'rpm',
    'zip', 'rar', '7z', 'tar', 'gz', 'iso',
    'svg', 'html', 'htm', 'xml', 'js', 'ts',
];

export function validateFile(file: File): FileValidationResult {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    // Check file extension
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension) {
        return { valid: false, error: 'File has no extension' };
    }

    // Block dangerous extensions
    if (BLOCKED_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            error: `File type .${extension} is blocked for security reasons`,
        };
    }

    // Check whitelist
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
        return {
            valid: false,
            error: `File extension .${extension} is not allowed`,
        };
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `File type ${file.type} is not allowed`,
        };
    }

    return { valid: true };
}
