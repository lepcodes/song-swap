"use client"
import '../styles/globals.css'
import Playlist from './Playlist';
import PlaylistSkeleton from "./PlaylistSkeleton";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import playlist_query from './playlist_mockup.json'
const playlists = playlist_query.playlists

export default function PlaylistDisplayList() {
  const {playlists, isFetchingAccountPlaylists } = usePlaylistStore()
  return (
    <>
      <div className="display rounded-lg shadow-md bg-white overflow-hidden">
        <div className='flex flex-col h-full p-4 gap-3 items-center overflow-y-auto'>
          {
            isFetchingAccountPlaylists && playlists.length === 0 && 
            <div className='flex flex-col w-full'>
              <PlaylistSkeleton/>
              <PlaylistSkeleton/>
              <PlaylistSkeleton/>
            </div>
          }
          {
            playlists.map((playlist) => {
              return (
                <Playlist
                  id = {playlist.id}
                  key = {playlist.id}
                  name = {playlist.name}
                  owner = {playlist.owner.display_name}
                  cover = {playlist.images[0].url}
                  tracks = {[]}
                  duration = {100}
                />
              )
            })
          }
        </div>
      </div>
    </>
  );
}
