import AuthManager from '../api/AuthManager';
import Spotify from '../api/Spotify';
import Page from './Page';

export default class MePage extends Page {

    spotify: Spotify;
    

    constructor(authManager: AuthManager, spotify: Spotify) {
        super(authManager);
        this.spotify = spotify;

    }

    render() {
        this.container.innerHTML = `

        <div class="me-page">
            <h1>Mon profil</h1>
            <div id="top-artists-container"></div>
            <button id="go-to-home">Retour à l'accueil</button>
        </div>`;

        this.addEventListeners();
        this.loadTopArtists();
    }

    addEventListeners() {
        const goToHomeButton = document.getElementById('go-to-home');
        goToHomeButton.addEventListener('click', () => {
            window.router.navigateTo('home');
        });

        // Autres écouteurs d'événements spécifiques à la page de profil
    }

    loadTopArtists() {
        this.spotify.fetchTopArtist();
    }

    // Autres méthodes spécifiques à la page de profil
}