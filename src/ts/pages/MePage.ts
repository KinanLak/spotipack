import AuthManager from '../api/AuthManager';
import Spotify from '../api/Spotify';
import Page from './Page';

export default class MePage extends Page {

    spotify: Spotify;


    constructor(authManager: AuthManager, spotify: Spotify) {
        super(authManager);
        this.spotify = spotify;

    }

    public render() {
        super.render();
        
        let mydiv = document.createElement('div');

        mydiv.innerHTML = `
        <div class="me-page">
            <h1>Mon profil</h1>
            <div id="top-artists-container"></div>
            <button id="go-to-home">Retour à l'accueil</button>
        </div>`;

        this.container.appendChild(mydiv);

        ///this.loadTopArtists();


    }



    private loadTopArtists() {
        //this.spotify.fetchTopArtist();
    }

    // Autres méthodes spécifiques à la page de profil
}