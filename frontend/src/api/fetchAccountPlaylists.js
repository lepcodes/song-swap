import axios from "axios"

export const fetchAccountPlaylists = async () => {
    const response = await axios.get('http://localhost:8000/account-playlists')
    return response.data
}