export default class HomePage {
    constructor() {
        this.container = document.getElementById('app-container');
    }

    render() {
        this.container.innerHTML = `
        <div class="home-page">
            <h1>Bienvenue sur la page d'accueil</h1>
            <div id="login-button-container"></div>
            <button id="go-to-me">Voir mon profil</button>
        </div>`;
        
        this.addEventListeners();
    }

    addEventListeners() {
        const goToMeButton = document.getElementById('go-to-me');
        goToMeButton.addEventListener('click', () => {
            // Nous utiliserons le router pour naviguer
            window.router.navigateTo('me');
        });

        // Ici, vous pouvez ajouter d'autres écouteurs d'événements spécifiques à la page d'accueil
    }

    // Autres méthodes spécifiques à la page d'accueil
}