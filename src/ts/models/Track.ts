import { Artist, Album } from "../models";
import { mapToArtist, mapToAlbum } from "../models";

export interface Track {
    id: string;
    name: string;
    duration: number; // in milliseconds
    popularity?: number; // 0-100
    explicit: boolean;
    trackNumber: number; // track number in album
    trackURL: URL;
    previewURL: URL; // 30 seconds MP3 preview

    artists: Artist[];
    album?: Album;
}

export function mapToTrack(track: any): Track {
    if (track.album) {
        return {
            id: track.id,
            name: track.name,
            duration: track.duration_ms,
            popularity: track.popularity,
            explicit: track.explicit,
            trackNumber: track.track_number,
            trackURL: new URL(track.external_urls.spotify),
            previewURL: new URL(track.preview_url),

            album: mapToAlbum(track.album),
            artists: track.artists.map(mapToArtist),
        };
    } else {
        return {
            id: track.id,
            name: track.name,
            duration: track.duration_ms,
            explicit: track.explicit,
            trackNumber: track.track_number,
            trackURL: new URL(track.external_urls.spotify),
            previewURL: new URL(track.preview_url),

            artists: track.artists.map(mapToArtist),
        };
    }
}
