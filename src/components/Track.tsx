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
      <div className="relative flex flex-row gap-5 w-full justify-between pl-0">
        <div className="flex flex-row items-center gap-3">
          <Image src={cover} alt="cover" width={64} height={64} className="rounded-xl"/>
          <div className="h-16 flex flex-col justify-evenly gap-1">
            <h1>{name}</h1>
            <div className="flex">
              <span className="text-sm text-neutral-700 rounded-md ">
                {artist}
              </span>
            </div>
          </div>
        </div>
        <Checkbox 
          className="w-5 h-5 absolute top-1/2 -translate-y-1/2 right-0 -translate-x-1/2"
          onCheckedChange={handleCheckedChange}
          checked={isChecked}
        />
      </div>
    </>
  )
}