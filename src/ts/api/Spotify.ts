import AuthManager from "./AuthManager";

const BASE_URL: string = 'https://api.spotify.com/v1';

export default class Spotify {
    private authManager: AuthManager;

    constructor(authManager: AuthManager) {
        this.authManager = authManager;
    }

    public async getTopArtists() {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await fetch(BASE_URL + '/me/top/artists', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            });

            const jsonResponse = await response.json();
            let topArtists = [...jsonResponse.items];


            if (response.status === 401) {
                console.error('Erreur d\'authentification:', jsonResponse.error.message);
                this.authManager.refreshTokens();
            }

        } catch (error) {
            console.error('Erreur lors de la récupération des top artistes:', error);
        }
    }
}