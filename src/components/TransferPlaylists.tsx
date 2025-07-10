'use client'

import { usePlaylistStore } from "../stores/usePlaylistStore";
import { useServiceStore } from "../stores/useServiceStore";

export default function TransferPlaylists() {
  const playlists = usePlaylistStore((state) => state.playlists)
  const targetService = useServiceStore((state) => state.targetService)
  return (
    <>
      <div className="footer flex flex-col bg-white rounded-4xl p-2 shadow-xs border border-gray-100 justify-center items-center">
        <button className={`border-1 h-full w-full p-2 text-center rounded-full  text-white ${(playlists.size > 0 && targetService) ? 'bg-neutral-600 hover:cursor-pointer' : 'bg-neutral-200'}`}>
            Transfer <span className="font-extrabold">{playlists.size}</span> Playlists to <span className="font-extrabold">{targetService ? targetService.name : '...'}</span>
        </button>
      </div>
    </>
  )
}