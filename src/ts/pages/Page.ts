import AuthManager from "../api/AuthManager";
import Button from "../components/Button";
import '../../css/topbar.scss';
import spotifyIcon from '../../images/spotify-icon.png';


export default class Page {
    protected authManager: AuthManager;
    public container: HTMLElement;

    private logoutButton!: Button;
    private topBar!: HTMLDivElement
    private userIcon!: HTMLImageElement;
    private spotifyIcon!: HTMLImageElement;

    constructor(authManager: AuthManager) {
        this.authManager = authManager;
        this.container = document.getElementById('app-container')!;
        if (!this.container) {
            throw new Error("L'élément app-container est introuvable dans le DOM");
        }

        this.createTopbar();
    }

    public render() {
        //s'il y a un paramètre error
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.has('error') && this.showErrorMessage(urlParams.get('error')!);

        // Ajout de la barre de navigation dans le body
        document.body.appendChild(this.topBar);
    }

    private showErrorMessage(error: string) {
        console.error('error', error);

        const errorMessage = document.createElement('p');
        errorMessage.classList.add('error-message');
        errorMessage.textContent = "Nous avons rencontré un problème : " + error;
        errorMessage.style.display = 'block';
        this.container.appendChild(errorMessage);
    }


    private createTopbar() {
        // Création de la barre de navigation
        this.topBar = document.createElement('div');
        this.topBar.classList.add('top-bar');

        // Création de l'icône Spotify
        this.spotifyIcon = document.createElement('img');
        this.spotifyIcon.src = spotifyIcon; // lien vers l'icône de Spotify
        this.spotifyIcon.alt = 'Spotify Icon';
        this.spotifyIcon.classList.add('spotify-icon');

        // Nom de l'application à côté de l'icône
        const appName = document.createElement('span');
        appName.textContent = 'Spotipack';
        appName.classList.add('app-name');

        // Conteneur gauche pour l'icône et le nom
        const leftContainer = document.createElement('div');
        leftContainer.classList.add('left-container');
        leftContainer.appendChild(this.spotifyIcon);
        leftContainer.appendChild(appName);

        // Icône utilisateur
        this.userIcon = document.createElement('img');
        this.userIcon.src = 'https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png'; // lien vers une icône d'utilisateur
        this.userIcon.alt = 'User Icon';
        this.userIcon.classList.add('user-icon');


        // Nom de l'utilisateur
        const userName = document.createElement('span');
        userName.textContent = 'John Doe';
        userName.classList.add('user-name');

        // Bouton de déconnexion
        this.logoutButton = new Button('logout-button', 'Déconnecter', ['logout-button'], () => { this.authManager.logout(); });

        if (!this.authManager.isAuthentified() || window.location.hash === '#home') {
            console.log('je suis dans la page home, je cache le bouton de déconnexion');
            this.logoutButton.style.display = 'none';
            this.userIcon.style.display = 'none';
            userName.style.display = 'none';
        } else {
            console.log('je suis dans une autre page, j\'affiche le bouton de déconnexion');
            this.logoutButton.style.display = 'block';
            this.userIcon.style.display = 'block';
            userName.style.display = 'block';
        }

        // Conteneur droit pour l'utilisateur et le bouton de déconnexion
        const rightContainer = document.createElement('div');
        rightContainer.classList.add('right-container');
        rightContainer.appendChild(this.userIcon);
        rightContainer.appendChild(userName);
        rightContainer.appendChild(this.logoutButton);

        // Ajout des deux conteneurs dans la barre de navigation
        this.topBar.appendChild(leftContainer);
        this.topBar.appendChild(rightContainer);


    }
}