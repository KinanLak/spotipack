export default class Router {
    constructor(pages) {
        this.pages = pages;
    }

    init() {
        window.addEventListener('popstate', this.handlePopState.bind(this));
        this.navigateTo(this.getCurrentPage());
    }

    getCurrentPage() {
        return window.location.hash.slice(1) || 'home';
    }

    navigateTo(pageName) {
        console.log(`Navigating to ${pageName}`);
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