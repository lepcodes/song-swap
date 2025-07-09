"use client"
import '../styles/globals.css'
import Playlist from './Playlist';
import PlaylistSkeleton from "./PlaylistSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServiceStore } from "../stores/useServiceStore";
import { useEffect } from 'react';
// import playlist_query from './playlist_mockup.json'
// const playlists1 = playlist_query.playlists

export default function PlaylistDisplayList() {
  const queryClient = useQueryClient()
  const {originService} = useServiceStore((state) => state)
  const {isAuthenticated} = useServiceStore((state) => state)

  const fetchPlaylists = async (): Promise<Playlist[]> => {
    const response = await fetch('/api/' + originService?.key + '/account-playlists')
    const data: Playlist[] = await response.json()
    return data
  }

  const { data: playlists, status, isLoading } = useQuery({
    enabled: isAuthenticated, 
    queryKey: ['playlists'], 
    queryFn: fetchPlaylists 
  })

  useEffect(() => {
    queryClient.removeQueries({
      queryKey: ['playlists'],
    })
  }, [originService, queryClient])

  return (
    <>
      <div className="display rounded-4xl bg-white overflow-hidden shadow-xs border border-gray-100">
        {
          !playlists ?
          <div className='h-full w-full'>
            <div className='flex flex-col h-full w-full p-4 gap-3 items-center justify-center opacity-15 bg-neutral-200 border border-neutral-400 rounded-4xl'/>
            <h1 className='absolute top-1/2 left-1/2 translate-x-1/2 -translate-y-1/2 border border-neutral-200 py-3 px-6 rounded-4xl bg-accent shadow-xs'>
              Here you can find your playlists
            </h1>
          </div>
          :
          <div className='flex flex-col h-full p-4 gap-3 items-center overflow-y-auto'>
            {
              isLoading && 
              <div className='flex flex-col w-full'>
                <PlaylistSkeleton/>
                <PlaylistSkeleton/>
                <PlaylistSkeleton/>
              </div>
            }
            {
              status === 'success' &&
              playlists.map((playlist) => {
                return (
                  <Playlist
                  id = {playlist.id}
                  key = {playlist.id}
                  name = {playlist.name}
                  owner = {playlist.owner}
                  cover = {playlist.cover}
                  num_tracks = {playlist.num_tracks}
                  // tracks = {[]}
                  // duration = {0}
                  />
                )
              })
            }
          </div>
        }
      </div>
    </>
  );
}
