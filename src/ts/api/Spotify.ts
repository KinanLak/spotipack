import AuthManager from "./AuthManager";
import { User, Track, Artist, Album, mapToArtist, mapToTrack } from "../models";

export default class Spotify {
    private authManager: AuthManager;
    public loggedUser: User | null;

    public topArtists: Artist[] = [];
    public topTracks: Track[] = [];



    constructor(authManager: AuthManager) {
        this.authManager = authManager;
        this.loggedUser = null;
    }

    private get headers() {
        return {
            Authorization: "Bearer " + this.authManager.getAccessToken(),
        };
    }

    public async getLoggedUserInfos() {
        let response: Response;

        try {
            response = await fetch(process.env.BASE_URL + "/me", {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des informations de l'utilisateur:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des informations de l'utilisateur (status code:" + response.status + ")"
            );
        }

        const body = await response.json();

        let loggedUser: User = {
            id: body.id,
            name: body.display_name,
            email: body.email,
            country: body.country,
            followers: body.followers.total,
            spotifyPlan: body.product,
            pictureURL: new URL(body.images[0].url),
            userURL: new URL(body.external_urls.spotify),

            topArtists: [],
            topTracks: [],
            topGenres: [],
        };

        let topItems = await this.getLoggedUserTopsItems();

        loggedUser.topTracks = topItems.topTracks;
        loggedUser.topArtists = topItems.topArtists;
        
        this.loggedUser = loggedUser;
        this.getLoggedUserTopsItems();

    }

    private async getLoggedUserTopsItems(): Promise<{ topArtists: Artist[]; topTracks: Track[] }> {
        let response: Response;

        try {
            response = await fetch(process.env.BASE_URL + "/me/top/artists?limit=29", {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des informations de l'utilisateur:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des informations de l'utilisateur (status code:" + response.status + ")"
            );
        }

        let body = await response.json();

        let topArtists: Artist[] = body.items.map(mapToArtist);

        try {
            response = await fetch(process.env.BASE_URL + "/me/top/tracks", {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des informations de l'utilisateur:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des informations de l'utilisateur (status code:" + response.status + ")"
            );
        }

        body = await response.json();

        let topTracks: Track[] = body.items.map(mapToTrack);

        return { topArtists, topTracks };
    }

    public async getAlbumInfos(albumId: string): Promise<Album> {
        let response: Response;

        try {
            response = await fetch(process.env.BASE_URL + "/albums/" + albumId, {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des informations de l'album:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des informations de l'album (status code:" + response.status + ")"
            );
        }

        let body = await response.json();

        return {
            id: body.id,
            name: body.name,
            releaseDatePrecision: body.release_date_precision,
            releaseDate: new Date(body.release_date),
            totalTracks: body.total_tracks,
            albumType: body.album_type,
            pictureURL: new URL(body.images[0].url),
            albumURL: new URL(body.external_urls.spotify),
            copyright: body.label,
            label: body.label,
            genres: body.genres,
            artists: [...body.artists],
            tracks: [...body.tracks],
        };
    }

    public async getArtistInfos(artistId: string): Promise<Artist> {
        let response: Response;

        try {
            response = await fetch(process.env.BASE_URL + "/artists/" + artistId, {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des informations de l'artiste:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des informations de l'artiste (status code:" + response.status + ")"
            );
        }

        let body = await response.json();

        return {
            id: body.id,
            name: body.name,
            popularity: body.popularity,
            genres: body.genres,
            followers: body.followers.total,
            artistURL: new URL(body.external_urls.spotify),
            pictureURL: new URL(body.images[0].url),
        };
    }

    public async getTrackInfos(trackId: string): Promise<Track> {
        let response: Response;

        try {
            response = await fetch(process.env.BASE_URL + "/tracks/" + trackId, {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des informations du morceau:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des informations du morceau (status code:" + response.status + ")"
            );
        }

        let body = await response.json();

        return {
            id: body.id,
            name: body.name,
            duration: body.duration_ms,
            popularity: body.popularity,
            explicit: body.explicit,
            trackNumber: body.track_number,
            album: body.album,
            artists: body.artists,
            imageURL: new URL(body.album.images[0].url),
            trackURL: new URL(body.external_urls.spotify),
            previewURL: new URL(body.preview_url),
        };
    }

    public async getArtistTopTracks(artistId: string): Promise<Track[]> {
        let response: Response;

        try {
            response = await fetch(process.env.BASE_URL + "/artists/" + artistId + "/top-tracks?market=FR", {
                headers: this.headers,
            });
        } catch (error) {
            throw new Error("Erreur lors de la récupération des top morceaux de l'artiste:\n" + error);
        }

        if (!response.ok) {
            throw new Error(
                "Erreur lors de la récupération des top morceaux de l'artiste (status code:" + response.status + ")"
            );
        }

        let body = await response.json();

        return body.tracks.map(mapToTrack);
    }
}
