import Track from "./Track"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Separator } from "./ui/separator"
import { Checkbox } from "./ui/checkbox"
import { IoIosArrowDown } from "react-icons/io";

export default function Playlist({name, cover, owner, tracks}){
  
  return ( 
    <>
      <Collapsible className="flex flex-col gap-2 w-full border-gray-200 border rounded-lg shadow-sm">
        <div className="flex flex-row relative flex-wrap justify-start items-center m-4 gap-4">
          <Checkbox 
            className="w-5 h-5"
            onCheckedChange={(checked) => {console.log(checked)}}
          />
          <img className="w-20 h-20 rounded-xl" src={cover} alt="cover"/>
          
          <div className="h-20 flex flex-col justify-between p-2">
            <div className="flex flex-wrap gap-x-6">
              <h1 className="text-xl font-bold">{name}</h1> 
              <span className="text-sm p-1 text-gray-600 bg-gray-100 rounded-md ">{"Playlist"}</span>
            </div>
            <div className="flex flex-wrap gap-x-6">
              <p>{owner}</p>
              <Separator className='h-6' orientation="vertical"/> 
              <p>{2} tracks</p>
              <Separator className='h-6' orientation="vertical"/>
              <p>{"2:30"} hours</p>
            </div>
          </div>

          <CollapsibleTrigger className="absolute right-0 top-10 -translate-y-1/2 hover:cursor-pointer hover:bg-gray-200 hover:rounded-lg">
            <IoIosArrowDown className="m-1 h-6 w-6"/>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="">
          <div className="flex justify-center">
            <hr className="w-[96%]"/>
          </div>

          <div className="flex flex-col m-4 gap-3 max-h-96 overflow-y-auto">
            {
              tracks.map((track) => {
                return (
                  <Track
                    key={track.track.id}
                    name={track.track.name}
                    cover={track.track.album.images[2].url}
                    artist={track.track.album.artists[0].name}
                  />
                )
              })
            }
          </div>
        </CollapsibleContent>

      </Collapsible>
    </>
  )
}