import { NextRequest, NextResponse } from 'next/server';

const BACKEND = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '');

// Hop-by-hop headers must not be forwarded between proxies
const HOP_BY_HOP = new Set([
  'connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization',
  'te', 'trailers', 'transfer-encoding', 'upgrade',
]);

async function proxy(req: NextRequest, path: string[]): Promise<NextResponse> {
  const upstream = `${BACKEND}/${path.join('/')}${req.nextUrl.search}`;

  const reqHeaders = new Headers();
  req.headers.forEach((value, key) => {
    if (key !== 'host' && !HOP_BY_HOP.has(key)) {
      reqHeaders.set(key, value);
    }
  });
  // Forward the original host so the backend builds correct OAuth redirect_uri
  const host = req.headers.get('host');
  if (host) reqHeaders.set('x-forwarded-host', host);

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD';

  const upstreamRes = await fetch(upstream, {
    method: req.method,
    headers: reqHeaders,
    body: hasBody ? req.body : undefined,
    redirect: 'manual',
    cache: 'no-store',
    // Node.js requires duplex:'half' when forwarding a streaming request body
    ...(hasBody ? { duplex: 'half' } : {}),
  } as RequestInit);

  const resHeaders = new Headers();
  upstreamRes.headers.forEach((value, key) => {
    if (!HOP_BY_HOP.has(key) && key !== 'set-cookie') {
      resHeaders.set(key, value);
    }
  });

  // Rewrite Set-Cookie headers: strip Domain= so the browser scopes cookies
  // to aktiekoll.com instead of the backend's domain. This makes auth cookies
  // first-party, which mobile browsers with strict privacy settings require.
  const setCookies: string[] =
    (upstreamRes.headers as Headers & { getSetCookie(): string[] }).getSetCookie?.()
    ?? (upstreamRes.headers.has('set-cookie') ? [upstreamRes.headers.get('set-cookie')!] : []);

  for (const cookie of setCookies) {
    resHeaders.append(
      'set-cookie',
      cookie
        .replace(/;\s*domain=[^;]+/gi, '')
        .replace(/;\s*samesite=[^;]+/gi, '; SameSite=Lax'),
    );
  }

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: resHeaders,
  });
}

type Props = { params: Promise<{ path: string[] }> };

export async function GET(req: NextRequest, { params }: Props) {
  return proxy(req, (await params).path);
}
export async function POST(req: NextRequest, { params }: Props) {
  return proxy(req, (await params).path);
}
export async function PUT(req: NextRequest, { params }: Props) {
  return proxy(req, (await params).path);
}
export async function PATCH(req: NextRequest, { params }: Props) {
  return proxy(req, (await params).path);
}
export async function DELETE(req: NextRequest, { params }: Props) {
  return proxy(req, (await params).path);
}
export async function OPTIONS(req: NextRequest, { params }: Props) {
  return proxy(req, (await params).path);
}
