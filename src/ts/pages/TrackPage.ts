import AuthManager from "../api/AuthManager";
import Spotify from "../api/Spotify";
import Page from "./Page";
import { TrackPill, ArtistPill } from "../components";
import { Track } from "../models";

import "../../css/pages/track.scss";
import spotifyLogo from "../../images/spotify-icon.png";

export default class TrackPage extends Page {
    private track?: Track;

    constructor(authManager: AuthManager, spotify: Spotify, trackID?: string) {
        super(authManager, spotify);
        if (trackID) {
            this.spotify.getTrackInfos(trackID).then((track) => {
                this.track = track;
            });
        } else {
            console.error("No track ID provided");
            this.track = undefined;
        }
    }

    public async render() {
        await super.render();
        console.log("Rendering track page");
        if (!this.track) {
            window.router.navigateTo("me");
            return;
        }
        this.renderContent();
    }

    private renderContent() {
        if (!this.track) {
            return;
        }
        document.title = this.track.name + " - Spotipack";
        let trackContainer = document.createElement("div");
        trackContainer.id = "track-page";
        trackContainer.classList.add("track-page");

        let trackInfos = document.createElement("div");
        trackInfos.id = "track-infos";
        trackInfos.classList.add("page-track-infos");

        let trackTitleDiv = document.createElement("div");
        trackTitleDiv.id = "track-title-div";
        trackTitleDiv.classList.add("page-track-title-div");

        trackTitleDiv.addEventListener("click", () => {
            window.open(this.track!.trackURL.toString(), "_blank");
        });

        let trackTitle = document.createElement("span");
        trackTitle.classList.add("page-track-title");
        trackTitle.textContent = this.track.name;

        let spotifyIcon = document.createElement("img");
        spotifyIcon.src = spotifyLogo;
        spotifyIcon.alt = "Spotify";
        spotifyIcon.classList.add("page-track-spotify-icon");

        trackTitleDiv.appendChild(spotifyIcon);
        trackTitleDiv.appendChild(trackTitle);

        let trackPicture = document.createElement("img");
        trackPicture.src = this.track.imageURL!.toString();
        trackPicture.alt = this.track.name;
        trackInfos.appendChild(trackPicture);
        trackInfos.appendChild(trackTitleDiv);

        let trackStats = document.createElement("div");
        trackStats.id = "track-stats";
        trackStats.classList.add("page-track-stats");

        let trackArtists = document.createElement("div");
        trackArtists.classList.add("page-track-artists");
        //trackArtists.textContent = this.track.artists.map(artist => artist.name).join(", ");
        this.track.artists.forEach((artist) => {
            this.spotify.getArtistInfos(artist.id).then((artist) => {
                let artistPill = new ArtistPill(artist);
                trackArtists.appendChild(artistPill);
            });
        });

        let trackDuration = document.createElement("span");
        trackDuration.classList.add("page-track-duration");
        trackDuration.textContent =
            "Durée: " +
            Math.floor(this.track.duration / 1000 / 60) +
            "min" +
            (Math.floor(this.track.duration / 1000) % 60);

        let trackPopularity = document.createElement("span");
        trackPopularity.classList.add("page-track-popularity");
        trackPopularity.textContent = "Popularité: " + this.track.popularity;

        trackContainer.appendChild(trackInfos);

        trackStats.appendChild(trackDuration);
        trackStats.appendChild(trackPopularity);
        trackContainer.appendChild(trackStats);

        this.container.appendChild(trackContainer);
        this.container.appendChild(trackArtists);
    }
}
