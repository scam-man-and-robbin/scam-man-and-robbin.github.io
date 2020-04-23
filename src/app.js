

// The Game main class
import Game from './Game.js';

window.GAME = null;

// Initialize GAME once Page is Loaded
var app = {

    init() {
        GAME = new Game(window.initialGameOptions);
        GAME.start();
    }

}

window.addEventListener('load', () => {
    app.init();
});