export default class HomePage {
    constructor(authManager) {
        this.authManager = authManager;
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

        //s'il y a un paramètre error
        const urlParams = new URLSearchParams(window.location.search);
        const error = urlParams.get('error');
        if (error) {
            console.log('error', error);

            const errorMessage = document.createElement('p');
            errorMessage.classList.add('error-message');
            errorMessage.textContent = "Nous avons rencontré un problème : " + error;
            errorMessage.style.display = 'block';
            this.container.appendChild(errorMessage);
        }
    }

    addEventListeners() {
        const goToMeButton = document.getElementById('go-to-me');
        goToMeButton.addEventListener('click', async () => {
            await this.handleSpotifyAuth();
            if (this.authManager.isAuthentified()) {
                window.router.navigateTo('me');
            } else {
                console.error("L'authentification a échoué");
                // Gérer l'échec de l'authentification (afficher un message d'erreur, etc.)
            }
        });
    }


    async handleSpotifyAuth() {
        if (!this.authManager.isAuthentified()) {
            await this.authManager.authenticate();
            // Attendre que l'authentification soit terminée
            while (!this.authManager.accessToken) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        console.log('Authenticated!');
        console.log("Access token: ", this.authManager.accessToken);
    }

    // Autres méthodes spécifiques à la page d'accueil
}