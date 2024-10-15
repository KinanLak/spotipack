import { getUserTopArtists } from './api/getUserTopArtists.js';

document.addEventListener('DOMContentLoaded', async () => {
    const token = window.localStorage.getItem('access_token');
    if (!token) {
        
        // Rediriger vers la page de connexion si pas de token
        window.location.href = '/index.html';
        return;
    }

    try {
        const artists = await getUserTopArtists(token);
        console.log("coucou");
        console.log(artists);
        const artistsList = document.getElementById('artists-list');
        artists.forEach(artist => {
            const artistElement = document.createElement('p');
            artistElement.textContent = artist.name;
            artistsList.appendChild(artistElement);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes :', error);
        // Rediriger vers la page de connexion si une erreur se produit
        window.location.href = '/index.html?error=true';
    }
});