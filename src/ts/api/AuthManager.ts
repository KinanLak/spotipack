export default class AuthManager {

    private _expiresAt: number;
    private _accessToken: string | null
    private _refreshToken: string | null
    private _codeChallenge: string | null
    private _codeCallback: string | null
    private _codeVerifier: string | null

    constructor() {
        this._expiresAt = 0;
        this._accessToken = null;
        this._refreshToken = null;
        this._codeChallenge = null;
        this._codeCallback = null;
        this._codeVerifier = null;
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
        window.location.href = url.toString();

    }

    public async refreshTokens() {
        console.info('Refreshing token...');
        const payload = {
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

        const body = await fetch(new URL(process.env.REFRESH_TOKEN_URL!), payload);
        const response = await body.json();

        this._accessToken = response.access_token;
        this._refreshToken = response.refresh_token;
        this._expiresAt = Date.now() + response.expires_in * 1000;
    }

    public isExpired() {
        return Date.now() >= this._expiresAt;
    }

    public isAuthentified() {
        if (this._accessToken && !this.isExpired()) {
            return true;
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
        localStorage.getItem('codeVerifier');
        localStorage.getItem('codeChallenge');
    }

    public storeAccessToken() {
        if (!this._accessToken) {
            throw new Error('No access token to store');
        }
        localStorage.setItem('access_token', this._accessToken);
    }

    public storeRefreshToken() {
        if (!this._refreshToken) {
            throw new Error('No refresh token to store');
        }
        localStorage.setItem('refresh_token', this._refreshToken);
    }
}