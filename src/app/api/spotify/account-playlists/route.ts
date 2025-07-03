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
    return new Response('Failed to fetch playlists' + response.status, { status: 500 })
  }

  const data = await response.json()
  const playlists: Playlist[] = data.items.map(
    (playlist: SpotifyPlaylistItemRaw) => { return {
      id: playlist.id,
      name: playlist.name,
      owner: playlist.owner.display_name,
      cover: playlist.images[0].url,
      num_tracks: playlist.tracks.total,
    }}
  )
  return new Response(JSON.stringify(playlists), { status: 200 })
}
