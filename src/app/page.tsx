import Header from "../components/Header"
import PlaylistDisplayList from "../components/PlaylistDisplayList";
import StreamingServicesSelection from "../components/StreamingServicesSelection";
import AccessPlaylist from "../components/AccessPlaylist";
import TransferPlaylists from "../components/TransferPlaylists";

export default function Home() {
  return (
    <div className="main h-screen">

      <Header/>

      <AccessPlaylist/>
      
      <StreamingServicesSelection/>

      <PlaylistDisplayList/>

      <TransferPlaylists/>

    </div>
  );
}
