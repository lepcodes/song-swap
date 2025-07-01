import { useState } from "react"
import { useServiceStore } from "../context/useServiceStore";
import { GoLink } from "react-icons/go";
import { MdOutlineLock } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Separator } from "./ui/separator"
import { oauth } from "../api/oauth"
import { fetchPlaylist } from "../api/fetchPlaylist"
import { fetchAccountPlaylists } from "../api/fetchAccountPlaylists"
import '../index.css'
import { usePlaylistStore } from "../context/usePlaylistStore";

export function AccessPlaylist() {
  // Global States
  const originService = useServiceStore((state) => state.originService)
  const setPlaylists = usePlaylistStore((state) => state.setPlaylists)
  const setAccountPlaylists = usePlaylistStore((state) => state.setAccountPlaylists)
  
  // Local States
  const [playlistUrl, setPlaylistUrl] = useState()
  const [authStatus, setAuthStatus] = useState()
  const [fetchStatus, setFetchStatus] = useState()

  const handlePlaylistUrl = (event) => {
    setPlaylistUrl(event.target.value)
  }

  const handleClickAccount = async () => {
    setAuthStatus('logging')
    const oauth_status = await oauth()
    setAuthStatus(oauth_status)
    setFetchStatus('fetching')
    if (oauth_status === 'logged'){
      const { status, data } = await fetchAccountPlaylists()
      console.log(data)
      console.log(status)
      setFetchStatus(status)
      setAccountPlaylists(data)
    }
  }

  const handleClickSubmit = async (event) => {
    event.preventDefault()
    setAuthStatus('logging')

    const oauth_status = await oauth()
    setAuthStatus(oauth_status)

    if (oauth_status === 'logged'){
      const { status, data } = await fetchPlaylist(playlistUrl)
      setPlaylists(data)
      console.log(status)
      console.log(data)
    }
  }

  return (
    <>
      <div className="access flex justify-center items-center bg-transparent p-0">
        <div className={`flex flex-col gap-2 items-center justify-evenly w-full h-full px-6 py-6 border border-gray-200 rounded-lg shadow-lg
          ${originService.name 
          ? 'bg-white opacity-100 border-none ' 
          : 'bg-gray-300 opacity-15 border-gray-400 border pointer-events-none cursor-not-allowed'}`}>
          <h2 className="text-xl font-bold text-center">
            Access Your {originService.name} Playlist
          </h2>
          <h3 className="mb-5">
            Choose how you want to access your playlist
          </h3>
          <button className="w-full p-2 rounded-lg bg-black text-white text-base hover:cursor-pointer"
                  onClick={handleClickAccount}>
            Sign in with Account
          </button>

          <div className="flex items-center w-full my-2"> 
            <Separator className="w-[30%] grow" /> 
            <span className="px-4">or</span> 
            <Separator className="w-[30%] grow" /> 
          </div> 

          <form action="" className="flex flex-col gap-4 w-full">
            <GoLink className="absolute m-2 w-6 h-6 text-gray-600 " target="playlist_url"/>
            <input className='rounded-md p-2 pl-10 bg-gray-100 text-black' 
                  type="text" 
                  name="playlist_url" 
                  id="playlist_url" 
                  placeholder={`Enter${originService.name && " " + originService.name} Playlist URL`}
                  onChange={handlePlaylistUrl}/>
            <input className='rounded-md p-2 bg-gray-600 text-white hover:cursor-pointer' 
                  type="submit" 
                  id="Access Playlist"
                  // value={`Access Playlist ${authStatus=='logging'? "Logging": ""}`}
                  value={`Access Playlist ${authStatus}`}
                  onClick={handleClickSubmit}/>
          </form>
        </div>
        {
          ! originService.name
          ?
          <div className="absolute border border-gray-400 rounded-xl p-4 bg-white">
            <MdOutlineLock className="opacity-200 w-14 h-14"/>
          </div>
          :
          <></>
        }
        
      </div>
      <div>
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
      </div>
    </>    
  )
}