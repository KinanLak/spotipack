import AuthManager from "../api/AuthManager";
import Spotify from "../api/Spotify";
import Page from "./Page";
import { ArtistPill, TrackPill } from "../components";
import { Artist, Track } from "../models";

import "../../css/pages/artist.scss";
import spotifyLogo from "../../images/spotify-icon.png";

export default class ArtistPage extends Page {
    private artist?: Artist;
    private topTracks: Track[] = [];

    constructor(authManager: AuthManager, spotify: Spotify, artistID?: string) {
        super(authManager, spotify);
        if (artistID) {
            this.spotify.getArtistInfos(artistID).then((artist) => {
                this.artist = artist;
            });
        } else {
            console.error("No artist ID provided");
            this.artist = undefined;
        }
    }

    public async render() {
        await super.render();
        console.log("Rendering artist page");
        if (!this.artist) {
            window.router.navigateTo("me");
            return;
        }
        this.topTracks = await this.spotify.getArtistTopTracks(this.artist!.id);
        this.renderContent();
    }

    private async renderContent() {
        if (!this.artist) {
            return;
        }
        document.title = this.artist.name + " - Spotipack";
        let artistContainer = document.createElement("div");
        artistContainer.id = "artist-page";
        artistContainer.classList.add("artist-page");

        let artistInfos = document.createElement("div");
        artistInfos.id = "artist-infos";
        artistInfos.classList.add("page-artist-infos");

        let artistTitleDiv = document.createElement("div");
        artistTitleDiv.id = "artist-title-div";
        artistTitleDiv.classList.add("page-artist-title-div");

        artistTitleDiv.addEventListener("click", () => {
            window.open(this.artist!.artistURL.toString(), "_blank");
        });

        let artistTitle = document.createElement("span");
        artistTitle.classList.add("page-artist-title");
        artistTitle.textContent = this.artist.name;

        let spotifyIcon = document.createElement("img");
        spotifyIcon.src = spotifyLogo;
        spotifyIcon.alt = "Spotify";
        spotifyIcon.classList.add("page-artist-spotify-icon");

        artistTitleDiv.appendChild(spotifyIcon);
        artistTitleDiv.appendChild(artistTitle);

        let artistPicture = document.createElement("img");
        artistPicture.src = this.artist.pictureURL!.toString();
        artistPicture.alt = this.artist.name;
        artistInfos.appendChild(artistPicture);
        artistInfos.appendChild(artistTitleDiv);

        let artistStats = document.createElement("div");
        artistStats.id = "artist-stats";
        artistStats.classList.add("page-artist-stats");

        let artistGenres = document.createElement("span");
        artistGenres.classList.add("page-artist-genres");
        artistGenres.textContent = this.artist.genres!.join("  -  ");

        let artistFollowers = document.createElement("span");
        artistFollowers.classList.add("page-artist-followers");
        artistFollowers.textContent = this.artist.followers + " followers";
        artistStats.appendChild(artistFollowers);

        let artistPopularity = document.createElement("span");
        artistPopularity.classList.add("page-artist-popularity");
        artistPopularity.textContent = "Popularité: " + this.artist.popularity;

        artistContainer.appendChild(artistInfos);

        artistStats.appendChild(artistPopularity);
        artistContainer.appendChild(artistStats);
        artistContainer.appendChild(artistGenres);

        let artistTitleTopTracks = document.createElement("span");
        artistTitleTopTracks.classList.add("page-artist-title-top-tracks");
        artistTitleTopTracks.textContent = "Musiques les plus écoutés";
        artistContainer.appendChild(artistTitleTopTracks);

        let artistTopTracks = document.createElement("div");
        artistTopTracks.id = "page-artist-top-tracks";
        artistTopTracks.classList.add("page-artist-top-tracks");

        this.topTracks.forEach((track) => {
            if (artistTopTracks) {
                const trackPill = new TrackPill(track);
                artistTopTracks.appendChild(trackPill);
            }
        });

        this.container.appendChild(artistContainer);
        artistContainer.appendChild(artistTopTracks);
    }
}
