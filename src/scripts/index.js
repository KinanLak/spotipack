import { authenticate, storeAccessToken } from './api/auth.js';

import "../stylesheets/style.scss";

console.log('bonjour');

// Utilisation des fonctions
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', authenticate);
});

// Après la redirection, vous pouvez utiliser storeAccessToken et getUserTopArtists
try {
    storeAccessToken();
} catch (error) {
    console.error('Erreur lors de la récupération du token :', error);
}