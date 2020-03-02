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
        this.nextStage = 0;

        // this.gamestats = null;
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
        
        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        this.createMenus();
        // this.createGameStats();
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

        this.gameStatus = this.menu.addText('You Win', {
            'top': '60px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '40px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.gameSubTextControl = this.menu.addText('You cannot give up. Try reaching Age 65...', {
            'top': '100px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '15px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.pointsTextControl = this.menu.addText('Points: £ 0', {
            'top': '140px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '35px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

        this.ageTextControl = this.menu.addText('Age: 0', {
            'top': '180px',
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '35px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        });

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
            'onclick': () => this.replay()
        });

        this.menu.addButton('backButton', 'Return to Home', {
            'top': '360px',
            'height': '50px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'onclick': () => GAME.goToLevel('HomeMenuLevel')
        });

        this.menu.hide();

        // this.createTutorialText();

    }

    // createGameStats() {
    //     this.gamestats = new UI('statsMenuUI');


    //     this.scoreTextControl = this.gamestats.addText('Points: £ 0', {
    //         'top': '60em',
    //         'left': (GAME.isMobile() ? '10em' : '100em'),
    //         'color': GAME.options.pointsTextColor,
    //         'outlineColor': GAME.options.pointsOutlineTextColor,
    //         'outlineWidth': '2px',
    //         'fontSize': (GAME.isMobile() ? '15px' : '25px'),
    //         'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    //         'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    //     });

    //     this.countScamTextControl = this.gamestats.addText('Scam Faced: 0', {
    //         'top': '60em',
    //         'left': (GAME.isMobile() ? '-10em' : '-100em'),
    //         'color': GAME.options.pointsTextColor,
    //         'outlineColor': GAME.options.pointsOutlineTextColor,
    //         'outlineWidth': '2px',
    //         'fontSize': (GAME.isMobile() ? '10px' : '20px'),
    //         'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
    //         'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    //     });

    //     this.countBoonTextControl = this.gamestats.addText('Boon Count: 0', {
    //         'top': '80em',
    //         'left': (GAME.isMobile() ? '-10em' : '-100em'),
    //         'color': GAME.options.pointsTextColor,
    //         'outlineColor': GAME.options.pointsOutlineTextColor,
    //         'outlineWidth': '2px',
    //         'fontSize': (GAME.isMobile() ? '10px' : '20px'),
    //         'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
    //         'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    //     });
    //     // this.gamestats.addButton('resumeButton', 'RESUME', {
    //     //     'top': '20px',
    //     //     'onclick': () => {
    //     //         GAME.resume();
    //     //         this.gamestats.hide();
    //     //     }
    //     // });


    //     this.gamestats.hide();

    // }

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
            this.ageTimer.clear();
            this.player.pauseButtonControl.isVisible = false;
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
        this.pointsTextControl.text = 'Points: £ ' + this.player.getPoints();
        this.ageTextControl.text = 'Age: ' + this.age;
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

    // pauseMenu(){
    //     GAME.pause();
    //     let sampleSet = this.scams.scamSet;
    //     this.scoreTextControl.text = 'Points: £ ' + this.player.coins;
    //     this.countScamTextControl.text = 'Scam Faced: ' + this.player.getPoints();
    //     this.countBoonTextControl.text = 'Boon Count: ' + this.player.boonCount;
    //     let arr = Array.from(sampleSet);
    //     let temp = 0;
    //     for(let index=0; index<sampleSet.size; index++){
    //         let dummy1 = arr[index];
    //         this.scamNameTextControl = this.gamestats.addText(dummy1,{
    //             'color': GAME.options.pointsTextColor,
    //             'outlineColor': GAME.options.pointsOutlineTextColor,
    //             'outlineWidth': '2px',
    //             'fontSize': (GAME.isMobile() ? '11px' : '15px'),
    //             'top': (GAME.isMobile() ? 93+temp : 150+temp),
    //             'left': (GAME.isMobile() ? '10em' : '100em'),
    //             'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    //             'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
    //         });
    //         let dummy = Message.Message;
    //         console.log('gggg',dummy[dummy1]);
    //         this.scamDescriptionTextControl = this.gamestats.addText(dummy[dummy1].Info,{
    //             'color': GAME.options.pointsTextColor,
    //             'outlineColor': GAME.options.pointsOutlineTextColor,
    //             'outlineWidth': '2px',
    //             'fontSize': (GAME.isMobile() ? '11px' : '15px'),
    //             'top': (GAME.isMobile() ? 110+temp : 170+temp),
    //             'left': (GAME.isMobile() ? '10em' : '100em'),
    //             'paddingRight': (GAME.isMobile() ? 10 : 100),
    //             'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
    //             'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
    //             'textWrapping' : true,
    //         });
    //         temp +=50;
    //     }

    //     this.gamestats.show();
    // }
    /**
     * Function to call logics that will be rendered seamlessly.
     */
    beforeRender() {
        if (!GAME.isPaused()) {
            // this.player.visible();
            this.player.pauseButtonControl.isVisible=true;
            this.player.coinsTextControl.isVisible=true;
            this.player.move();
            this.age = parseInt(this.ageTimer.ageControl.text);
            if(((this.age - 18) % 12) == 0 && this.currentStageAge !== this.age) {
                this.stageCounter.showStage(this.nextStage);
                this.currentStageAge = this.age;
                this.nextStage++;
            }
        }
        if (this.player.maxCoins && this.player.coins <= 1) {
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
        this.nextStage = 0;
        this.currentStageAge = 0;
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