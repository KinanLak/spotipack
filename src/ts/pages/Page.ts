import AuthManager from "../api/AuthManager";
import Button from "../components/Button";

import "../../css/topbar.scss";
import spotifyIcon from "../../images/spotify-icon.png";
import Spotify from "../api/Spotify";

export default class Page {
    protected authManager: AuthManager;
    protected spotify: Spotify;
    public container: HTMLElement;

    private topBar!: HTMLDivElement;

    constructor(authManager: AuthManager, spotify: Spotify) {
        this.authManager = authManager;
        this.spotify = spotify;

        this.topBar = document.getElementById("top-bar") as HTMLDivElement;
        this.setupTopBar();

        this.container = document.getElementById("app-container")!;
        if (!this.container) {
            throw new Error("L'élément app-container est introuvable dans le DOM");
        }
    }

    private async setupTopBar() {
        // Check if topBar is already created
        if (this.topBar.children.length == 0) {
            this.createTopbar();
        }
    }

    public async render() {
        //s'il y a un paramètre error
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.has("error") && this.showErrorMessage(urlParams.get("error")!);

        if (this.authManager.isAuthentified() && window.location.hash != "#home" && window.location.hash != "#callback") {
            let rightContainer = this.topBar.children[1] as HTMLElement;
            rightContainer.style.display = "flex";

            this.spotify.getLoggedUserInfos().then(() => {
                console.log("loggedUser", this.spotify.loggedUser);
                rightContainer.children[0].setAttribute(
                    "src",
                    this.spotify.loggedUser ? this.spotify.loggedUser.pictureURL.toString() : ""
                );
                rightContainer.children[1].textContent = this.spotify.loggedUser
                    ? this.spotify.loggedUser.name
                    : "Unknown";
            });
        }
    }

    private showErrorMessage(error: string) {
        console.error("error", error);

        const errorMessage = document.createElement("p");
        errorMessage.classList.add("error-message");
        errorMessage.textContent = "Nous avons rencontré un problème : " + error;
        errorMessage.style.display = "block";
        this.container.appendChild(errorMessage);
    }

    private createTopbar() {
        // Création de la barre de navigation
        this.topBar.classList.add("top-bar");

        // Création de l'icône Spotify
        const spotifyIconElement = document.createElement("img");
        spotifyIconElement.src = spotifyIcon; // lien vers l'icône de Spotify
        spotifyIconElement.alt = "Spotify Icon";
        spotifyIconElement.classList.add("spotify-icon");

        // Nom de l'application à côté de l'icône
        const appName = document.createElement("span");
        appName.textContent = "Spotipack";
        appName.classList.add("app-name");

        // Conteneur gauche pour l'icône et le nom
        const leftContainer = document.createElement("div");
        leftContainer.classList.add("left-container");
        leftContainer.appendChild(spotifyIconElement);
        leftContainer.appendChild(appName);

        // Icône utilisateur
        const userIcon = document.createElement("img");
        userIcon.src = "https://placekitten.com/200/200";
        userIcon.alt = "User Icon";
        userIcon.classList.add("user-icon");

        // Nom de l'utilisateur
        const userName = document.createElement("span");
        userName.textContent = this.spotify.loggedUser ? this.spotify.loggedUser.name : "Unknown";
        userName.classList.add("user-name");

        const rightContainer = document.createElement("div");
        rightContainer.classList.add("right-container");

        // Bouton de déconnexion
        const logoutButton = new Button("logout-button", "Déconnecter", ["logout-button"], () => {
            this.authManager.logout();
        });

        rightContainer.appendChild(userIcon);
        rightContainer.appendChild(userName);
        rightContainer.appendChild(logoutButton);

        // Si l'utilisateur n'est pas connecté, on cache le conteneur de droite
        rightContainer.style.display = "none";

        // Ajout des deux conteneurs dans la barre de navigation
        this.topBar.appendChild(leftContainer);
        this.topBar.appendChild(rightContainer);
    }
}
