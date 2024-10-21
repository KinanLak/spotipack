import AuthManager from "../api/AuthManager";
import Button from "../components/Button";

import "../../css/components/topbar.scss";
import "../../css/components/footer.scss";

import spotifyIcon from "../../images/spotify-icon.png";
import Spotify from "../api/Spotify";

export default class Page {
    protected authManager: AuthManager;
    protected spotify: Spotify;
    public container: HTMLElement;

    private topBar!: HTMLDivElement;
    private footer!: HTMLDivElement;

    constructor(authManager: AuthManager, spotify: Spotify) {
        this.authManager = authManager;
        this.spotify = spotify;

        this.topBar = document.getElementById("top-bar") as HTMLDivElement;
        this.setupTopBar();

        this.container = document.getElementById("app-container")!;
        if (!this.container) {
            throw new Error("L'élément app-container est introuvable dans le DOM");
        }

        this.footer = document.getElementById("footer") as HTMLDivElement;
        this.setupFooter();
    }

    public async render() {
        //s'il y a un paramètre error
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.has("error") && this.showErrorMessage(urlParams.get("error")!);

        if (
            this.authManager.isAuthentified() &&
            window.location.hash != "#home" &&
            window.location.hash != "#callback"
        ) {
            await this.spotify.getLoggedUserInfos().then(() => {
                let rightContainer = this.topBar.children[1] as HTMLElement;
                rightContainer.style.display = "flex";
                rightContainer.children[0].children[0].setAttribute(
                    "src",
                    this.spotify.loggedUser ? this.spotify.loggedUser.pictureURL.toString() : ""
                );
                rightContainer.children[0].children[1].textContent = this.spotify.loggedUser
                    ? this.spotify.loggedUser.name
                    : "Unknown";
            });
        }
    }

    public showErrorMessage(error: string) {
        console.error("error", error);

        const errorPopup = document.createElement("div");
        errorPopup.classList.add("error-popup");

        const errorMessage = document.createElement("span");

        errorMessage.textContent = "Nous avons rencontré un problème : " + error;
        errorPopup.style.display = "flex";

        errorPopup.appendChild(errorMessage);

        const errorCloseButton = new Button("error-close-button", "Fermer", ["error-close-button"], () => {
            errorPopup.style.display = "none";
        });

        errorCloseButton.classList.add("error-close-button");

        errorPopup.appendChild(errorCloseButton);

        this.container.appendChild(errorPopup);
    }

    private async setupTopBar() {
        if (this.topBar.children.length == 0) {
            this.createTopbar();
        } else if (!this.authManager.isAuthentified()) {
            let rightContainer = this.topBar.children[1] as HTMLElement;
            rightContainer.style.display = "none";
        }
        if (this.authManager.isAuthentified()) {
            let rightContainer = this.topBar.children[1] as HTMLElement;
            rightContainer.style.display = "flex";
        }
    }

    private createTopbar() {
        this.topBar.classList.add("top-bar");

        const spotifyIconElement = document.createElement("img");
        spotifyIconElement.src = spotifyIcon;
        spotifyIconElement.alt = "Spotify Icon";
        spotifyIconElement.classList.add("spotify-icon");

        const appName = document.createElement("span");
        appName.textContent = "Spotipack";
        appName.classList.add("app-name");

        const leftContainer = document.createElement("div");
        leftContainer.classList.add("left-container");
        leftContainer.appendChild(spotifyIconElement);
        leftContainer.appendChild(appName);

        const userIcon = document.createElement("img");
        userIcon.src = this.spotify.loggedUser
            ? this.spotify.loggedUser.pictureURL.toString()
            : "https://placekitten.com/200/200";
        userIcon.alt = "User Icon";
        userIcon.classList.add("user-icon");

        const userName = document.createElement("span");
        userName.textContent = this.spotify.loggedUser ? this.spotify.loggedUser.name : "Unknown";
        userName.classList.add("user-name");

        const rightContainer = document.createElement("div");
        rightContainer.classList.add("right-container");

        const userProfile = document.createElement("div");
        userProfile.classList.add("user-profile");

        const logoutButton = new Button("logout-button", "Déconnecter", ["logout-button"], () => {
            this.authManager.logout();
            this.setupTopBar();
        });

        userProfile.appendChild(userIcon);
        userProfile.appendChild(userName);
        userProfile.onclick = () => {
            window.router.navigateTo("me");
        };
        userProfile.classList.add("flex-center", "user-profile");

        rightContainer.appendChild(userProfile);
        rightContainer.appendChild(logoutButton);

        rightContainer.style.display = "none";

        this.topBar.appendChild(leftContainer);
        this.topBar.appendChild(rightContainer);
    }

    private setupFooter() {
        if (this.footer.children.length > 0) {
            return;
        }

        this.footer.classList.add("footer", "flex-center");
        const footerText1 = document.createElement("span");
        footerText1.textContent = "© 2024 Spotipack";

        const footerText2Div = document.createElement("div");
        footerText2Div.classList.add("flex-center", "footer-text2", "link-flash");

        const footerText2 = document.createElement("span");
        footerText2.textContent = "Made with   ❤️   by";
        const footerLink = document.createElement("a");
        footerLink.textContent = "Kinan";
        footerLink.href = "https://github.com/KinanLak/";
        footerLink.target = "_blank";
        this.footer.appendChild(footerText1);
        footerText2Div.appendChild(footerText2);
        footerText2Div.appendChild(footerLink);
        this.footer.appendChild(footerText2Div);
    }
}
