export default async (event: any) => {
  const convexSiteUrl = process.env.VITE_CONVEX_SITE_URL
  if (!convexSiteUrl) {
    return new Response('VITE_CONVEX_SITE_URL not configured', { status: 500 })
  }

  const request: Request = event.request || event
  const requestUrl = new URL(request.url)
  const nextUrl = `${convexSiteUrl}${requestUrl.pathname}${requestUrl.search}`
  const headers = new Headers(request.headers)
  headers.set('accept-encoding', 'application/json')
  headers.set('host', new URL(convexSiteUrl).host)

  return fetch(nextUrl, {
    method: request.method,
    headers,
    redirect: 'manual',
    body: request.body,
    duplex: 'half',
  } as any)
}
