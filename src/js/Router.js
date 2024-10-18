export default class Router {
    constructor(pages, authManager) {
        this.pages = pages;
        this.authManager = authManager;
    }

    init() {
        window.addEventListener('popstate', this.handlePopState.bind(this));
        this.navigateTo(this.getCurrentPage());
    }

    getCurrentPage() {
        return window.location.hash.slice(1) || 'home';
    }

    async navigateTo(pageName) {
        console.log(`Navigating to ${pageName}`);
        if (pageName === 'me' && !this.authManager.isAuthentified()) {
            console.log("Authentification requise pour accéder à la page 'me'");
            // Rediriger vers la page d'accueil ou afficher un message d'erreur
            pageName = 'home';
        }
        history.pushState(null, null, `#${pageName}`);
        
        this.renderPage(pageName);
    }

    handlePopState() {
        this.renderPage(this.getCurrentPage());
    }

    renderPage(pageName) {
        const page = this.pages[pageName];
        if (page) {
            page.render();
        } else {
            console.error(`Page "${pageName}" not found`);
            // Optionally, redirect to a 404 page or home
        }
    }
}