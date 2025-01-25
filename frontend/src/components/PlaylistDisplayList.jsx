import '../index.css'
import playlist_query from '../consts/playlist_mockup.json'
import Playlist from './Playlist';

export default function PlaylistDisplayList() {
  return (
    <>
      <div className="display flex flex-col gap-2 rounded-lg p-4 shadow-md bg-white overflow-scroll">
        {
          playlist_query.playlists.map((playlist) => {
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
    </>
  );
}
