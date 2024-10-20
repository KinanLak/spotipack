import AuthManager from '../api/AuthManager';
import Page from './Page';
import Spotify from '../api/Spotify';

export default class CallbackPage extends Page {

    spotify: Spotify;

    constructor(authManager: AuthManager, spotify: Spotify) {
        super(authManager);
        this.spotify = spotify;
    }

    async render() {

        super.render();

        let callbackDiv: HTMLElement = document.createElement('h1');
        callbackDiv.classList.add('callback-page');
        callbackDiv.textContent = 'Redirection...';

        this.container.appendChild(callbackDiv);

        await this.authManager.handleSpotifyCallback();
        await this.spotify.getLoggedUserInfos();

    }
}