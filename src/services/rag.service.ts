/**
 * rag.service.ts
 *
 * Zero-memory transit upload protocol:
 *   1. GET /api/v1/documents/presign   → backend returns time-limited S3 put URL
 *   2. PUT <presigned_url>             → browser uploads file DIRECTLY to MinIO/S3
 *   3. POST /api/v1/documents/confirm  → backend creates DB record + queues Asynq worker
 *
 * Keys and endpoints come from environment variables only.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7777';

export interface PresignResponse {
    presigned_url: string;
    object_key: string;
    expires_in: string;
}

export interface DocumentRecord {
    id: string;
    tenant_id: string;
    user_id: string;
    title: string;
    source_uri: string;
    status: 'pending' | 'pending_qa' | 'processing' | 'ready' | 'failed' | 'queued_failed';
    category?: string;
    ai_analysis_json?: any;
    created_at: string;
    last_updated_at: string;
}

export interface UploadProgress {
    phase: 'presigning' | 'uploading' | 'confirming' | 'done' | 'error';
    percent: number;
    error?: string;
    documentId?: string;
}

type ProgressCallback = (progress: UploadProgress) => void;

/**
 * Fetches the presigned PUT URL from the backend.
 */
async function getPresignedURL(
    filename: string,
    authToken: string,
    tenantId: string,
): Promise<PresignResponse> {
    const res = await fetch(
        `${API_BASE}/api/v1/documents/presign?filename=${encodeURIComponent(filename)}`,
        {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'X-Tenant-ID': tenantId,
            },
        },
    );
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Presign failed: HTTP ${res.status}`);
    }
    return res.json();
}

/**
 * Uploads the file directly to S3/MinIO using the presigned PUT URL.
 * Uses XMLHttpRequest to enable real upload progress tracking.
 */
function uploadToS3(
    presignedURL: string,
    file: File,
    onProgress: (percent: number) => void,
): Promise<void> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', presignedURL);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                onProgress(Math.round((event.loaded / event.total) * 100));
            }
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`S3 upload failed: HTTP ${xhr.status}`));
            }
        };

        xhr.onerror = () => reject(new Error('Network error during S3 upload'));
        xhr.send(file);
    });
}

/**
 * Confirms the upload to backend, which creates the DB record and
 * dispatches the vectorization task to Asynq.
 */
async function confirmUpload(
    title: string,
    objectKey: string,
    category: string,
    authToken: string,
    tenantId: string,
): Promise<string> {
    const res = await fetch(`${API_BASE}/api/v1/documents/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
            'X-Tenant-ID': tenantId,
        },
        body: JSON.stringify({ title, object_key: objectKey, category }),
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Confirm failed: HTTP ${res.status}`);
    }
    const data = await res.json();
    return data.document_id as string;
}

/**
 * Full upload orchestration: presign → PUT to S3 → confirm to backend.
 * Progress is reported via the onProgress callback.
 *
 * @example
 * await ragService.uploadDocument(file, 'general', token, tenantId, (p) => {
 *   console.log(p.phase, p.percent);
 * });
 */
export async function uploadDocument(
    file: File,
    category: string,
    authToken: string,
    tenantId: string,
    onProgress?: ProgressCallback,
): Promise<string> {
    const report = (p: UploadProgress) => onProgress?.(p);

    try {
        // Phase 1: Get presigned URL
        report({ phase: 'presigning', percent: 5 });
        const { presigned_url, object_key } = await getPresignedURL(file.name, authToken, tenantId);

        // Phase 2: PUT file directly to S3
        report({ phase: 'uploading', percent: 10 });
        await uploadToS3(presigned_url, file, (pct) => {
            report({ phase: 'uploading', percent: 10 + Math.round(pct * 0.75) });
        });

        // Phase 3: Confirm to backend (triggers Asynq vectorization)
        report({ phase: 'confirming', percent: 90 });
        const documentId = await confirmUpload(file.name, object_key, category, authToken, tenantId);

        report({ phase: 'done', percent: 100, documentId });
        return documentId;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown upload error';
        report({ phase: 'error', percent: 0, error: message });
        throw err;
    }
}

/**
 * Lists all documents in the knowledge base for the current tenant.
 */
export async function listDocuments(
    authToken: string,
    tenantId: string,
    limit = 20,
    offset = 0,
): Promise<{ data: DocumentRecord[]; meta: { total: number; limit: number; offset: number } }> {
    const res = await fetch(`${API_BASE}/api/v1/documents?limit=${limit}&offset=${offset}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
            'X-Tenant-ID': tenantId,
        },
    });
    if (!res.ok) throw new Error(`Failed to list documents: HTTP ${res.status}`);
    return res.json();
}

/**
 * Approves a parsed document that is in 'pending_qa' status.
 * Triggers backend vectorization.
 */
export async function approveDocument(
    authToken: string,
    tenantId: string,
    documentId: string,
): Promise<{ status: string; document_id: string; message: string }> {
    const res = await fetch(`${API_BASE}/api/v1/documents/${documentId}/approve`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`,
            'X-Tenant-ID': tenantId,
        },
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `Approval failed: HTTP ${res.status}`);
    }
    return res.json();
}
