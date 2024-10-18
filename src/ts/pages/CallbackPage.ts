import { assert } from 'console';
import AuthManager from '../api/AuthManager';
import Page from './Page';

export default class CallbackPage extends Page {

    constructor(authManager: AuthManager,) {
        super(authManager);
    }

    render() {

        super.render();

        let callbackDiv: HTMLElement = document.createElement('h1');
        callbackDiv.classList.add('callback-page');
        callbackDiv.textContent = 'Redirection...';

        this.container.appendChild(callbackDiv);

        this.authManager.handleSpotifyCallback();

    }
}