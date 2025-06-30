import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('access_token')?.value
  if (!accessToken) {
    return new Response('Access token not found', { status: 401 })
  }

  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!response.ok) {
    return new Response('Failed to fetch playlists', { status: 500 })
  }

  const data = await response.json()
  console.log(data)
  return new Response(JSON.stringify(data), { status: 200 })
}
