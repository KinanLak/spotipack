import AuthManager from "./api/AuthManager";
import Page from "./pages/Page";
import Spotify from "./api/Spotify";

type PageLoader = (params?: any) => Promise<Page>;

export default class Router {
    private pages: { [key: string]: PageLoader };
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
            artist: (params?: any) =>
                import("./pages/ArtistPage").then((m) => new m.default(this.authManager, this.spotify, params?.id)),
            track: (params?: any) =>
                import("./pages/TrackPage").then((m) => new m.default(this.authManager, this.spotify, params?.id)),
        };
    }

    public init() {
        window.addEventListener("popstate", this.handlePopState.bind(this));
        this.navigateTo(this.getCurrentPage());
    }

    public getCurrentPage() {
        const hash = window.location.hash.slice(1);
        const [pageName] = hash.split("?");
        return pageName || "home";
    }

    private getParams(hash: string): { [key: string]: string } {
        const params: { [key: string]: string } = {};
        const [, queryString] = hash.split("?");

        if (queryString) {
            const pairs = queryString.split("&");
            pairs.forEach((pair) => {
                const [key, value] = pair.split("=");
                console.log(`Key: ${key}, Value: ${value}`);
                params[key] = decodeURIComponent(value);
            });
        }
        return params;
    }

    public async navigateTo(pageName: string, params?: any) {
        console.info(`Navigating to ${pageName}`);

        if (!["home", "callback"].includes(pageName) && !this.authManager.isAuthentified()) {
            console.error("Authentification requise pour accéder à la page", pageName);
            this.navigateTo("home", { error: "Authentification requise pour accéder à la page" });
            return;
        }

        if (pageName === "callback") {
            if (!window.location.search.includes("code")) {
                console.error("La page 'callback' ne peut pas être atteinte directement");
                this.navigateTo("home", { error: "La page 'callback' ne peut pas être atteinte directement" });
                return;
            }
        } else {

            if (!this.pages[pageName]) {
                console.error(`Page "${pageName}" not found`);
                return;
            }
        }

        let url = `#${pageName}`;
        if (params) {
            const queryParams = new URLSearchParams(params).toString();
            url += `?${queryParams}`;
        }

        history.pushState(null, "", url);

        await this.renderPage(pageName, params);
    }

    private handlePopState() {
        const pageName = this.getCurrentPage();
        const params = this.getParams(window.location.hash.slice(1));
        this.renderPage(pageName, params);
    }

    private async renderPage(pageName: string, params?: any) {
        const pageLoader = this.pages[pageName];

        if (pageLoader) {
            if (this.currentPage) {
                this.currentPage.container.innerHTML = ""
            }

            this.currentPage = await pageLoader(params);
            this.currentPage.render();
        } else {
            console.error(`Page "${pageName}" not found`);
        }
    }
}
