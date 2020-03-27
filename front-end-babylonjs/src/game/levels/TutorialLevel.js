import UI from '../../base/UI';
import Player from '../Player';
import Level from '../../base/Level';
import TilesGenerator from './generators/TilesGenerator';
import ScamsGenerator from './generators/ScamsGenerator';
import BoonsGenerator from './generators/BoonsGenerator';
import AgeCounter from './counters/AgeCounter';
import StageCounter from "./counters/StageCounter";

export default class TutorialLevel extends Level {

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
        this.speed = GAME.options.player.defaultSpeed + 10;
        this.freezeGeneration = false;
        this.age = 18;
        this.gameStarted = false;

        // this.gamestats = null;
    }

    /**
     * Function to setup musics and sound assets
     */
    setupAssets() {

        // Dummy Sounds for Time Being. Needs changing (Or requires providing credits)
        this.assets.addMusic('music', '/assets/musics/SCAM_MAN_background2.wav', { volume: 0.0025, autoplay: true });
        this.assets.addSound('gameLostSound', '/assets/sounds/game-lost.wav', { volume: 0.01 });
        this.assets.addSound('gotCoinSound', '/assets/sounds/coin_going_into_pot.wav', { volume: 0.0008 });
        this.assets.addSound('beginGameSound', '/assets/sounds/begin_game.wav', { volume: 0.0015 });
        this.assets.addSound('infoSound', '/assets/sounds/info.wav', { volume: 0.001 });
        this.assets.addSound('damageSound', '/assets/sounds/scammed.wav', { volume: 0.001 });
        this.assets.addSound('movementSound', '/assets/sounds/movement.wav', { volume: 0.002 });
        this.assets.addSound('zappingSound', '/assets/sounds/Zapping_Scam.wav', { volume: 0.0003 });
        this.assets.addSound('winningSound', '/assets/sounds/Winning_Sound.wav', { volume: 0.001 });
        this.assets.addSound('splashScreenSound', '/assets/sounds/Winning_Sound.wav', { volume: 0.001 });
        this.assets.addSound('selectSound', '/assets/sounds/Select_sound.wav', { volume: 0.001 });

    }

    /**
     * Function to set scene with camera, player.
     * Also Coins will be initialized followed by Scam Objects and Boon Objects
     */
    buildScene() {

        this.scene.clearColor = new BABYLON.Color3.FromHexString(GAME.options.backgroundColor);

        // this.createGameStats();
        // Sets the active camera
        var camera = this.createCamera();
        this.scene.activeCamera = camera;

        //Light direction is directly down from a position one unit up, fast decay
        // this.light = new BABYLON.SpotLight("spotLight3", new BABYLON.Vector3(0, -1, -500), new BABYLON.Vector3(0, 0, 1), Math.PI / 2, 50, this.scene);
        // this.light.diffuse = new BABYLON.Color3(1, 1, 1);
        // this.light.specular = new BABYLON.Color3(1, 1, 1);
        // this.light.intensity = 0.5;

        this.light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), this.scene);
        this.light.intensity = 1;
        this.light.groundColor = new BABYLON.Color3(1, 1, 1);
        this.light.specular = BABYLON.Color3.Black();

        this.createPlayer();

        this.tiles = new TilesGenerator(this);
        this.tiles.generate();

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

        this.scene.useMaterialMeshMap = true;
        this.scene.debugLayer.hide();
        // this.scene.debugLayer.show();
        this.scene.onPointerObservable.add(pointerEvent => {
            if(!this.audioUnlocked) {
                BABYLON.Engine.audioEngine.unlock();
                this.audioUnlocked = true;
            }
        })
    }

    /**
     * Function to show Game Instructions
     * Message varies based on device
     */
    createTutorialText(messageNumber) {

        this.player.infoSound.play();

        this.robbinFlapSpriteManager = new BABYLON.SpriteManager("robbinFlapSpriteManager", "assets/scenes/robin_flap_1.png", 1, { width: 65, height: 62 }, this.scene)
        var robbinFlap = new BABYLON.Sprite("player", this.robbinFlapSpriteManager);
        robbinFlap.playAnimation(0, 5, true, 100);
        robbinFlap.position = new BABYLON.Vector3(-1, 2, -1);

        let text = '';
        if (messageNumber == 1) {
            text = (GAME.isMobile() || GAME.isPad()) ? 'Swipe screen Left/Right to control Scam Man. Swipe Up to Shoot.' : 'Use Arrow Keys to Move & Space to Shoot.';
        } else if (messageNumber == 2) {
            text = (GAME.isMobile() || GAME.isPad()) ? 'Swipe up to shine your torch.' : 'Use Up Arrow keys or Space to shine your torch.';
        } else if (messageNumber == 3) {
            text = 'Collect as many coins and bonuses as you can to win the game.';
        }
        var menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI('uiName', false);

        let image = new BABYLON.GUI.Image("icon", "assets/scenes/tutorial_plate.png");
        image.width = 1;
        image.height = 0.2;
        image.top = (GAME.engine.getRenderHeight()*10)/100;
        image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        menuTexture.addControl(image);

        var rectBox = new BABYLON.GUI.Rectangle();
        rectBox.width = 0.65;
        rectBox.height = 0.2;
        rectBox.left = '-15px';
        rectBox.top = (GAME.engine.getRenderHeight()*12)/100;
        rectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        rectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rectBox.thickness = 0;
        menuTexture.addControl(rectBox);

        var textControl = new BABYLON.GUI.TextBlock();
        textControl.text = text;
        textControl.fontSize = 15;
        textControl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textControl.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        textControl.textWrapping = true;
        textControl.fontFamily = "'Tomorrow',sans-serif";
        rectBox.addControl(textControl);

        if (messageNumber == 1)
        {
            var modeDis = new BABYLON.GUI.Rectangle();
            modeDis.width = 1;
            modeDis.height = 0.1;
            modeDis.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            modeDis.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            modeDis.thickness = 0;
            modeDis.background = "#45186e";
            menuTexture.addControl(modeDis);

            var modeControl = new BABYLON.GUI.TextBlock();
            modeControl.text = 'Tutorial Mode';
            modeControl.color = 'white'
            modeControl.fontSize = 15;
            modeControl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            modeControl.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            modeControl.textWrapping = true;
            modeControl.fontFamily = "'Tomorrow',sans-serif";
            modeDis.addControl(modeControl);
        }

        var cornerSphere = function (scene) {
            let frustumPlanes = BABYLON.Frustum.GetPlanes(scene.activeCamera.getTransformationMatrix());
            let d = frustumPlanes[0].d;
            let aspectRatio = GAME.engine.getAspectRatio(scene.activeCamera);
            let fov = scene.activeCamera.fov;

            let y = 2 * d * Math.tan(fov / 2);
            let x = y * aspectRatio;
            let z = d;

            robbinFlap.position.x = -x + 1;
            robbinFlap.position.y = y - 2.2;
            robbinFlap.position.z = z;
            robbinFlap.size = 1.5;
        }

        this.scene.registerBeforeRender(() => cornerSphere(this.scene));

        setTimeout(() => {
            robbinFlap.dispose();
            // menuTexture.dispose();
            image.dispose();
            rectBox.dispose();
            textControl.dispose();
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
                this.player.pauseButtonControl.isVisible = false;
                this.player.soundMuteButtonControl.isVisible = false;
                this.player.soundUnMuteButtonControl.isVisible = false;
            });
        }

        // Actions when player wins
        this.player.win = () => {
            this.player.gameEnded = true;
            clearInterval(this.speedTrigger);
            this.player.winningSound.play();
            GAME.pause();
            this.status = 'WIN';
            this.player.pauseButtonControl.isVisible = false;
            this.player.soundMuteButtonControl.isVisible = false;
            this.player.soundUnMuteButtonControl.isVisible = false;
        }

        // Tutorial level length
        setTimeout(() => {
            this.freezeGeneration = true;
            // After all game objects are done start game
            setTimeout(() => {
                if (!this.player.gameEnded) {
                    this.player.gameEnded = true;
                    GAME.goToLevel('RunnerLevel')
                }
            }, 5000);
        }, GAME.options.tutorialLength * 1000);
    }

    /**
     * Function to call logics that will be rendered seamlessly.
     */
    beforeRender() {
        if (!GAME.isPaused()) {
            this.player.pauseButtonControl.isVisible = true;
            this.player.coinsTextControl.isVisible = false;
            this.player.skipControl.isVisible = true;
            this.player.move();
            if (!this.player.beamEnabled && this.player.changePosition && !this.player.playerLanding && !this.player.gameEnded && this.nextStage) {
                this.player.mesh.material.alpha = 1;
            } else {
                this.player.mesh.material.alpha = 0;
            }
            if (!this.gameStarted) {
                setTimeout(() => {
                    // Land player without any text
                    this.nextStage = 1;
                    this.player.landPlayer();
                    this.createTutorialText(1);
                }, 2000);
                this.freezeGeneration = true;
                this.gameStarted = true;
                this.player.mesh.material.alpha = 0;
            }
        }
    }

    /**
     * Function to return game speed outside this Class 
     */
    getGameSpeed() {
        return this.speed;
    }

}