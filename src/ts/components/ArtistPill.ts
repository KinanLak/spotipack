import { Artist } from "../models";

export class ArtistPill extends HTMLDivElement {
    private artist: Artist;

    constructor(artist: Artist) {
        super();
        this.artist = artist;
        this.classList.add("artist-pill");

        const img = document.createElement("img");
        img.src = artist.pictureURL ? artist.pictureURL.toString() : "https://placecats.com/300/300";
        img.alt = "Artist Image";
        img.classList.add("artist-image");

        const div = document.createElement("div");
        div.id = `artist-${artist.id}`;
        div.classList.add("artist-name");
        div.textContent = artist.name;

        this.appendChild(img);
        this.appendChild(div);

        this.addEventListener("click", () => {
            console.error("Navigating to artist", artist.id);
            window.router.navigateTo("artist", { id: artist.id });
        });
    }
}

customElements.define("artist-pill", ArtistPill, { extends: "div" });

export default ArtistPill;
