// src/js/auth/spotifyAuth.js

// Import du fichier CSS (si nécessaire)
import '../../stylesheets/style.scss';

// Variables pour l'authentification
const client_id = '7e9935a5e5d84840b8b26ee8fb9678be'; // Remplace par ton client_id Spotify
const redirect_uri = 'http://localhost:3000/me.html'; // Remplace par ton URL de redirection
const scopes = 'user-top-read'; // Permissions pour accéder aux artistes les plus écoutés

// URL pour rediriger l'utilisateur vers Spotify pour l'authentification
const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scopes)}`;

// Fonction pour rediriger l'utilisateur vers l'authentification
export function authenticate() {
    window.location.href = authUrl;
}

// Fonction pour récupérer le token d'accès dans l'URL après la redirection
export function storeAccessToken() {
    const hash = window.location.hash;
    if (!hash) return null;
    const token = hash
        .substring(1)
        .split('&')
        .find(elem => elem.startsWith('access_token'))
        ?.split('=')[1];
    if (token) {
        localStorage.setItem('access_token', token);
        return token;
    }
}

