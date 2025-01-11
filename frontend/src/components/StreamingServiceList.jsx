import spotify_logo from "../assets/icons/spotify.svg"
import yt_music_logo from "../assets/icons/yt_music.svg"
import deezer_logo from "../assets/icons/deezer.svg"
import tidal_logo from "../assets/icons/tidal.svg"
import apple_music_logo from "../assets/icons/apple_music.svg"
import amazon_music_logo from "../assets/icons/amazon_music.svg"
import { StreamingServiceContext } from "../context/StreamingServiceContext"
import { useContext } from "react"

const availableServices = [
  {
    name: "Spotify",
    logo: spotify_logo
  },
  {
    name: "Youtube Music",
    logo: yt_music_logo
  },
  {
    name: "Deezer",
    logo: deezer_logo
  },
  {
    name: "Tidal",
    logo: tidal_logo
  },
  {
    name: "Apple Music",
    logo: apple_music_logo
  },
  {
    name: "Amazon Music",
    logo: amazon_music_logo
  }
]

export default function StreamingServiceList({source}){
  const {setOriginService, setTargetService} = useContext(StreamingServiceContext)
  
  const handleClick = (service) => {
    return(
      () => {
        if(source === 'origin'){
          setOriginService(service)
        }
        else if(source === 'target'){
          setTargetService(service)
        }
      }
    )
  }

  return (
    <>
      <div className="p-4 overflow-y-auto flex flex-wrap justify-evenly gap-10">
        {availableServices.map((service) => {
          return (
            <div key={service.name} 
                    className="flex flex-col gap-2 justify-center items-center border p-5 rounded-xl hover:bg-gray-100 hover:cursor-pointer"
                    onClick={handleClick(service)}>
              <img className="w-40 h-40" src={service.logo} alt={service.name}/>
              <div className="text-base">
                {service.name}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}