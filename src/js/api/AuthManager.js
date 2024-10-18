import getPkce from 'oauth-pkce';

export default class AuthManager {
    constructor() {
        this.expiresAt = 0;
        this.accessToken = null;
        this.refreshToken = null;
        this.codeVerifier = null;
        this.codeChallenge = null;

        this.client_id = "7e9935a5e5d84840b8b26ee8fb9678be";
        this.redirect_uri = "http://localhost:3000/#callback";
        this.scopes = "user-top-read";
        this.authUrl = new URL("https://accounts.spotify.com/authorize");
        this.refreshTokenUrl = new URL('https://accounts.spotify.com/api/token');

    }


    async authenticate() {
        console.log('Authenticating...');

        //getPkce(43, (error, { verifier, challenge }));

        const generateRandomString = (length) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }

        const codeVerifier = generateRandomString(64);

        const sha256 = async (plain) => {
            const encoder = new TextEncoder()
            const data = encoder.encode(plain)
            return window.crypto.subtle.digest('SHA-256', data)
        }

        const base64encode = (input) => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        }
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed)

        this.codeVerifier = codeVerifier;
        this.codeChallenge = codeChallenge;

        console.log('Code verifier 1 : ', this.codeVerifier);
        console.log('Code challenge 1 : ', this.codeChallenge);



        const params = {
            response_type: 'code',
            client_id: this.client_id,
            redirect_uri: this.redirect_uri,
            code_challenge_method: 'S256',
            code_challenge: this.codeChallenge,
            scope: this.scopes,
        };

        localStorage.setItem('codeVerifier', this.codeVerifier);
        localStorage.setItem('codeChallenge', this.codeChallenge);

        this.authUrl.search = new URLSearchParams(params);
        window.location.href = this.authUrl;

    }

    async refreshTokens() {
        console.log('Refreshing token...');
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

        console.log('Payload : ', payload)

        const body = await fetch(this.refreshTokenUrl, payload);
        const response = await body.json();

        console.log('New tokens : ', response);

        this.accessToken = response.access_token;
        this.refreshToken = response.refresh_token;
        this.expiresAt = Date.now() + response.expires_in * 1000;
    }

    isExpired() {
        return Date.now() >= this.expiresAt;
    }

    isAuthentified() {
        if (this.accessToken && !this.isExpired()) {
            return true;
        }
    }

    getAccessToken() {
        if (this.isExpired()) {
            this.refreshTokens();
        } else if (!this.accessToken) {
            this.accessToken = localStorage.getItem('access_token');
        } 
        return this.accessToken;
    }

    storeAccessToken() {
        localStorage.setItem('access_token', this.accessToken);
    }

    storeRefreshToken() {
        localStorage.setItem('refresh_token', this.refreshToken);
    }
}