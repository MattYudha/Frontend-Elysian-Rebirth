import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.ELYSIAN_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7777';

async function proxyRequest(
  request: NextRequest,
  method: string,
  slug: string[]
): Promise<NextResponse> {
  const path = slug.join('/');
  const searchParams = request.nextUrl.search || '';
  const url = `${API_BASE_URL}/api/v1/${path}${searchParams}`;

  try {
    // Read access_token and tenant_id from HTTP-Only Cookies (server-side only)
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const tenantIdFromCookie = cookieStore.get('tenant_id')?.value;

    // Build headers
    const headers: Record<string, string> = {};
    
    // Forward content-type for POST/PUT/PATCH
    const contentType = request.headers.get('content-type');
    if (contentType) {
      headers['Content-Type'] = contentType;
    }

    // Inject Authorization header: try client's incoming header first, fallback to cookie
    const incomingAuth = request.headers.get('authorization');
    if (incomingAuth) {
      headers['Authorization'] = incomingAuth;
    } else if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    // Inject X-Tenant-ID header: try client's incoming header first, fallback to cookie
    const incomingTenant = request.headers.get('x-tenant-id') || request.headers.get('X-Tenant-ID');
    if (incomingTenant) {
      headers['X-Tenant-ID'] = incomingTenant;
    } else if (tenantIdFromCookie) {
      headers['X-Tenant-ID'] = tenantIdFromCookie;
    }

    // Forward cookies from the incoming request to the backend
    const cookieHeader = request.headers.get('cookie');
    if (cookieHeader) {
      headers['Cookie'] = cookieHeader;
    }

    // Forward other relevant headers
    const forwardedHeaders = ['x-request-id'];
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
      try {
        const body = await request.arrayBuffer();
        if (body && body.byteLength > 0) {
          fetchOptions.body = body;
          // Set duplex to half for streaming bodies in modern fetch
          (fetchOptions as any).duplex = 'half';
        }
      } catch (e) {
        // Body reading failed or empty
      }
    }

    const response = await fetch(url, fetchOptions);
    
    // Forward response status and body
    const responseBody = await response.text();
    const nextResponse = new NextResponse(responseBody, {
      status: response.status,
      statusText: response.statusText,
    });

    // Forward relevant response headers
    const forwardResponseHeaders = ['content-type', 'x-request-id', 'x-tenant-id', 'X-Tenant-ID'];
    for (const h of forwardResponseHeaders) {
      const val = response.headers.get(h);
      if (val) {
        nextResponse.headers.set(h, val);
      }
    }

    // Synchronize the browser's tenant_id cookie if the backend resolved a fallback tenant ID
    const resolvedTenantId = response.headers.get('x-tenant-id') || response.headers.get('X-Tenant-ID');
    if (resolvedTenantId) {
      console.log(`[BFF Proxy] Auto-healing stale tenant cookie. Setting tenant_id to resolved fallback:`, resolvedTenantId);
      nextResponse.cookies.set({
        name: 'tenant_id',
        value: resolvedTenantId,
        httpOnly: false, // Accessible by frontend stores/queries
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60 // 1 year
      });
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
