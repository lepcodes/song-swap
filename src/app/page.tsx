import Header from "../components/Header"
import PlaylistDisplayList from "../components/PlaylistDisplayList";
import StreamingServicesSelection from "../components/StreamingServicesSelection";
import AccessPlaylist from "../components/AccessPlaylist";

export default function Home() {
  return (
    <div className="main font-lexend-exa h-screen">

      <Header/>

      <AccessPlaylist/>
      
      <StreamingServicesSelection/>

      <PlaylistDisplayList/>

      <div className="footer flex flex-row flex-1 gap-5 items-center flex-wrap bg-white rounded-lg p-4 shadow-xs border border-gray-200"></div>
    
    </div>
  );
}
