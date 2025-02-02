import axios from "axios"

export const fetchAccountPlaylists = async () => {
    const response = await axios.get('http://localhost:8000/account-playlists',{ withCredentials: true })
    return response.data
}