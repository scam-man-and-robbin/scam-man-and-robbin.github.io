import UI from '../../base/UI';
import Player from '../Player';
import Level from '../../base/Level';
import TilesGenerator from './generators/TilesGenerator';
import ScamsGenerator from './generators/ScamsGenerator';
import BoonsGenerator from './generators/BoonsGenerator';
import AgeCounter from './counters/AgeCounter';

export default class RunnerLevel extends Level {

    /**
    * Class description
    *
    * To handle Core Game Level Related Actions. 
    * Core Game Logics for the entire scene are handled here.
    */
    setProperties() {

        this.player = null;

        // Used for ground tiles generation
        this.tiles = null;

        // Menu
        this.menu = null;
        this.pointsTextControl = null;
        this.currentRecordTextControl = null;
        this.hasMadeRecordTextControl = null;
        this.status = null;

    }

    /**
     * Function to setup musics and sound assets
     */
    setupAssets() {

        // Dummy Sounds for Time Being. Needs changing (Or requires providing credits)
        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
        this.assets.addSound('playerDieSound', '/assets/sounds/game-die.mp3', { volume: 0.4 });
        this.assets.addSound('gotCoinSound', '/assets/sounds/coin-c-09.wav');
        this.assets.addSound('damageSound', '/assets/sounds/damage.wav');
        this.assets.addSound('approachSound', '/assets/sounds/monster.wav');
        this.assets.addSound('attackSound', '/assets/sounds/monster_attack.mp3');

    }

    /**
     * Function to set scene with camera, player.
     * Also Coins will be initialized followed by Scam Objects and Boon Objects
     */
    buildScene() {
        // if(GAME.isMobile()) {
        //     var elem = document.getElementById("renderCanvas");
        //     if (elem.requestFullscreen) {
        //         elem.requestFullscreen();
        //     } else if (elem.mozRequestFullScreen) { /* Firefox */
        //         elem.mozRequestFullScreen();
        //     } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
        //         elem.webkitRequestFullscreen();
        //     } else if (elem.msRequestFullscreen) { /* IE/Edge */
        //         elem.msRequestFullscreen();
        //     }
        //     if(screen.orientation) {
        //         screen.orientation.lock("portrait-primary");
        //     } else if(screen.mozOrientation) {
        //         screen.mozOrientation.lock("portrait-primary");
        //     }
        // }

        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        this.createMenus();

        // Sets the active camera
        var camera = this.createCamera();
        this.scene.activeCamera = camera;

        // Uncomment it to allow free camera rotation
        // camera.attachControl(GAME.canvas, true);

        // Add lights to the scene
        var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 10, 0), this.scene);
        var light2 = new BABYLON.PointLight("light2", new BABYLON.Vector3(0, 100, -100), this.scene);
        light1.intensity = 0.9;
        light2.intensity = 0.2;

        this.createPlayer();

        this.tiles = new TilesGenerator(this);
        this.tiles.generate();

        this.ageTimer = new AgeCounter(this);

        // Scams will be started after n seconds.
        setTimeout(() => {
            this.scams = new ScamsGenerator(this);
            this.scams.generate();
        }, GAME.options.player.scamStartAfter);

        // Boons will be started after 3*n+0.5 seconds.
        setTimeout(() => {
            this.boons = new BoonsGenerator(this);
            this.boons.generate();
        }, (GAME.options.player.scamStartAfter * 3) + 500);

        // For now game speed is incremented for each 15 seconds
        setInterval(() => {
            this.setGameSpeed();
        }, 15000);

        this.scene.useMaterialMeshMap = true;
        this.scene.debugLayer.hide();
        // this.scene.debugLayer.show();
    }

    /**
     * Function to build UI objects to show Points/Record/Replay Button/Home Button.
     * Menu will be hidden on start of game.
     */
    createMenus() {
        this.menu = new UI('runnerMenuUI');

        this.gameStatus = this.menu.addText('You Win', {
            'top': '-180px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '40px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.gameSubTextControl = this.menu.addText('You cannot give up. Try reaching Age 65...', {
            'top': '-140px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '15px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.pointsTextControl = this.menu.addText('Points: 0', {
            'top': '-100px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '35px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.currentRecordTextControl = this.menu.addText('Current Record: 0', {
            'top': '-60px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.hasMadeRecordTextControl = this.menu.addText('You got a new Points Record!', {
            'top': '-40px',
            'color': GAME.options.recordTextColor,
            'fontSize': '20px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        this.menu.addButton('replayButton', 'Replay Game', {
            'top': '20px',
            'onclick': () => this.replay()
        });

        this.menu.addButton('backButton', 'Return to Home', {
            'top': '90px',
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });

        this.menu.hide();

        this.createTutorialText();

    }

    /**
     * Function to show Game Instructions
     * Message varies based on device
     */
    createTutorialText() {
        let text = GAME.isMobile() ? 'Swipe screen Left/Right to control Scam Man. Swipe Up to Shoot.' : 'Use Arrow Keys to Move & Space to Shoot.';

        // Small tutorial text
        let tutorialText = this.menu.addText(text, {
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        });

        setTimeout(() => {
            this.menu.remove(tutorialText);
        }, 5000);
    }

    /**
     * Function to setup camera for Game Engine.
     */
    createCamera() {
        let camera = new BABYLON.UniversalCamera("camera", new BABYLON.Vector3(0, 0, -8), this.scene);
        // let camera = new BABYLON.ArcRotateCamera("arcCamera", 0, 0, -8, BABYLON.Vector3.Zero(), this.scene);

        camera.setTarget(BABYLON.Vector3.Zero())

        return camera;
    }

    /**
     * Function to setup player with default lighting.
     */
    createPlayer() {
        // Creates the player and sets it as camera target
        this.player = new Player(this);

        var playerLight = new BABYLON.DirectionalLight("playerLight", new BABYLON.Vector3(1, -2, 1), this.scene);
        playerLight.intensity = 0.3;
        playerLight.parent = this.player.mesh;

        // Actions when player dies
        this.player.onDie = () => {
            GAME.pause();
            this.showMenu();
            this.ageTimer.advancedTexture.dispose();
        }

        // Actions when player wins
        this.player.win = () => {
            GAME.pause();
            this.status = 'WIN';
            this.showMenu();
            this.ageTimer.advancedTexture.dispose();
        }
    }

    /**
     * Function to show Menu with last points/high record
     */
    showMenu() {
        this.pointsTextControl.text = 'Points: ' + this.player.getPoints();
        this.currentRecordTextControl.text = 'Current Record: ' + this.player.getLastRecord();
        if(this.status == 'WIN') {
            this.gameStatus.text = 'You Win!';
            this.gameSubTextControl.text = 'Bravo! Play again to beat the record...'
        } else {
            this.gameStatus.text = 'You Lost!';
            this.gameSubTextControl.text = 'You cannot give up. Try reaching Age 65...'
        }
        this.menu.show();

        if (this.player.hasMadePointsRecord()) {
            this.hasMadeRecordTextControl.isVisible = true;
        } else {
            this.hasMadeRecordTextControl.isVisible = false;
        }
    }

    /**
     * Function to call logics that will be rendered seamlessly.
     */
    beforeRender() {
        if (!GAME.isPaused()) {
            this.player.move();
        }
    }

    /**
     * Function to handle replay option.
     */
    replay() {

        this.player.reset();

        this.speed = GAME.options.player.defaultSpeed;

        this.menu.hide();
        this.status = null;
        this.ageTimer.setupTimer();
        GAME.resume();


    }

    /**
     * Function to return game speed outside this Class 
     */
    getGameSpeed() {
        this.speed = this.speed ? this.speed : GAME.options.player.defaultSpeed
        return this.speed;
    }

    /**
     * Function to increment speed
     */
    setGameSpeed() {
        if (!GAME.isPaused()) {
            this.speed += GAME.options.player.increaseSpeedRatio;
        }
    }

}