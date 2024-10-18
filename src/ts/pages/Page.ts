import AuthManager from "../api/AuthManager";
import '../styles/topbar.scss';

export default class Page {
    protected authManager: AuthManager;
    protected container: HTMLElement;

    constructor(authManager: AuthManager) {
        this.authManager = authManager;
        this.container = document.getElementById('app-container')!;
        if (!this.container) {
            throw new Error("L'élément app-container est introuvable dans le DOM");
        }
    }

    public render() {
        this.createTopbar();
        
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

        this.createTopbar();
    }

    createTopbar() {
        // Création de la barre de navigation
        const topBar = document.createElement('div');
        topBar.classList.add('top-bar');

        // Création de l'icône Spotify
        const spotifyIcon = document.createElement('img');
        spotifyIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/2/26/Spotify_logo_with_text.svg'; // lien vers une icône Spotify
        spotifyIcon.alt = 'Spotify Icon';
        spotifyIcon.classList.add('spotify-icon');

        // Nom de l'application à côté de l'icône
        const appName = document.createElement('span');
        appName.textContent = 'Spotipack';
        appName.classList.add('app-name');

        // Conteneur gauche pour l'icône et le nom
        const leftContainer = document.createElement('div');
        leftContainer.classList.add('left-container');
        leftContainer.appendChild(spotifyIcon);
        leftContainer.appendChild(appName);

        // Icône utilisateur
        const userIcon = document.createElement('img');
        userIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'; // lien vers une icône d'utilisateur
        userIcon.alt = 'User Icon';
        userIcon.classList.add('user-icon');

        // Nom de l'utilisateur
        const userName = document.createElement('span');
        userName.textContent = 'John Doe';
        userName.classList.add('user-name');

        // Bouton de déconnexion
        const logoutButton = document.createElement('button');
        logoutButton.textContent = 'Déconnecter';
        logoutButton.classList.add('logout-button');

        // Conteneur droit pour l'utilisateur et le bouton de déconnexion
        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container');
        rightContainer.appendChild(userIcon);
        rightContainer.appendChild(userName);
        rightContainer.appendChild(logoutButton);

        // Ajout des deux conteneurs dans la barre de navigation
        topBar.appendChild(leftContainer);
        topBar.appendChild(rightContainer);

        // Ajout de la barre de navigation dans le body
        document.body.appendChild(topBar);
    }

    addEventListeners(logoutButton: HTMLElement) {
        //event lisnet for the logout button
        logoutButton?.addEventListener('click', () => {
            this.authManager.logout();
        });
    }
}