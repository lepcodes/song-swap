import '../index.css'
// import playlist_query from '../consts/playlist_mockup.json'
import Playlist from './Playlist';
import { usePlaylistStore } from "../context/usePlaylistStore";

export default function PlaylistDisplayList() {
  const playlists = usePlaylistStore((state) => state.playlists)
  console.log(playlists)
  return (
    <>
      <div className="display rounded-lg shadow-md bg-white overflow-hidden">
        <div className='flex flex-col h-full p-4 gap-3 items-center overflow-y-auto'>
          {
            playlists.map((playlist) => {
              return (
                <Playlist
                  key = {playlist.id}
                  name = {playlist.name}
                  owner = {playlist.owner.display_name}
                  cover = {playlist.images[0].url}
                  tracks = {playlist.tracks.items}
                />
              )
            })
          }
        </div>
      </div>
    </>
  );
}
