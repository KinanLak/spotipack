import { Artist, Track } from "../models";
import { mapToArtist, mapToTrack } from "../models";

export interface Album {
    id: string;
    name: string;
    releaseDatePrecision: "year" | "month" | "day";
    releaseDate: Date;
    totalTracks: number;
    albumType: string;
    albumURL: URL;
    pictureURL: URL;
    copyright?: string;
    label?: string;
    genres?: string[];

    artists: Artist[];
    tracks?: Track[];
}

export function mapToAlbum(album: any): Album {
    if (album.genres) {
        return {
            id: album.id,
            name: album.name,
            releaseDatePrecision: album.release_date_precision,
            releaseDate: new Date(album.release_date),
            totalTracks: album.total_tracks,
            albumType: album.album_type,
            albumURL: new URL(album.external_urls.spotify),
            pictureURL: new URL(album.images[0].url),
            copyright: album.label,
            label: album.label,
            genres: album.genres,

            artists: album.artists.map(mapToArtist),
            tracks: album.tracks.map(mapToTrack),
        };
    } else {
        return {
            id: album.id,
            name: album.name,
            releaseDatePrecision: album.release_date_precision,
            releaseDate: new Date(album.release_date),
            totalTracks: album.total_tracks,
            albumType: album.album_type,
            albumURL: new URL(album.external_urls.spotify),
            pictureURL: new URL(album.images[0].url),

            artists: album.artists.map(mapToArtist),
        };
    }
}
