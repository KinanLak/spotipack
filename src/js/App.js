import AuthManager from './api/AuthManager';
import UserTopArtistsManager from './api/UserTopArtistsManager';
import HomePage from './pages/HomePage';
import MePage from './pages/MePage';
import Router from './Router';

export default class App {
    constructor() {
        this.authManager = new AuthManager();
        this.userTopArtistsManager = new UserTopArtistsManager();

        this.pages = {
            home: new HomePage(this.authManager),
            me: new MePage(this.userTopArtistsManager)
        };
        
        this.router = new Router(this.pages);
    }

    init() {
        // Make the router globally accessible
        window.router = this.router;

        // Initialize the router
        this.router.init();
    }
}