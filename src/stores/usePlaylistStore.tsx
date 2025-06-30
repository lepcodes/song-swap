import {create} from 'zustand'

interface PlaylistState {
    isFetchingAccountPlaylists: boolean,
    setIsFetchingAccountPlaylists: (isFetchingAccountPlaylists: boolean) => void,
    playlists: Playlist[],
    setPlaylists: (playlists: Playlist[]) => void,
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
    isFetchingAccountPlaylists: false,
    setIsFetchingAccountPlaylists: (isFetchingAccountPlaylists: boolean) => {
        set({isFetchingAccountPlaylists: isFetchingAccountPlaylists})
    },
    playlists: [],
    setPlaylists: (playlists) => {
        set({playlists: playlists})
    }
}))
