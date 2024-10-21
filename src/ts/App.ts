import AuthManager from "./api/AuthManager";
import Spotify from "./api/Spotify";
import Router from "./Router";

export default class App {
    private authManager: AuthManager;
    private spotify: Spotify;
    private router: Router;

    constructor() {
        this.authManager = new AuthManager();
        this.spotify = new Spotify(this.authManager);

        this.router = new Router(this.authManager, this.spotify);
    }

    async init() {
        if (this.authManager.restoreTokens()) {
            await this.spotify.getLoggedUserInfos();
        }

        window.router = this.router;
        this.router.init();
    }
}
