import { getPkce } from 'oauth-pkce';

export default class AuthManager {
    constructor() {
        this.accessToken = null;
        this.refreshToken = null;
        this.expiresAt = 0;
        this.codeVerifier = null;
        this.codeChallenge = null;
        this.code = null;

        this.client_id = "7e9935a5e5d84840b8b26ee8fb9678be";
        this.redirect_uri = "http://localhost:3000/#me";
        this.scopes = "user-top-read";
        this.authUrl = new URL("https://accounts.spotify.com/authorize");
        this.refreshTokenUrl = new URL('https://accounts.spotify.com/api/token');

    }

    authenticate() {
        getPkce(43, (error, { verifier, challenge }) => {
            if (!error) {
                console.log({ verifier, challenge });
                this.codeVerifier = verifier;
                this.codeChallenge = challenge;
            }
        });



        const params = {
            response_type: 'code',
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            code_challenge_method: 'S256',
            code_challenge: this.codeChallenge,
            scope: this.scopes,
        };

        this.authUrl.search = new URLSearchParams(params);
        window.location.href = this.authUrl;

        const urlParams = new URLSearchParams(window.location.search);
        this.code = urlParams.get('code');
    }

    async requestAccessToken() {
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.client_id,
                grant_type: 'authorization_code',
                code: this.code,
                redirect_uri: this.redirect_uri,
                code_verifier: this.codeVerifier,
            }),
        }

        const body = await fetch(this.refreshTokenUrl, payload);
        const response = await body.json();

        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresAt = Date.now() + response.expires_in * 1000;
    }

    async refreshToken() {
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.client_id,
                grant_type: 'refresh_token',
                refresh_token: this.refreshToken,
            }),
        }

        const body = await fetch(this.refreshTokenUrl, payload);
        const response = await body.json();

        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresAt = Date.now() + response.expires_in * 1000;
    }

    isExpired() {
        return Date.now() >= this.expiresAt;
    }

    isAuthenticated() {
        return !!this.token;
    }

    getAccessToken() {
        if (this.isExpired()) {
            this.refreshToken();
        } 
        return this.accessToken;
    }

    storeAccessToken() {
        localStorage.setItem('access_token', this.accessToken);
    }
}