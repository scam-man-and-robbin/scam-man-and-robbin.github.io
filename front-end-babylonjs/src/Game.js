// Base
import Log from './base/Log.js';

// Game Levels
import RunnerLevel from './game/levels/RunnerLevel.js';
import HomeMenuLevel from './game/levels/HomeMenuLevel.js';
import TutorialLevel from './game/levels/TutorialLevel.js';

/**
 * Class Description
 * 
 * To handle High Level entities that are applicable for the entire game
 */
export default class Game {

    constructor(options = {}) {

        /**
         * Sets game options
         */
        this.options = options;

        /**
         * Keyboard pressed keys
         */
        this.keys = {};

        /**
         * Is game paused?
         */
        this.paused = false;

        /**
         * Can be used to log objects and debug the game
         */
        this.log = new Log();

        /**
         * Starts the BABYLON engine on the Canvas element
         */
        this.canvas = document.getElementById("renderCanvas");

        this.engine = new BABYLON.Engine(this.canvas, true);

        this.currentLevel = null;
        this.currentLevelName = 'HomeMenuLevel';

        this.levels = {
            'HomeMenuLevel': new HomeMenuLevel(),
            'RunnerLevel': new RunnerLevel(),
            'TutorialLevel': new TutorialLevel()
        };

    }

    start() {
        this.listenKeys();
        this.lintenTouchEvents();
        this.listenOtherEvents();
        this.startLevel();
    }

    pause(autoAction) {
        if(!this.paused && autoAction && this.currentLevel.player) {
            // this.currentLevel.player.groundImg.isVisible = false;
            // this.currentLevel.player.coinsTextControl.isVisible = false;
            // this.currentLevel.player.pauseButtonControl.isVisible = false;
            // this.currentLevel.player.soundUnMuteButtonControl.isVisible = false;
            // this.currentLevel.player.soundMuteButtonControl.isVisible = false;
            // this.currentLevel.player.message.pauseScreen(this.currentLevel.player.coins,this.currentLevel.player.scamCount,this.currentLevel.player.boonCount,this.currentLevel.scams ? this.currentLevel.scams.scamSet : null)
            GAME.pause();
            this.currentLevel.player.pausedImage.isVisible = true;
            this.currentLevel.player.resumeButton.isVisible = true;
            if(this.currentLevel.player.skipControl) {
                this.currentLevel.player.skipControl.isVisible = false;
            }
        }
        this.paused = true;
    }

    isPaused() {
        return this.paused;
    }

    resume() {
        this.paused = false;
    }

    /**
    * Function to set flags based on User Control Actions via Keyboard
    */
    listenKeys() {

        document.addEventListener('keydown', keyDown.bind(this));
        document.addEventListener('keyup', keyUp.bind(this));

        this.keys.up = false;
        this.keys.down = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.shoot = false;

        function keyDown(e) {
            if (e.keyCode == 87 || e.keyCode == 38) {//Arrow Up
                this.keys.shoot = 1;
            } else if (e.keyCode == 65 || e.keyCode == 37) {//Arrow Left
                this.keys.left = 1;
            } else if (e.keyCode == 68 || e.keyCode == 39) {//Arrow Right
                this.keys.right = 1;
            } else if (e.keyCode == 80 || e.keyCode == 32) {//Arrow Right
                this.keys.shoot = 1;
            }
        }

        function keyUp(e) {
            if (e.keyCode == 87 || e.keyCode == 38) {//Arrow Up
                this.keys.shoot = 0;
            } else if (e.keyCode == 65 || e.keyCode == 37) {//Arrow Left
                this.keys.left = 0;
            } else if (e.keyCode == 68 || e.keyCode == 39) {//Arrow Right
                this.keys.right = 0;
            } else if (e.keyCode == 80 || e.keyCode == 32) {//Arrow Right
                this.keys.shoot = 0;
            }
        }
    }

    /**
     * Function to set flags based on User Control Action via Touch
     */
    lintenTouchEvents() {
        var hammertime = new Hammer(document.body);
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        // hammertime.get('pan').set({ direction: Hammer.DIRECTION_ALL });

        
        // hammertime.on('panleft', (ev) => {
        //     this.keys.left = 1;

        //     setTimeout(() => {
        //         this.keys.left = 0;
        //     }, 10);
        // });

        // hammertime.on('panright', (ev) => {
        //     this.keys.right = 1;

        //     setTimeout(() => {
        //         this.keys.right = 0;
        //     }, 10);
        // });

        // hammertime.on('panup', (ev) => {
        //     this.keys.shoot = 1;

        //     setTimeout(() => {
        //         this.keys.shoot = 0;
        //     }, 10);
        // });

        hammertime.on('swipeup', (ev) => {
            this.keys.shoot = 1;

            // Resets the key after some milleseconds
            setTimeout(() => {
                this.keys.shoot = 0;
            }, 150);
        });

        hammertime.on('swipedown', (ev) => {
            this.keys.down = 1;

            setTimeout(() => {
                this.keys.down = 0;
            }, 100);
        });

        hammertime.on('swipeleft', (ev) => {
            this.keys.left = 2;

            setTimeout(() => {
                this.keys.left = 0;
            }, 150);
        });

        hammertime.on('swiperight', (ev) => {
            this.keys.right = 2;

            setTimeout(() => {
                this.keys.right = 0;
            }, 150);
        });
    }

    /**
     * Function to pause/play when user changes focus away from window
     */
    listenOtherEvents() {
        window.addEventListener('blur', () => {
            this.pause(true);
        });

        window.addEventListener('focus', () => {
            // this.resume();
        });
    }

    /**
     * 
     * @param {string} levelName - Switch to HomeScreen/GameScreen
     */
    goToLevel(levelName) {

        if (!this.levels[levelName]) {
            console.error('A level with name ' + levelName + ' does not exists');
            return;
        }

        if (this.currentLevel) {
            this.currentLevel.exit();
        }

        this.currentLevelName = levelName;
        this.startLevel();
    }

    startLevel() {

        this.currentLevel = this.levels[this.currentLevelName];
        this.currentLevel.start();

    }

    render() {
        this.startRenderLoop();

        window.addEventListener("resize", () => {
            this.engine.resize();
        });

    }

    startRenderLoop() {
        this.engine.runRenderLoop(() => {
            this.currentLevel.scene.render();
        });
    }

    stopRenderLoop() {
        this.engine.stopRenderLoop();
    }

    isMobile() {
        if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }

        return false;
    }

}