import { Checkbox } from "./ui/checkbox";
import Image from "next/image";
import { usePlaylistStore } from "../stores/usePlaylistStore";

export default function Track({id, name, cover, artist, playlistId}: Track){
  const playlists = usePlaylistStore((state) => state.playlists)
  const toggleDiscardedTrack = usePlaylistStore((state) => state.toggleDiscardedTrack)
  const isChecked = !playlists.get(playlistId)?.has(id)

  const handleCheckedChange = () => {
    toggleDiscardedTrack(playlistId, id)
  }

  return (
    <>
      <div className="flex flex-row gap-5 w-full items-center pl-0">
        <Checkbox 
          onCheckedChange={handleCheckedChange}
          checked={isChecked}
        />
        <div className="flex flex-row items-center gap-2">
          <Image src={cover} alt="cover" width={64} height={64} className="rounded-xl"/>
          <div className="h-16 flex flex-col justify-evenly gap-2">
            <h1>{name}</h1>
            <div className="flex">
              <span className="text-sm p-1 text-gray-600 bg-gray-100 rounded-md ">
                {artist}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}