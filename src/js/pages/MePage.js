export default class MePage {
    constructor(userTopArtistsManager) {
        this.container = document.getElementById('app-container');
        this.userTopArtistsManager = userTopArtistsManager;
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
        this.userTopArtistsManager.fetchAndDisplayTopArtists();
    }

    // Autres méthodes spécifiques à la page de profil
}