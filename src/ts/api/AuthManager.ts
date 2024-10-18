export default class AuthManager {

    private _expiresAt: number;
    private _accessToken: string | null
    private _refreshToken: string | null
    private _codeChallenge: string | null
    private _codeVerifier: string | null
    private _codeCallback: string | null

    constructor() {
        this._expiresAt = 0;
        this._accessToken = null;
        this._refreshToken = null;
        this._codeChallenge = null;
        this._codeVerifier = null;
        this._codeCallback = null;
    }

    public async authenticate() {
        console.info('Authenticating...');

        const generateRandomString = (length: number) => {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            const values = crypto.getRandomValues(new Uint8Array(length));
            return values.reduce((acc, x) => acc + possible[x % possible.length], "");
        }

        const codeVerifier = generateRandomString(64);

        const sha256 = async (plain: string): Promise<ArrayBuffer> => {
            const encoder = new TextEncoder();
            const data = encoder.encode(plain);
            return window.crypto.subtle.digest('SHA-256', data);
        }

        const base64encode = (input: ArrayBuffer): string => {
            return btoa(String.fromCharCode(...new Uint8Array(input)))
                .replace(/=/g, '')
                .replace(/\+/g, '-')
                .replace(/\//g, '_');
        }

        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed)

        this._codeVerifier = codeVerifier;
        this._codeChallenge = codeChallenge;

        const params = {
            response_type: 'code',
            client_id: process.env.CLIENT_ID!,
            redirect_uri: process.env.REDIRECT_URI!,
            code_challenge_method: 'S256',
            code_challenge: this._codeChallenge,
            scope: process.env.SCOPES!,
        };

        localStorage.setItem('codeVerifier', this._codeVerifier);
        localStorage.setItem('codeChallenge', this._codeChallenge);

        let url = new URL(process.env.AUTH_URL!)
        url.search = new URLSearchParams(params).toString();

        // redirect to the Spotify authentication page
        window.location.href = url.toString();

    }

    public async refreshTokens(grant_type: string = 'refresh_token') {

        let payload: RequestInit;

        if (grant_type === 'authorization_code') {

            if (!this._codeVerifier || !this._codeCallback) {
                throw new Error('No code verifier or code callback');
            }

            console.info('Exchanging code for tokens...');

            payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    client_id: process.env.CLIENT_ID!,
                    grant_type: 'authorization_code',
                    code: this._codeCallback,
                    redirect_uri: process.env.REDIRECT_URI!,
                    code_verifier: this._codeVerifier,
                }),
            }

        } else {

            if (!this._refreshToken) {
                throw new Error('No refresh token');
            }

            console.info('Refreshing token...');

            payload = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    CLIENT_ID: process.env.CLIENT_ID!,
                    grant_type: 'refresh_token',
                    refresh_token: this._refreshToken || '',
                }),
            }
        }

        const response = await fetch(new URL(process.env.REFRESH_TOKEN_URL!), payload);
        if (!response.ok) {
            throw new Error('Error while refreshing tokens');
        }

        const responseJson = await response.json();

        // test for null values
        if (!responseJson.access_token || !responseJson.refresh_token || !responseJson.expires_in) {
            throw new Error('Error while refreshing tokens');
        }

        this._accessToken = responseJson.access_token;
        this._refreshToken = responseJson.refresh_token;
        this._expiresAt = Date.now() + responseJson.expires_in * 1000;

        this.storeAccessToken();
        this.storeRefreshToken();
        this.storeExpiresAt();
    }

    public printTokens() {
        let tokens = {
            accessToken: this._accessToken,
            refreshToken: this._refreshToken,
            expiresAt: this._expiresAt,
            codeVerifier: this._codeVerifier,
            codeChallenge: this._codeChallenge,
            codeCallback: this._codeCallback,
        }
        console.table(tokens);
    }

    public isExpired() {
        return Date.now() >= this._expiresAt;
    }

    public isAuthentified() {
        this.printTokens();
        if (this._accessToken && !this.isExpired()) {
            return true;
        } else {
            return false;
        }
    }

    public getAccessToken() {
        if (this.isExpired()) {
            this.refreshTokens();
        } else if (!this._accessToken) {
            this._accessToken = localStorage.getItem('access_token');
        }
        return this._accessToken;
    }

    public restoreTokens() {
        this._codeVerifier = localStorage.getItem('codeVerifier');
        this._codeChallenge = localStorage.getItem('codeChallenge');
        this._accessToken = localStorage.getItem('access_token');
        this._refreshToken = localStorage.getItem('refresh_token');
        this._expiresAt = parseInt(localStorage.getItem('expires_at') || '0');
    }

    private storeAccessToken() {
        if (!this._accessToken) {
            throw new Error('No access token to store');
        }
        localStorage.setItem('access_token', this._accessToken);
    }

    private storeRefreshToken() {
        if (!this._refreshToken) {
            throw new Error('No refresh token to store');
        }
        localStorage.setItem('refresh_token', this._refreshToken);
    }

    private storeExpiresAt() {
        if (!this._expiresAt) {
            throw new Error('No expiration date to store');
        }
        localStorage.setItem('expires_at', this._expiresAt.toString());
    }

    public async handleSpotifyCallback() {
        // Restore the tokens from the local storage then use the code from the URL to get the access token
        this.restoreTokens();

        // Check for null values for codeVerifier
        if (!this._codeVerifier || this._codeVerifier === '') {
            console.error('No code verifier');
            window.router.navigateTo('home?error=no_code_verifier');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);

        let codeCallback = urlParams.get('code');
        if (!codeCallback || codeCallback === '') {
            console.error('No code in URL');
            window.router.navigateTo('home?error=no_code');
            return;
        }
        this._codeCallback = codeCallback;

        await this.refreshTokens('authorization_code');

        if (await this.isAuthentified()) {
            console.info('Succesfuly authenticated!');
            window.router.navigateTo('me');

        } else {
            console.error("Authentication failed");
            window.router.navigateTo('home?error=auth_failed');
        }

        this.cleanUrlParams();
    }

    private cleanUrlParams() {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, document.title, url.toString());
    }

    public logout() {
        // Logout the user by clearing the tokens and redirecting to the home page
        this._expiresAt = 0;
        this._accessToken = null;
        this._refreshToken = null;
        this._codeVerifier = null;
        this._codeChallenge = null;
        this._codeCallback = null;
        localStorage.clear();

        window.router.navigateTo('home');
    }
}