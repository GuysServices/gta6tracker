import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const revalidate = 86400

const UPSTREAM = 'https://maps.gtadb.org/tiles/6/gtadb,1'

export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } },
) {
  const path = params.path ?? []

  // Only allow GTADB's expected zoom/row/column JPEG tile paths.
  if (
    path.length !== 2 ||
    !/^\d$/.test(path[0]) ||
    !/^\d+,[0-9]+,[0-9]+\.jpg$/.test(path[1])
  ) {
    return new Response('Invalid map tile path', { status: 400 })
  }

  try {
    const upstream = await fetch(`${UPSTREAM}/${path[0]}/${path[1]}`, {
      headers: {
        Accept: 'image/avif,image/webp,image/apng,image/jpeg,*/*;q=0.8',
        Referer: 'https://gtadb.org/',
        Origin: 'https://gtadb.org',
        'User-Agent': 'Mozilla/5.0 (compatible; GTA6Tracker/1.0)',
      },
      next: { revalidate: 86400 },
    })

    if (!upstream.ok) {
      return new Response(`GTADB tile upstream returned ${upstream.status}`, {
        status: upstream.status,
        headers: { 'Cache-Control': 'no-store' },
      })
    }

    const contentType = upstream.headers.get('content-type') ?? 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      return new Response('GTADB returned a non-image tile', { status: 502 })
    }

    return new Response(await upstream.arrayBuffer(), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch {
    return new Response('Unable to fetch GTADB map tile', { status: 502 })
  }
}
