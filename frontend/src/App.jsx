import Header from "./components/Header"
import PlaylistDisplayList from "./components/PlaylistDisplayList";
import StreamingServicesSelection from "./components/StreamingServicesSelection";
import { AccessPlaylist } from "./components/AccessPlaylist";
import './index.css'

export default function App() {
  
  return (
    <>  
      <div className="main font-lexendExa">

        <Header/>
        
        <StreamingServicesSelection/>

        <PlaylistDisplayList/>

        <AccessPlaylist/>

        <div className="footer flex flex-row flex-1 gap-5 items-center flex-wrap bg-white rounded-lg p-4 shadow-lg">Footer</div>
      
      </div>
    </>
  );
}
