"use client"

import React, { MouseEventHandler, useState, useEffect } from "react"
import { useServiceStore } from "../stores/useServiceStore";
import { GoLink } from "react-icons/go";
import { MdOutlineLock } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import '../styles/globals.css'
import { Message } from "../types/services";


export default function AccessPlaylist() {
  // Global States
  const originService = useServiceStore((state) => state.originService)
  const isAuthenticated = useServiceStore((state) => state.isAuthenticated)
  const setIsAuthenticated = useServiceStore((state) => state.setIsAuthenticated)
  
  // Local States
  const [playlistUrl, setPlaylistUrl] = useState<string>('')
  const [isAccountLoading, setIsAccountLoading] = useState(false)

  const handlePlaylistUrl: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPlaylistUrl(e.target.value)
    console.log(playlistUrl)
  }

  const handleClickAccount: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();
    try {
      setIsAccountLoading(true)
      const response = await fetch('/api/auth/login-url/'+originService?.key)
      const data = await response.json()
      const url = data.url
      if (!url){
        throw new Error('No url found')
      }
      window.open(url)  
    } catch (error) {
      setIsAccountLoading(false)
      console.log(error)
    }
  }

  const handleClickSubmit: React.FormEventHandler<HTMLInputElement> = async () => {
    // setAuthStatus('logging')
  }

  useEffect(() => {
    if (!isAccountLoading){
      return
    }

    const channel = new BroadcastChannel('auth');
    channel.onmessage = (e: MessageEvent) => {
      const data: Message = e.data;
      if (data === 'success'){
        setIsAuthenticated(true)
        setIsAccountLoading(false)
      }
      else if (data === 'error'){
        setIsAuthenticated(false)
        setIsAccountLoading(false)
      }
    };

    return () => {
      channel.close();
    };
  }, [isAccountLoading, setIsAuthenticated]);

  useEffect(() => {
    setIsAccountLoading(false)
    setIsAuthenticated(false)
  }, [originService, setIsAuthenticated]);

  return (
    <>
      <div className="access flex justify-center items-center bg-transparent p-0 h-fit">
        <div className={`flex flex-col gap-2 items-center justify-evenly w-full h-full px-6 py-6 rounded-lg shadow-xs
          ${originService
          ? 'bg-white opacity-100 border' 
          : 'bg-gray-300 opacity-15 border-gray-400 border pointer-events-none cursor-not-allowed'}`}>
          <h2 className="text-xl font-bold text-center">
            Access Your {originService?.name} Playlist
          </h2>
          <h3 className="mb-5">
            Choose how you want to get your playlists
          </h3>
          <button 
            className="flex flex-row justify-center items-center gap-4 w-full p-2 rounded-lg bg-neutral-800 text-white text-base hover:cursor-pointer"
            onClick={handleClickAccount}
            disabled={isAccountLoading}
          >
            {
              isAccountLoading && !isAuthenticated ? 
                <span>Authenticating...</span>
                :
                <span>Access Your Account Playlists</span>
            }
            <MoonLoader color="#fff" size={18} loading={isAccountLoading}/>
          </button>
          
          <div className="flex items-center gap-4 h-6 w-full my-2">
            <div className="w-full h-px scale-y-[0.5] bg-gray-600"/>
            <span>or</span>
            <div className="w-full h-px scale-y-[0.5] bg-gray-600"/>
          </div>

          <form action="" className="flex flex-col justify-center gap-4 w-full">
            <div className="w-full flex flex-row justify-between items-center">
              <GoLink className="absolute mx-3 w-4 h-4 text-gray-600 " target="playlist_url"/>
              <input className='w-full rounded-md p-2 pl-10 bg-gray-100 text-black text-base' 
                    type="text" 
                    name="playlist_url" 
                    id="playlist_url" 
                    placeholder={`Enter ${originService ? originService.name + " " : ""}playlist URL`}
                    onChange={handlePlaylistUrl}/>
            </div>
            <div className="group rounded-md p-2 bg-neutral-600 text-white hover:cursor-pointer flex flex-row justify-center items-center gap-4">
              <input className='group-hover:cursor-pointer'
                type="submit" 
                id="Access Playlist"
                value={`Access Playlist URL`}
                onSubmit={handleClickSubmit}
              />
              {/* <MoonLoader color="#fff" size={18} loading={isPlaylistLoading}/> */}
            </div>
          </form>
        </div>
        {
          ! originService
          ?
          <div className="absolute border border-gray-400 rounded-xl p-4 bg-white">
            <MdOutlineLock className="opacity-200 w-14 h-14"/>
          </div>
          :
          <></>
        }
        
      </div>
      {/* <div>
        <AlertDialog open={authStatus === 'logging' || fetchStatus === 'fetching'} >
          <AlertDialogContent className='w-96'>
            <AlertDialogHeader className='flex flex-col gap-5'>
              <AlertDialogTitle className='text-4xl'>Loading...</AlertDialogTitle>
              <AlertDialogDescription className='text-xl'>
                Getting your playlists. Hold on a sec.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div> */}
    </>    
  )
}