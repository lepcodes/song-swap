import axios from "axios"

export const fetchPlaylist = async (playlistUrl) => {
  const response = await axios.get('http://localhost:8000/playlist',{
    params: { 
      url: playlistUrl
    }
  })
  return response.data
}