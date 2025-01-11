import Header from "./components/Header"
import PlaylistDisplayList from "./components/PlaylistDisplayList";

import StreamingServicesSelection from "./components/StreamingServicesSelection";

export default function App() {
  
  return (
    <>  
      <div className="grid grid-rows-12 grid-cols-10 h-screen gap-4 p-4">

        <Header/>
        
        <StreamingServicesSelection/>

        <PlaylistDisplayList/>

        <div className="row-span-7 col-span-3 flex flex-row flex-1 gap-5 items-center flex-wrap bg-white rounded-lg p-4 shadow-lg">Dummy</div>
      
      </div>
    </>
  );
}
