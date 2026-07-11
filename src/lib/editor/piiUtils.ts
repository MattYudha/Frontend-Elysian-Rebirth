export const NIK_REGEX = /\b(\d{12})(\d{4})\b/g;
export const NPWP_REGEX = /\b(\d{2}[\.\-]?\d{3}[\.\-]?\d{3}[\.\-]?\d{1}[\.\-]?\d{3}[\.\-]?\d{3})\b/g; // 15 digits formats
export const REKENING_REGEX = /\b(\d{10,15})\b/g;

export function maskPII(text: string): string {
    // Keep last 4 digits for NIK
    let redacted = text.replace(NIK_REGEX, "************$2");
    
    // Simple mask for NPWP
    redacted = redacted.replace(NPWP_REGEX, (match) => {
        return match.replace(/\d/g, '*').slice(0, -4) + match.slice(-4);
    });

    // Mask rekening
    redacted = redacted.replace(REKENING_REGEX, "[REDACTED_ACCOUNT]");
    
    return redacted;
}
