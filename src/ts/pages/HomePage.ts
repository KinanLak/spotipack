import AuthManager from "../api/AuthManager";
import Page from "./Page";
import Button from "../components/Button";
import "../../css/global.scss";

export default class HomePage extends Page {
    private connectToSpotify: Button;

    constructor(authManager: AuthManager) {
        super(authManager);

        this.connectToSpotify = new Button("login-button", "Se connecter à Spotify", ["button", "login-button"], () => {
            this.handleSpotifyAuth();
        });
    }

    public async render() {
        super.render();
        this.container.appendChild(this.connectToSpotify);
    }

    private handleSpotifyAuth() {
        if (!this.authManager.isAuthentified()) {
            this.authManager.authenticate();
        }
    }
}
