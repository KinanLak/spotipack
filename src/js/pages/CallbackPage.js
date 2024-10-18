export default class CallbackPage {
    // Handle spotify callback when user is redirected to the callback page
    constructor(authManager) {
        this.authManager = authManager;
        this.container = document.getElementById('app-container');
    }

    render() {
        this.container.innerHTML = `
        <div class="callback-page">
            <h1>Redirection...</h1>
        </div>`;

        this.handleSpotifyCallback();

    }

    async handleSpotifyCallback() {

        this.authManager.codeVerifier = localStorage.getItem('codeVerifier');
        this.authManager.codeChallenge = localStorage.getItem('codeChallenge');


        const urlParams = new URLSearchParams(window.location.search);
        this.authManager.code = urlParams.get('code');

        console.log('Code: ', this.authManager.code);
        console.log('Code challenge 2 : ', this.authManager.codeChallenge);
        console.log('Code verifier 2 : ', this.authManager.codeVerifier);

        console.log('Requesting access token...');
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: this.authManager.client_id,
                grant_type: 'authorization_code',
                code: this.authManager.code,
                redirect_uri: this.authManager.redirect_uri,
                code_verifier: this.authManager.codeVerifier,
            }),
        }

        console.log('Payload : ', payload)

        console.log('Bonjour je suis ici');

        const body = await fetch(this.authManager.refreshTokenUrl, payload);
        const response = await body.json();

        console.log('response : ', response)

        this.authManager.accessToken = response.access_token;
        this.authManager.refreshToken = response.refresh_token;
        this.authManager.expiresAt = Date.now() + response.expires_in * 1000;

        console.log("Access token: ", this.authManager.accessToken);
        console.log("Refresh token: ", this.authManager.refreshToken);
        console.log("Expires at: ", this.authManager.expiresAt);

        localStorage.setItem('access_token', this.authManager.accessToken);
        localStorage.setItem('refresh_token', this.authManager.refreshToken);
        localStorage.setItem('expires_at', this.authManager.expiresAt);

        if (this.authManager.isAuthentified()) {
            console.log('Authenticated!');
            window.router.navigateTo('me');
        } else {
            console.error("Authentication failed");
            // Handle authentication failure (display an error message, etc.)
        }
    }
}