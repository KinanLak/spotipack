export default class UserTopArtistsManager {
    constructor(authManager) {
        this.topArtists = [];
        this.baseUrl = 'https://api.spotify.com/v1';
        this.authManager = authManager;
    }

    async fetchAndDisplayTopArtists() {
        try {
            const access_token = localStorage.getItem('access_token');
            const response = await fetch(this.baseUrl + '/me/top/artists', {
                headers: {
                    'Authorization': 'Bearer ' + access_token
                }
            });
            this.topArtists = await response.json();
            this.displayTopArtists();
        } catch (error) {
            console.error('Erreur lors de la récupération des top artistes:', error);
        }
    }

    displayTopArtists() {
        const container = document.getElementById('top-artists-container');
        if (Array.isArray(this.topArtists) && this.topArtists.length > 0) {
            container.innerHTML = this.topArtists.map(artist => `<li>${artist.name}</li>`).join('');
        } else {
            container.innerHTML = '<li>No top artists found.</li>';
        }
    }
}