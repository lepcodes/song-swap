import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
        return new Response('Access token not found', { status: 401 })
    }

    const playlistId = request.nextUrl.searchParams.get('playlistId')
    if (!playlistId) {
        return new Response('Playlist id not found', { status: 400 })
    }

    const response = await fetch('https://api.spotify.com/v1/playlists/' + playlistId, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })

    if (!response.ok) {
        return new Response('Failed to fetch playlists' + response.status, { status: 500 })
    }

    const data = await response.json()
    const tracks: Track[] = data.tracks.items.map(
        (track: TrackRaw) => { return {
            id: track.track.id,
            name: track.track.name,
            cover: track.track.album.images[2].url,
            artist: track.track.artists[0].name,
        }}
    )
    return new Response(JSON.stringify(tracks), { status: 200 })
}









