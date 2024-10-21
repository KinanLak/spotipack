import AuthManager from "../api/AuthManager";
import Spotify from "../api/Spotify";
import Page from "./Page";
import { ArtistPill, TrackPill } from "../components";

import "../../css/components/artistPill.scss";
import "../../css/components/trackPill.scss";
import "../../css/pages/me.scss";

export default class MePage extends Page {
    constructor(authManager: AuthManager, spotify: Spotify) {
        super(authManager, spotify);
    }

    public async render() {
        await super.render();
        this.renderContent();
    }

    private async renderContent() {
        document.title = "Me - Spotify Stats";

        let artistTitle = document.createElement("span");
        artistTitle.classList.add("artist-title");
        artistTitle.textContent = "Vos artistes préférés";
        this.container.appendChild(artistTitle);

        let userStats = document.createElement("div");
        userStats.id = "user-artists";
        userStats.classList.add("user-artists");
        this.spotify.loggedUser?.topArtists.forEach((artist) => {
            if (userStats) {
                const artistPill = new ArtistPill(artist);
                userStats.appendChild(artistPill);
            }
        });

        this.container.appendChild(userStats);

        let trackTitle = document.createElement("span");
        trackTitle.classList.add("track-title");
        trackTitle.textContent = "Vos titres préférés";
        this.container.appendChild(trackTitle);

        let userTracks = document.createElement("div");
        userTracks.id = "user-tracks";
        userTracks.classList.add("user-tracks");
        this.spotify.loggedUser?.topTracks.forEach((track) => {
            if (userTracks) {
                const trackPill = new TrackPill(track);
                userTracks.appendChild(trackPill);
            }
        });
        this.container.appendChild(userTracks);
    }
}
