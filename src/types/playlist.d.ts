type Playlist = {
    id: string,
    name: string,
    owner: string,
    cover: string,
    tracks: Track[],
    duration: number
}

type Track = {
    id: string,
    name: string,
    cover: string,
    artist: string
}