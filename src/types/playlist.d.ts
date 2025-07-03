type Playlist = {
    id: string,
    name: string,
    owner: string,
    cover: string,
    num_tracks: number,
}

type Track = {
    id: string,
    name: string,
    cover: string,
    artist: string
    playlistId: string,
}

type SpotifyPlaylistImage = {
    height: number,
    url: string,
    width: number
}

type SpotifyPlaylistItemRaw = {
    collaborative: boolean,
    description: string,
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: SpotifyPlaylistImage[],
    name: string,
    owner: {
        display_name: string,
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        type: string,
        uri: string
    },
    public: boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    },
    type: string,
    uri: string
}