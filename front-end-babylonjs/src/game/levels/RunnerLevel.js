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
        this.speed = GAME.options.player.defaultSpeed;

        // this.gamestats = null;
    }

    /**
     * Function to setup musics and sound assets
     */
    setupAssets() {

        // Dummy Sounds for Time Being. Needs changing (Or requires providing credits)
        this.assets.addMusic('music', '/assets/musics/SCAM_MAN_background2.wav', { volume: 0.001, autoplay: true });
        this.assets.addSound('gameLostSound', '/assets/sounds/game-lost.wav', { volume: 0.01 });
        this.assets.addSound('gotCoinSound', '/assets/sounds/coin_going_into_pot.wav', { volume: 0.005 });
        this.assets.addSound('beginGameSound', '/assets/sounds/begin_game.wav', { volume: 0.005 });
        this.assets.addSound('infoSound', '/assets/sounds/info.wav', { volume: 0.003 });
        this.assets.addSound('damageSound', '/assets/sounds/scammed.wav', { volume: 0.01 });
        this.assets.addSound('movementSound', '/assets/sounds/movement.wav', { volume: 0.007 });
        this.assets.addSound('zappingSound', '/assets/sounds/Zapping_Scam.wav', { volume: 0.0025 });
        this.assets.addSound('winningSound', '/assets/sounds/Winning_Sound.wav', { volume: 0.01 });
        this.assets.addSound('splashScreenSound', '/assets/sounds/Winning_Sound.wav', { volume: 0.01 });
        this.assets.addSound('selectSound', '/assets/sounds/Select_sound.wav', { volume: 0.005 });

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
        this.light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), this.scene);
        this.light.intensity = 1;
        this.light.groundColor = new BABYLON.Color3(1,1,1);
        this.light.specular = BABYLON.Color3.Black();


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
        this.speedTrigger = setInterval(() => {
            this.setGameSpeed();
        }, 15000);

        this.scene.useMaterialMeshMap = true;
        this.scene.debugLayer.hide();
        // this.scene.debugLayer.show();
        BABYLON.Engine.audioEngine.useCustomUnlockedButton = true;
    }

    /**
     * Function to build UI objects to show Points/Record/Replay Button/Home Button.
     * Menu will be hidden on start of game.
     */
    createMenus() {
        this.menu = new UI('runnerMenuUI');

        this.lostScreen = this.menu.addImage('lostScreen',{
            'imgpath':"assets/scenes/Game_over_screen.png",
            'width' : 0.8,
            'height' : 0.8,
        });
        this.winningScreen = this.menu.addImage('winningScreen',{
            'imgpath':"assets/scenes/winning_screen_1.png",
            'width' : 0.8,
            'height' : 0.8,
        });
        // this.gameStatus = this.menu.addText('Congratulations!', {
        //     'top': '60px',
        //     'color': GAME.options.pointsTextColor,
        //     'outlineColor': GAME.options.pointsOutlineTextColor,
        //     'outlineWidth': '2px',
        //     'fontSize': '40px',
        //     'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        // });

        this.gameSubTextControl = this.menu.addText('You cannot give up. Try reaching Age 65...', {
            'width' : 0.5,
            'top': '155px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '15px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });
        this.pointsTextControl = this.menu.addText('Pension Pot: £ 0', {
            'top': '220px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '30px',
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
            'top': '260px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.hasMadeRecordTextControl = this.menu.addText('You got a new Points Record!', {
            'top': '300px',
            'color': GAME.options.recordTextColor,
            'fontSize': '20px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.lastDisplay = this.menu.addText('lastText',{
            'top' : '460px',
            'fontSize' : '15px',
            'color': GAME.options.recordTextColor,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'width' : 0.5,
        });
        this.menu.addImgButton('replayButton', {
            'imgpath' : "assets/scenes/Play_again.png",
            'top': '340px',
            'height': '50px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'textVerticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
            'onclick': () => {
                this.player.selectSound.play();
                GAME.goToLevel('RunnerLevel')
            }
        });

        this.menu.addImgButton('Return to Home', {
            'imgpath' : "assets/scenes/Home_Button.png",
            'top': '390px',
            'height': '50px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'textVerticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
            'onclick': () => {
                this.player.selectSound.play();
                GAME.goToLevel('HomeMenuLevel')
            }
        });

        this.menu.addImgButton('Learn more', {
            'imgpath' : "assets/scenes/learnmore.png",
            'top': '550px',
            'height': '15px',
            'width' : 0.2,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'textVerticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
            // 'onclick': () => {
            //     this.player.selectSound.play();
            //     GAME.goToLevel('HomeMenuLevel')
            // }
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
            clearInterval(this.speedTrigger);
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
                this.player.hud.hide();
                this.player.pauseButtonControl.isVisible = false;
                this.player.soundMuteButtonControl.isVisible = false;
                this.player.soundUnMuteButtonControl.isVisible = false;
            });
        }

        // Actions when player wins
        this.player.win = () => {
            this.player.hud.hide();
            this.player.gameEnded = true;
            clearInterval(this.speedTrigger);
            this.player.winningSound.play();
            GAME.pause();
            this.status = 'WIN';
            this.showMenu();
            this.ageTimer.clear();
            this.player.pauseButtonControl.isVisible = false;
            this.player.soundMuteButtonControl.isVisible = false;
            this.player.soundUnMuteButtonControl.isVisible = false;
        }
    }

    /**
     * Function to show Menu with last points/high record
     */
    showMenu() {
        this.menu.show();
        this.lastDisplay.text = 'Unfortunately, Scam Man wont be on hand to protect you! So it is important to know how to identify a pension scan.'
        this.pointsTextControl.text = 'Pension Pot: £' + this.player.getPoints();
        // this.ageTextControl.text = 'Age: ' + this.age;
        this.currentRecordTextControl.text = 'Current Record: ' + this.player.getLastRecord();

        if (this.status == 'WIN') {
            // this.gameStatus.text = 'Congratulations!';
            this.lostScreen.isVisible = false;
            this.gameSubTextControl.text = 'You successfully avoided the scams and completed level 3!'
        } else {
            
            this.winningScreen.isVisible = false;
            this.gameSubTextControl.text = 'You lost! Play again and see if you can avoid the scams to reach level 3!'
        }

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
        if(this.nextStage === 1) {
            GAME.engine.hideLoadingUI();
        }
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