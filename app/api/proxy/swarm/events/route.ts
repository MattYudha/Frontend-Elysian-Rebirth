import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.ELYSIAN_API_URL || 'http://localhost:7777';

// Force this route to use the Edge runtime for proper SSE streaming
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const taskId = searchParams.get('task_id');

  if (!taskId) {
    return new Response(
      JSON.stringify({ error: 'task_id is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Forward to Go backend SSE endpoint
  const backendUrl = `${API_BASE_URL}/api/v1/swarm/events?task_id=${encodeURIComponent(taskId)}`;

  try {
    const backendResponse = await fetch(backendUrl, {
      headers: {
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });

    if (!backendResponse.ok || !backendResponse.body) {
      return new Response(
        JSON.stringify({ error: 'Backend SSE error', status: backendResponse.status }),
        { status: backendResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Use a TransformStream to re-chunk the backend body properly
    // This avoids ERR_INCOMPLETE_CHUNKED_ENCODING by ensuring
    // each chunk is flushed immediately as a proper SSE frame
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = backendResponse.body.getReader();
    const decoder = new TextDecoder();

    // Pipe in background — don't await
    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);
        }
      } catch (err) {
        // Client disconnected or upstream closed — swallow gracefully
        console.error('[SSE Proxy] Stream read error (expected on disconnect):', err);
      } finally {
        writer.close().catch(() => {});
      }
    })();

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable nginx/proxy buffering if present
      },
    });
  } catch (error: any) {
    console.error('[SSE Proxy] Error:', error.message);
    return new Response(
      JSON.stringify({ error: 'SSE Proxy Error', message: error.message }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
