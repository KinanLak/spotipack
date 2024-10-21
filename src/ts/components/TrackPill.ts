import { Track } from "../models";

export class TrackPill extends HTMLDivElement {
    private track: Track;

    constructor(track: Track) {
        super();
        this.track = track;
        this.classList.add("track-pill");
        const img = document.createElement("img");
        img.src = track.imageURL ? track.imageURL.toString() : "https://placecats.com/300/300";
        img.alt = "Track Image";
        img.classList.add("track-image");

        const div = document.createElement("div");
        div.id = `track-${track.id}`;
        div.classList.add("track-name");
        div.textContent = track.name;

        this.appendChild(img);
        this.appendChild(div);

        this.addEventListener("click", () => {
            console.error("Navigating to track", track.id);
            window.router.navigateTo("track", { id: track.id });
        });
    }
}

customElements.define("track-pill", TrackPill, { extends: "div" });

export default TrackPill;
