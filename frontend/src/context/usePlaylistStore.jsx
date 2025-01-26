import {create} from 'zustand'

export const usePlaylistStore = create((set) => ({
    playlists: [],
    setPlaylists: (playlist) => {
        set((state) => ({
            playlists: [...state.playlists, playlist]
        }))
    }
}))
