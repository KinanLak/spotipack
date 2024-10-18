import { assert } from 'console';
import AuthManager from '../api/AuthManager';
import Page from './Page';

export default class CallbackPage extends Page {

    constructor(authManager: AuthManager, ) {
        super(authManager);
    }

    render() {

        super.render();

        let callbackDiv: HTMLElement = document.createElement('h1');
        callbackDiv.classList.add('callback-page');
        callbackDiv.textContent = 'Redirection...';

        this.container.appendChild(callbackDiv);

        this.handleSpotifyCallback();

    }

    async handleSpotifyCallback() {
        this.authManager.restoreTokens();


        const urlParams = new URLSearchParams(window.location.search);

        if (!urlParams.has('code')) {
            console.error('No code in URL');
            window.router.navigateTo('home?error=no_code');
            return;
        }

        let codeCallback = urlParams.get('code');

        if (codeCallback) {
            this.authManager.codeCallback = codeCallback;
        }

        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: process.env.CLIENT_ID!,
                grant_type: 'authorization_code',
                code: this.authManager.codeCallback,
                redirect_uri: process.env.REDIRECT_URI!,
                code_verifier: this.authManager.codeVerifier,
            }),
        }

        const body = await fetch(new URL(process.env.REFRESH_TOKEN_URL!), payload);
        const response = await body.json();

        this.authManager.accessToken = response.access_token;
        this.authManager.refreshToken = response.refresh_token;
        this.authManager.expiresAt = Date.now() + response.expires_in * 1000;

        try {
            assert(this.authManager.accessToken);
            assert(this.authManager.refreshToken);
            assert(this.authManager.expiresAt);
        } catch (error) {
            console.error('Error while getting tokens');
            window.router.navigateTo('home?error=token_error');
            return;
        } finally {
            localStorage.setItem('access_token', this.authManager.accessToken);
            localStorage.setItem('refresh_token', this.authManager.refreshToken);
            localStorage.setItem('expires_at', this.authManager.expiresAt.toString());
        }
        
        if (this.authManager.isAuthentified()) {
            console.info('Authenticated!');
            this.cleanUrl();
            window.router.navigateTo('me');

        } else {
            console.error("Authentication failed");
            window.router.navigateTo('home?error=auth_failed');
        }
    }

    cleanUrl() {
        const url = new URL(window.location.href);
        url.search = ''; 
        window.history.replaceState({}, document.title, url.toString());
    }
}