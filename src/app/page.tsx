import Header from "../components/Header"
import PlaylistDisplayList from "../components/PlaylistDisplayList";
import StreamingServicesSelection from "../components/StreamingServicesSelection";
import AccessPlaylist from "../components/AccessPlaylist";

export default function Home() {
  return (
    <div className="main h-screen">

      <Header/>

      <AccessPlaylist/>
      
      <StreamingServicesSelection/>

      <PlaylistDisplayList/>

      <div className="footer h-20 flex flex-row flex-1 gap-5 items-center flex-wrap bg-white rounded-4xl p-4 shadow-xs border border-gray-100"></div>
    
    </div>
  );
}
