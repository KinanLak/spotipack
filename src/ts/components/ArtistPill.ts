import { Artist } from "../models";

import '../styles/ArtistPill.css';

class AritstPill extends HTMLDivElement {
    
    private artist: Artist;

    constructor(artist: Artist) {
        super();
        this.artist = artist;
        this.classList.add('artist-pill');
        this.innerHTML = `
        <img src="${artist.pictureURL}" alt="Artist Image" class="artist-image">
        <a href="${artist.artistURL}" class="artist-name">${artist.name}</a>
        `;
    }
}
