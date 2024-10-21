import { Track } from "../models";

export class TrackPill extends HTMLDivElement {
    private track: Track;

    constructor(track: Track) {
        super();
        this.track = track;
        this.classList.add("track-pill");
        this.innerHTML = `
        <img src="${track.imageURL}" alt="Track Image" class="track-image">
        <div id="track-${track.id}" class="track-name">${track.name}</div>
        `;

        this.addEventListener("click", () => {
            console.error("Navigating to track", track.id);
            window.router.navigateTo("track", { id: track.id });
        });
    }
}

customElements.define("track-pill", TrackPill, { extends: "div" });

export default TrackPill;
