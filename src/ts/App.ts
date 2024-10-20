import AuthManager from './api/AuthManager';
import Spotify from './api/Spotify';
import Router from './Router';

import HomePage from './pages/HomePage';
import MePage from './pages/MePage';
import CallbackPage from './pages/CallbackPage';
import Page from './pages/Page'; 

export default class App {

    private authManager: AuthManager;
    private spotify: Spotify;
    private pages: { [key: string]: Page };
    private router: Router;


    constructor() {
        this.authManager = new AuthManager();
        this.spotify = new Spotify(this.authManager);

        this.pages = {
            home: new HomePage(this.authManager, this.spotify),
            me: new MePage(this.authManager, this.spotify),
            callback: new CallbackPage(this.authManager, this.spotify),
        };

        this.router = new Router(this.pages, this.authManager);
    }

    init() {
        // Make the router globally accessible
        window.router = this.router;

        // Initialize the router
        this.router.init();
    }
}