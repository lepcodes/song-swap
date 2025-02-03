import axios from "axios"

export const fetchAccountPlaylists = async () => {
    const response = await axios.get(import.meta.env.VITE_BACKEND_URL+'/account-playlists', {
        withCredentials: true
    })
    return response.data
}