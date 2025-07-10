type Playlist = {
    id: string,
    name: string,
    owner: string,
    cover: string,
    num_tracks: number,
}

type Track = {
    id: string,
    name: string,
    cover: string,
    artist: string
    playlistId: string,
}

type TracksPage = {
    tracks: Track[],
    nextOffset: number | null
}

type SpotifyPlaylistImage = {
    height: number,
    url: string,
    width: number
}

type SpotifyPlaylistItemRaw = {
    collaborative: boolean,
    description: string,
    external_urls: {
        spotify: string
    },
    href: string,
    id: string,
    images: SpotifyPlaylistImage[],
    name: string,
    owner: {
        display_name: string,
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        type: string,
        uri: string
    },
    public: boolean,
    snapshot_id: string,
    tracks: {
        href: string,
        total: number
    },
    type: string,
    uri: string
}

type TrackRaw = {
  added_at: string;
  added_by: {
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    type: 'user';
    uri: string;
  };
  is_local: boolean;
  track: {
    album: {
      album_type: string;
      total_tracks: number;
      available_markets: string[];
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      images: Array<{
        url: string;
        height: number;
        width: number;
      }>;
      name: string;
      release_date: string;
      release_date_precision: 'year' | 'month' | 'day';
      restrictions?: {
        reason: string;
      };
      type: 'album';
      uri: string;
      artists: Array<{
        external_urls: {
          spotify: string;
        };
        href: string;
        id: string;
        name: string;
        type: 'artist';
        uri: string;
      }>;
    };
    artists: Array<{
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      name: string;
      type: 'artist';
      uri: string;
    }>;
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
      ean: string;
      upc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from?: object; // adjust type if structure is known
    restrictions?: {
      reason: string;
    };
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: 'track';
    uri: string;
    is_local: boolean;
  };
}