import AuthManager from "../api/AuthManager";
import Page from "./Page";
import Spotify from "../api/Spotify";

import "../../css/components/spotifyButton.scss";
import "../../css/pages/home.scss";

export default class HomePage extends Page {
    private connectToSpotify: HTMLButtonElement;
    private particles: HTMLDivElement;

    constructor(authManager: AuthManager, spotify: Spotify) {
        super(authManager, spotify);

        let buttonString: string = this.authManager.isAuthentified()
            ? "Accéder à votre compte"
            : "Se connecter à Spotify";

        this.connectToSpotify = document.createElement("button");
        this.connectToSpotify.className = "spotify-btn";
        this.connectToSpotify.textContent = buttonString;
        this.connectToSpotify.addEventListener("click", () => this.handleButtonClick());

        this.particles = document.createElement("div");
        this.particles.className = "particles";

        this.createParticles(200);
    }

    public async render() {
        super.render();

        const homePage = document.createElement("div");
        homePage.className = "home-page";

        const content = document.createElement("div");
        content.className = "home-page-content";

        const title = document.createElement("h1");
        title.className = "home-page-title";
        title.textContent = "Découvrez  ce que vous écoutez réellement";

        content.appendChild(title);
        content.appendChild(this.connectToSpotify);

        homePage.appendChild(this.particles);
        homePage.appendChild(content);

        this.container.appendChild(homePage);
    }

    private handleButtonClick() {
        try {
            this.authManager.restoreTokens();
        } catch (error) {
            console.error(error);
        }

        if (this.authManager.isAuthentified()) {
            window.router.navigateTo("me");
        } else {
            this.handleSpotifyAuth();
        }
    }

    private handleSpotifyAuth() {
        if (!this.authManager.isAuthentified()) {
            this.authManager.authenticate();
        }
    }

    private createParticles(num: number) {
        for (let i = 0; i < num; i++) {
            const particle = document.createElement("div");
            particle.classList.add("particle");
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 4}s`;
            this.particles.appendChild(particle);
        }
    }
}
