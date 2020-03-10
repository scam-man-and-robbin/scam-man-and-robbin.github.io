import UI from '../../base/UI';
import Player from '../Player';
import Level from '../../base/Level';
import TilesGenerator from './generators/TilesGenerator';
import ScamsGenerator from './generators/ScamsGenerator';
import BoonsGenerator from './generators/BoonsGenerator';
import AgeCounter from './counters/AgeCounter';
import StageCounter from "./counters/StageCounter";

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
        this.currentStageAge = 0;
        this.nextStage = 1;

        // this.gamestats = null;
    }

    /**
     * Function to setup musics and sound assets
     */
    setupAssets() {

        // Dummy Sounds for Time Being. Needs changing (Or requires providing credits)
        this.assets.addMusic('music', '/assets/musics/Guitar-Mayhem.mp3');
        this.assets.addSound('gameLostSound', '/assets/sounds/game-lost.wav');
        this.assets.addSound('gotCoinSound', '/assets/sounds/coin_going_into_pot.wav');
        this.assets.addSound('beginGameSound', '/assets/sounds/begin_game.wav');
        this.assets.addSound('infoSound', '/assets/sounds/info.wav');
        this.assets.addSound('damageSound', '/assets/sounds/scammed.wav');
        this.assets.addSound('movementSound', '/assets/sounds/movement.wav');
        this.assets.addSound('attackSound', '/assets/sounds/monster_attack.mp3');

    }

    /**
     * Function to set scene with camera, player.
     * Also Coins will be initialized followed by Scam Objects and Boon Objects
     */
    buildScene() {

        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        this.createMenus();
        // this.createGameStats();
        // Sets the active camera
        var camera = this.createCamera();
        this.scene.activeCamera = camera;

        // Uncomment it to allow free camera rotation
        // camera.attachControl(GAME.canvas, true);

        // Add lights to the scene
        // var light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(-100, 100, 100), this.scene);
        //  light2.diffuse = new BABYLON.Color3(1, 0, 1);
        // var light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(1, -1, 1), this.scene);


        //Light direction is directly down from a position one unit up, fast decay
        this.light = new BABYLON.SpotLight("spotLight3", new BABYLON.Vector3(0, -1, -500), new BABYLON.Vector3(0, 0, 1), Math.PI / 2, 50, this.scene);
        this.light.diffuse = new BABYLON.Color3(1, 1, 1);
        this.light.specular = new BABYLON.Color3(1, 1, 1);
        this.light.intensity = 0.5;


        //light1.intensity = 1;
        // light2.intensity = 0.9;

        this.createPlayer();

        this.tiles = new TilesGenerator(this);
        this.tiles.generate();

        this.ageTimer = new AgeCounter(this);
        this.stageCounter = new StageCounter(this);

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

        this.gameStatus = this.menu.addText('Congratulations!', {
            'top': '60px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '40px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.gameSubTextControl = this.menu.addText('You cannot give up. Try reaching Age 65...', {
            'top': '105px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '15px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.pointsTextControl = this.menu.addText('Pension Pot: £ 0', {
            'top': '180px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '35px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        // this.ageTextControl = this.menu.addText('Age: 0', {
        //     'top': '180px',
        //     'color': GAME.options.pointsTextColor,
        //     'outlineColor': GAME.options.pointsOutlineTextColor,
        //     'outlineWidth': '2px',
        //     'fontSize': '35px',
        //     'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        // });

        this.currentRecordTextControl = this.menu.addText('Current Record: 0', {
            'top': '220px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.hasMadeRecordTextControl = this.menu.addText('You got a new Points Record!', {
            'top': '260px',
            'color': GAME.options.recordTextColor,
            'fontSize': '20px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.menu.addButton('replayButton', 'Replay Game', {
            'top': '300px',
            'height': '50px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'textVerticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
            'onclick': () => GAME.goToLevel('RunnerLevel')
        });

        this.menu.addButton('backButton', 'Return to Home', {
            'top': '360px',
            'height': '50px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'textVerticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });

        this.menu.hide();

        // this.createTutorialText();

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

        this.playerLight = new BABYLON.DirectionalLight("playerLight", new BABYLON.Vector3(0, -1, 1), this.scene);
        this.playerLight.intensity = 20;
        this.playerLight.includedOnlyMeshes.push(this.player.mesh);
        this.playerLight.parent = this.player.mesh;
        this.light.excludedMeshes.push(this.player.mesh);

        // Actions when player dies
        this.player.onDie = () => {
            this.player.gameEnded = true;
            this.player.mesh.material.alpha = 0;
            var player = new BABYLON.Sprite("player", this.player.spriteManagerPlayer['lose']);
            player.position = this.player.mesh.position;
            player.position = new BABYLON.Vector3(this.player.mesh.position.x, this.player.mesh.position.y - 0.2, 0);
            player.size = 0.8;
            player.isPickable = true;
            this.player.gameLostSound.play();
            player.playAnimation(0, 2, false, 400, () => {
                GAME.pause();
                this.showMenu();
                this.ageTimer.clear();
                this.player.pauseButtonControl.isVisible = false;
            });
        }

        // Actions when player wins
        this.player.win = () => {
            GAME.pause();
            this.status = 'WIN';
            this.showMenu();
            this.ageTimer.clear();
            this.player.pauseButtonControl.isVisible = false;
        }
    }

    /**
     * Function to show Menu with last points/high record
     */
    showMenu() {
        this.pointsTextControl.text = 'Pension Pot: £' + this.player.getPoints();
        // this.ageTextControl.text = 'Age: ' + this.age;
        this.currentRecordTextControl.text = 'Current Record: ' + this.player.getLastRecord();
        if (this.status == 'WIN') {
            this.gameStatus.text = 'Congratulations!';
            this.gameSubTextControl.text = 'You successfully avoided the scams and completed level 3!'
        } else {
            this.gameStatus.text = 'You Lost!';
            this.gameSubTextControl.text = 'Play again and see if you can avoid the scams to reach level 3!'
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
            // this.player.visible();
            this.player.pauseButtonControl.isVisible = true;
            this.player.coinsTextControl.isVisible = true;
            this.player.move();
            this.age = parseInt(this.ageTimer.ageControl.text);
            if (((this.age - 18) % 16) == 0 && this.currentStageAge !== this.age && !this.player.gameEnded) {
                this.freezeGeneration = true;
                this.holdStage = true;
                this.completeStage();
            }
            if (!this.player.beamEnabled && this.player.changePosition && !this.player.playerLanding && !this.player.gameEnded) {
                this.player.mesh.material.alpha = 1;
            } else {
                this.player.mesh.material.alpha = 0;
            }
        }
        if (this.player.maxCoins && this.player.coins <= 1 && !this.player.gameEnded) {
            this.player.allowCoinChange = false;
            if (this.player.onDie) {
                this.ageTimer.clear();
                this.player.onDie();
            }
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
        this.ageTimer.advancedTexture.isVisible = false;
        this.ageTimer.clear();
        this.ageTimer = new AgeCounter(this);
        this.nextStage = 1;
        this.currentStageAge = 0;
        this.player.gameEnded = false;
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

    completeStage() {
        let trigger = setInterval(() => {
            if (this.holdStage && ((this.freezeGeneration &&
                this.scams &&
                !this.scams.activeScams.length &&
                this.boons &&
                !this.boons.activeBoons.length &&
                this.tiles &&
                !this.tiles.activeCoins.length) || this.nextStage === 1)) {
                    this.player.infoSound.play();
                    this.stageCounter.showStage(this.nextStage);
                    this.currentStageAge = this.age;
                    this.nextStage++;
                    this.holdStage = false;
                    clearInterval(trigger);
            }
        }, 1000);

    }

}