import {Artist, Track, Genre} from "../models";

export interface User {
    id: string;
    name: string;
    email: string;
    country: string;
    followers: number;
    spotifyPlan: string;
    pictureURL: URL;
    userURL: URL;

    topArtists: Artist[];
    topTracks: Track[];
    topGenres: Genre[];
}
