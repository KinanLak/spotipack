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
    private router: Router;

    constructor() {
        this.authManager = new AuthManager();
        this.spotify = new Spotify(this.authManager);
        this.router = new Router(this.authManager, this.spotify);
    }

    init() {
        window.router = this.router;
        this.router.init();
    }
}