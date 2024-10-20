export interface Artist {
    id: string;
    name: string;
    popularity?: number; // 0-100
    genres?: string[];
    followers?: number;
    artistURL: URL;
    pictureURL?: URL;
}

export function mapToArtist(artist: any): Artist {
    if (artist.genres) {
        return {
            id: artist.id,
            name: artist.name,
            popularity: artist.popularity,
            genres: artist.genres,
            followers: artist.followers.total,
            artistURL: new URL(artist.external_urls.spotify),
            pictureURL: new URL(artist.images[0].url),
        };
    } else {
        return {
            id: artist.id,
            name: artist.name,
            artistURL: new URL(artist.external_urls.spotify),
        };
    }
}