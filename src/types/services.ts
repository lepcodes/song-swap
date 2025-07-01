
export const availableServices = {
  spotify: {
    name: 'Spotify',
    logo: '/icons/spotify.svg',
    key: 'spotify',
    available: true
  },
  youtubeMusic: {
    name: 'YouTube Music',
    logo: '/icons/yt_music.svg',
    key: 'youtubeMusic',
    available: false
  },
  appleMusic: {
    name: 'Apple Music',
    logo: '/icons/apple_music.svg',
    key: 'appleMusic',
    available: false

  },
  amazonMusic: {
    name: 'Amazon Music',
    logo: '/icons/amazon_music.svg',
    key: 'amazonMusic',
    available: true
  },
  tidal: {
    name: 'Tidal',
    logo: '/icons/tidal.svg',
    key: 'tidal',
    available: false
  },
  deezer: {
    name: 'Deezer',
    logo: '/icons/deezer.svg',
    key: 'deezer',
    available: false
  },
} as const;

export type ServiceNames = keyof typeof availableServices
export const ServiceKeys = Object.keys(availableServices) as ServiceNames[]

export type Service =  typeof availableServices[ServiceNames]