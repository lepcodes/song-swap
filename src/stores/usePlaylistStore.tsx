import { create } from 'zustand'

type PlaylistId = string
type TrackId = string
type DiscardedTrackId = Set<TrackId>
interface PlaylistState {
  playlists: Map<PlaylistId, DiscardedTrackId>,
  toggleDiscardedTrack: (playlistId: PlaylistId, trackId: TrackId) => void,
  discardAllTracks: (playlistId: PlaylistId, tracksIds: TrackId[]) => void,
  addAllTracks: (playlistId: PlaylistId) => void
  removePlaylist: (playlistId: PlaylistId) => void
  addPlaylist: (playlistId: PlaylistId) => void
  clearPlaylists: () => void
}

export const usePlaylistStore = create<PlaylistState>((set) => ({
  playlists: new Map(),
  toggleDiscardedTrack: (playlistId: PlaylistId, trackId: TrackId) => set((state) => {
    const currentMap = new Map(state.playlists);
    if (!currentMap.has(playlistId)) {
      return { playlists: currentMap };
    }
    const currentSet = currentMap.get(playlistId) ?? new Set();
    const newSet = new Set(currentSet);
    if (newSet.has(trackId)) {
      newSet.delete(trackId);
    } else {
      newSet.add(trackId);
    }
    currentMap.set(playlistId, newSet);
    return { playlists: currentMap };
  }),
  discardAllTracks: (playlistId: PlaylistId, tracksIds: TrackId[]) => set((state) => {
    const currentMap = new Map(state.playlists);
    currentMap.set(playlistId, new Set(tracksIds));
    return { playlists: currentMap };
  }),
  addAllTracks: (playlistId: PlaylistId) => set((state) => {
    const currentMap = new Map(state.playlists);
    currentMap.set(playlistId, new Set());
    return { playlists: currentMap };
  }),
  removePlaylist: (playlistId: PlaylistId) => set((state) => {
    const currentMap = new Map(state.playlists);
    currentMap.delete(playlistId);
    return { playlists: currentMap };
  }),
  addPlaylist: (playlistId: PlaylistId) => set((state) => {
    const currentMap = new Map(state.playlists);
    currentMap.set(playlistId, new Set());
    return { playlists: currentMap }; 
  }),
  clearPlaylists: () => set(() => {
    return { playlists: new Map() };
  })
}))
