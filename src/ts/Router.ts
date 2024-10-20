import AuthManager from './api/AuthManager';
import Page from './pages/Page';
import Spotify from './api/Spotify';

export default class Router {
    private pages: { [key: string]: () => Promise<Page> };
    private authManager: AuthManager;
    private spotify: Spotify;
    private currentPage: Page | null = null;

    constructor(authManager: AuthManager, spotify: Spotify) {
        this.authManager = authManager;
        this.spotify = spotify;
        this.pages = {
            home: () => import("./pages/HomePage").then((m) => new m.default(this.authManager, this.spotify)),
            me: () => import("./pages/MePage").then((m) => new m.default(this.authManager, this.spotify)),
            callback: () => import("./pages/CallbackPage").then((m) => new m.default(this.authManager, this.spotify)),
        };
    }

    public init() {
        window.addEventListener("popstate", this.handlePopState.bind(this));
        this.navigateTo(this.getCurrentPage());
    }

    getCurrentPage() {
        return window.location.hash.slice(1) || "home";
    }

    public async navigateTo(pageName: string) {
        console.log(`Navigating to ${pageName}`);
        if (pageName === "me" && !this.authManager.isAuthentified()) {
            console.log("Authentification requise pour accéder à la page 'me'");
            pageName = "home";
        }
        history.pushState(null, "", `#${pageName}`);

        await this.renderPage(pageName);
    }

    private handlePopState() {
        this.renderPage(this.getCurrentPage());
    }

    private async renderPage(pageName: string) {
        const pageLoader = this.pages[pageName];

        if (pageLoader) {
            if (this.currentPage) {
                this.currentPage.container.innerHTML = "";
            }

            this.currentPage = await pageLoader();
            this.currentPage.render();
        } else {
            console.error(`Page "${pageName}" not found`);
            // 404 page
        }
    }
}