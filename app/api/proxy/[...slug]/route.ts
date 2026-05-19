import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.ELYSIAN_API_URL || 'http://localhost:7777';

async function proxyRequest(
  request: NextRequest,
  method: string,
  slug: string[]
): Promise<NextResponse> {
  const path = slug.join('/');
  const url = `${API_BASE_URL}/api/v1/${path}`;

  // Read access_token from HTTP-Only Cookie (server-side only)
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  // Build headers
  const headers: Record<string, string> = {};
  
  // Forward content-type for POST/PUT/PATCH
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  // Inject Authorization header from cookie
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  // Forward cookies from the incoming request to the backend
  const cookieHeader = request.headers.get('cookie');
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader;
  }

  // Forward other relevant headers
  const forwardedHeaders = ['x-request-id', 'x-tenant-id'];
  for (const h of forwardedHeaders) {
    const val = request.headers.get(h);
    if (val) headers[h] = val;
  }

  // Build fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  // Include body for mutating methods
  if (method !== 'GET' && method !== 'HEAD') {
    const body = await request.text();
    if (body) {
      fetchOptions.body = body;
    }
  }

  try {
    const response = await fetch(url, fetchOptions);
    
    // Forward response status and body
    const responseBody = await response.text();
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward relevant response headers
    const forwardResponseHeaders = ['content-type', 'x-request-id'];
    for (const h of forwardResponseHeaders) {
      const val = response.headers.get(h);
      if (val) {
        nextResponse.headers.set(h, val);
      }
    }

    return nextResponse;
  } catch (error: any) {
    console.error(`[BFF Proxy] ${method} ${path} failed:`, error.message);
    return NextResponse.json(
      { error: 'Proxy Error', message: error.message },
      { status: 502 }
    );
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, 'GET', slug);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, 'POST', slug);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, 'PUT', slug);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, 'PATCH', slug);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return proxyRequest(request, 'DELETE', slug);
}
