import AuthManager from './api/AuthManager';
import Page from './pages/Page';

export default class Router {

    private pages: { [key: string]: Page };
    private authManager: AuthManager;

    constructor(pages: { [key: string]: Page }, authManager: AuthManager) {
        this.pages = pages;
        this.authManager = authManager;
    }

    public init() {
        window.addEventListener('popstate', this.handlePopState.bind(this));
        this.navigateTo(this.getCurrentPage());
    }

    getCurrentPage() {
        return window.location.hash.slice(1) || 'home';
    }

    public async navigateTo(pageName: string) {
        console.log(`Navigating to ${pageName}`);
        if (pageName === 'me' && !this.authManager.isAuthentified()) {
            console.log("Authentification requise pour accéder à la page 'me'");
            // Rediriger vers la page d'accueil ou afficher un message d'erreur
            pageName = 'home';
        }
        history.pushState(null, '', `#${pageName}`);
        
        this.clearPage(pageName);
        this.renderPage(pageName);
    }

    private handlePopState() {
        this.renderPage(this.getCurrentPage());
    }

    private renderPage(pageName: string) {

        const page = this.pages[pageName];

        if (page) {
            page.render();
        } else {
            console.error(`Page "${pageName}" not found`);
            // 404 page
        }
    }

    private clearPage(pageName: string) {
        if (this.pages[pageName]) {
            this.pages[pageName].container.innerHTML = '';
        }
    }
}