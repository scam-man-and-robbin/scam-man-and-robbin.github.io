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

        if (this.isMobile() || this.isPad()) {
            this.canvas = document.getElementById("renderCanvas");
            let canvas = document.getElementsByClassName("device")[0];
            if(canvas) {
                canvas.style.display = 'none';
            }
        }
        else {
            this.canvas = document.getElementById("renderCanvasDesktop");
            // $('#renderCanvasDesktop').width($('#canvas').height() / 1.7786);
            $('.device-frame').width($('#canvas').height() / 1.7786);
            let canvas = document.getElementById("renderCanvas");
            if(canvas) {
                canvas.style.display = 'none';
            }
        }
        this.engine = new BABYLON.Engine(this.canvas, false);
        this.audioEngine = new BABYLON.AudioEngine;
        this.audioEngine.useCustomUnlockedButton = true;

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

    /**
     * Function to define actions when pause button is clicked
     */
    pause(autoAction) {
        if (!this.paused && autoAction && this.currentLevel.player) {
            GAME.pause();
            this.currentLevel.player.pausedImage.isVisible = true;
            this.currentLevel.player.resumeButton.isVisible = true;
            if (this.currentLevel.player.skipControl) {
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
        let hammertime = new Hammer(document.body);
        hammertime.get('swipe').set({ direction: Hammer.DIRECTION_ALL });

        hammertime.on('swipeup', (ev) => {
            ev.preventDefault();
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
            }, 80);
        });

        hammertime.on('swiperight', (ev) => {
            this.keys.right = 2;

            setTimeout(() => {
                this.keys.right = 0;
            }, 80);
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
            window.addEventListener("resize", () => {
                this.engine.resize();
            });
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
            // || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)) {
            return true;
        }

        return false;
    }

    isPad() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|android|playbook|silk|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)))
          return true;

        try {
            if (userAgent.match(/Macintosh/i) !== null) {
                // need to distinguish between Macbook and iPad
                let canvas = document.createElement("canvas");
                if (canvas !== null) {
                    let context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
                    if (context) {
                        let info = context.getExtension("WEBGL_debug_renderer_info");
                        if (info) {
                            let renderer = context.getParameter(info.UNMASKED_RENDERER_WEBGL);
                            if (renderer.indexOf("Apple") !== -1)
                                return true;
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err)
            // document.getElementById("error").innerText = error.message;
        }

        return false;
    }

}