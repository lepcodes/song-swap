import axios from "axios"

export const fetchPlaylist = async (playlistUrl) => {
  const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'/playlist', {
    params: { 
      url: playlistUrl
    },
    withCredentials: true
  })
  return response.data
}