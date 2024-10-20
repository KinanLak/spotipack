import AuthManager from "../api/AuthManager";
import Spotify from "../api/Spotify";
import Page from "./Page";

import "@fortawesome/fontawesome-free/css/all.min.css";

export default class MePage extends Page {
    spotify: Spotify;

    constructor(authManager: AuthManager, spotify: Spotify) {
        super(authManager);
        this.spotify = spotify;
        
    }

    public async render() {
        await super.render();

        this.container.innerHTML = `
        <div class="user-profile">
            <div class="user-header">
                <img src="https://i.scdn.co/image/ab6775700000ee859a621ac806a01fa0648b2fd3" alt="Profile Picture" class="profile-image">
                <div class="user-info">
                <h1 class="user-name">Kinan Lakhdar</h1>
                <p class="user-email"><i class="fas fa-envelope"></i> kinan.lakh@gmail.com</p>
                <a href="https://open.spotify.com/user/rp2kd0exmkazchkq6sx7znolf" class="spotify-link"><i class="fab fa-spotify"></i> View Spotify Profile</a>
                </div>
            </div>

            <div class="user-stats">
                <div class="pill">
                <i class="fas fa-flag"></i>
                <p>Country: <strong>FR</strong></p>
                </div>
                <div class="pill">
                <i class="fas fa-users"></i>
                <p>Followers: <strong>3</strong></p>
                </div>
                <div class="pill">
                <i class="fas fa-music"></i>
                <p>Spotify Plan: <strong>Premium</strong></p>
                </div>
                <div class="pill">
                <i class="fas fa-exclamation-circle"></i>
                <p>Explicit Content Filter: <strong>Disabled</strong></p>
                </div>
            </div>
        </div>
        `;
    }
}
