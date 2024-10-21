import { Artist } from "../models";

export class ArtistPill extends HTMLDivElement {
    private artist: Artist;

    constructor(artist: Artist) {
        super();
        this.artist = artist;
        this.classList.add("artist-pill");

        this.innerHTML = `
        <img src="${artist.pictureURL}" alt="Artist Image" class="artist-image">
        <div id="artist-${artist.id}" class="artist-name">${artist.name}</div>
        `;

        this.addEventListener("click", () => {
            console.error("Navigating to artist", artist.id);
            window.router.navigateTo("artist", { id: artist.id });
        });
    }
}

customElements.define("artist-pill", ArtistPill, { extends: "div" });

export default ArtistPill;
