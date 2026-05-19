import { NextRequest } from 'next/server';

const API_BASE_URL = process.env.ELYSIAN_API_URL || 'http://localhost:7777';

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

    if (!backendResponse.ok) {
      return new Response(
        JSON.stringify({ error: 'Backend SSE error' }),
        { status: backendResponse.status, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream the response back to the client
    return new Response(backendResponse.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
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
