import Image from "next/image"
import Track from "./Track"
import { MoonLoader } from "react-spinners"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Separator } from "./ui/separator"
import { Checkbox } from "./ui/checkbox"
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegTrashAlt } from "react-icons/fa";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useServiceStore } from "../stores/useServiceStore";
import { usePlaylistStore } from "../stores/usePlaylistStore";
import React, { useState, useEffect, useMemo } from "react";

interface PlaylistProps extends Playlist{
  ref: React.Ref<HTMLDivElement>
  onDrowpDown: () => void
}

export default function Playlist({id, name, cover, owner, num_tracks, ref, onDrowpDown}: PlaylistProps){
  const [ isPlaylistChecked , setIsPlaylistChecked ] = useState(true)
  const [ isCollapsed, setIsCollapsed ] = useState(true)
  const [ shouldFetchTracks, setShouldFetchTracks ] = useState(false)
  const originService = useServiceStore((state) => state.originService)
  const removePlaylist = usePlaylistStore((state) => state.removePlaylist)
  const addAllTracks = usePlaylistStore((state) => state.addAllTracks)
  const playlists = usePlaylistStore((state) => state.playlists)
  
  const fetchPlaylistTracks = async ({ pageParam } : { pageParam: number }): Promise<TracksPage> => {
    const response = await fetch(
      `/api/${originService?.key}/playlist-tracks?playlistId=${id}&offset=${pageParam}&limit=100`
    )
    const data: TracksPage = await response.json()
    data.nextOffset = data.nextOffset ? Number(data.nextOffset) : null
    return data
  }
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({ 
    enabled: shouldFetchTracks,
    queryKey: ['tracks'+id], 
    queryFn: fetchPlaylistTracks,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    
  })

  const tracks = useMemo(() => {
    return data?.pages.flatMap((page) => page.tracks);
  }, [data?.pages]);
  
  const handleCheckedChangeDisplay = (checked: boolean) => {
    setIsPlaylistChecked(checked)
    if (!checked){
      removePlaylist(id)
    }
    else if (checked){
      addAllTracks(id)
    }
  }

  useEffect(() => {
    if (!isCollapsed){
      setShouldFetchTracks(true)
    }
    if (tracks){
      setShouldFetchTracks(false)
    }
  }, [isCollapsed, tracks])

  useEffect(() => {
    if (status === 'success'){
      onDrowpDown()
    }
  }, [isCollapsed, status, onDrowpDown])

  return ( 
    <>
      <Collapsible ref={ref} className="flex flex-col gap-2 w-full h-full border-gray-200 border rounded-3xl bg-[#f7f4ef] ">
        <div className="flex flex-row relative flex-wrap justify-start items-center m-4 gap-4">
          <CollapsibleTrigger 
            className="hover:cursor-pointer hover:bg-white hover:rounded-lg"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {
              isCollapsed
              ?
              <IoIosArrowForward className="m-1 h-6 w-6"/>
              :
              <IoIosArrowDown className="m-1 h-6 w-6"/>
            }
          </CollapsibleTrigger>
          <Image src={cover} alt="cover" width={80} height={80} className="rounded-xl"/>
          <div className="h-20 flex flex-col justify-between p-2">
            <div className="flex flex-wrap gap-x-6">
              <h1 className="text-lg font-bold">{name}</h1> 
              <span className="text-sm py-1 px-2 text-white bg-neutral-400 rounded-md ">{"Playlist"}</span>
            </div>
            <div className="flex flex-wrap gap-x-6 text-sm">
              <p>{owner}</p>
              <Separator className='h-6' orientation="vertical"/> 
              <p>{num_tracks} tracks</p>
              {
                playlists.has(id) && 
                <>
                  <Separator className='h-6' orientation="vertical"/>
                  <div className="flex flex-row items-center gap-1">
                    <p className="text-sm text-neutral-400">
                      <span className="font-bold">
                        {playlists.get(id)?.size} tracks
                      </span>
                      {" discarded"}
                    </p>
                    <FaRegTrashAlt className="w-3.5 h-3.5 text-neutral-400 ml-1"/>
                  </div>
                </>
              }
            </div>
          </div>

          <Checkbox 
            checked={isPlaylistChecked}
            className="w-5 h-5 absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
            onCheckedChange={handleCheckedChangeDisplay}
          />
          
        </div>
        
        <CollapsibleContent className="h-full overflow-y-hidden">
          <div className="flex flex-col justify-center items-center w-full">
            <hr className="w-[96%]"/>
            <MoonLoader className="mt-6" size={18} loading={isLoading}/>
          </div>
          <div className="flex flex-col m-4 gap-3 pl-12 max-h-full overflow-y-scroll">
            {
              status === 'success' &&
              tracks?.map((track) => {
                return (
                  <Track
                    id={track.id}
                    key={track.id}
                    name={track.name}
                    cover={track.cover}
                    artist={track.artist}
                    playlistId={id}
                  />
                )
              })
            }
            {
              status === 'success' && hasNextPage &&
              <div className="flex flex-col w-full items-center justify-center gap-2">
                <div className="w-[98%] h-px scale-y-[0.5] bg-gray-300"/>
                {
                  !isFetchingNextPage ?
                  <button 
                    onClick={() => fetchNextPage()}
                    className="text-gray-400 p-2 hover:cursor-pointer hover:text-neutral-700"
                    >
                    <p>Load More</p>
                  </button>
                  :
                  <MoonLoader className="mt-1" size={18}/>
                }
              </div>
            }
            {
              status === 'error' &&
              <div className="flex flex-col w-full items-center justify-center gap-2 p-3 rounded-lg bg-red-200 text-red-700 text-base">
                <h1 className="font-bold">Error</h1>
                <p className="text-sm">Something went wrong</p>
              </div>
            }
            <div className="flex">
              <div className="h-6"></div>
            </div>
          </div>
        </CollapsibleContent>

      </Collapsible>
    </>
  )
}