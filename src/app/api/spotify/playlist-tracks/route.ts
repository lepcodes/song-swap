import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value
    if (!accessToken) {
        return new Response('Access token not found', { status: 401 })
    }

    const playlistId = request.nextUrl.searchParams.get('playlistId')
    if (!playlistId) {
        return new Response('Playlist id not found', { status: 400 })
    }
    const offset = Number(request.nextUrl.searchParams.get('offset') ?? 0)
    const limit = Number(request.nextUrl.searchParams.get('limit') ?? 100)

    const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}&offset=${offset}`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }
    )
    if (!response.ok) {
        return new Response('Failed to fetch playlists' + response.status, { status: 500 })
    }

    const data = await response.json()
    const tracks: Track[] = data.items.map(
        (track: TrackRaw) => { return {
            id: track.track.id,
            name: track.track.name,
            cover: track.track.album.images[2].url,
            artist: track.track.artists[0].name,
            playlistId: playlistId,
        }} 
    )
    console.log(data)
    const nextOffset = 
        data.next
        ? new URL(data.next).searchParams.get('offset')
        : null
    return NextResponse.json({ tracks, nextOffset })
}
