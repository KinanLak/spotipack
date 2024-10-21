import { User, Track } from "../models";

export interface Playlist {
    id: string;
    name: string;
    description: string;
    totalTracks: number;
    collaborative: boolean;
    followers: number;
    owner: User;
    public: boolean;

    pictureURL: URL;
    playlistURL: URL;

    tracks: {
        addedAt: Date;
        addedBy: User;
        track: Track;
    }[];
}
