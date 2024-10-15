// Fonction pour faire une requête à l'API Spotify et obtenir les artistes les plus écoutés
export async function getUserTopArtists(token) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error('Erreur lors de la récupération des artistes :', error);
        throw error;
    }
}