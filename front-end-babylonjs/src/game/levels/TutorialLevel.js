import UI from '../../base/UI';
import Player from '../Player';
import Level from '../../base/Level';
import TilesGenerator from './generators/TilesGenerator';
import ScamsGenerator from './generators/ScamsGenerator';
import BoonsGenerator from './generators/BoonsGenerator';

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
        this.currentTimeLength = 0;

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

        // Sets the active camera
        let camera = this.createCamera();
        this.scene.activeCamera = camera;

        this.light = new BABYLON.HemisphericLight("HemiLight", new BABYLON.Vector3(0, -1, 0), this.scene);
        this.light.intensity = 1;
        this.light.groundColor = new BABYLON.Color3(1, 1, 1);
        this.light.specular = BABYLON.Color3.Black();

        this.createPlayer();

        this.tiles = new TilesGenerator(this);
        this.tiles.generate();
        this.scams = new ScamsGenerator(this);
        this.boons = new BoonsGenerator(this);

        this.scene.useMaterialMeshMap = true;
        this.scene.debugLayer.hide();
        // this.scene.debugLayer.show();
        this.scene.onPointerObservable.add(pointerEvent => {
            BABYLON.Engine.audioEngine.unlock();
            this.audioUnlocked = true;
        })
    }

    /**
     * Function to show Game Instructions
     * Message varies based on device
     * @param {string} messageNumber - Based on message number different tutorial messages will be displayed
     */
    createTutorialText(messageNumber) {
        if (this.player) {

            GAME.pause();
            this.activeMessage = true;
            this.player.infoSound.play();

            this.robbinFlapSpriteManager = new BABYLON.SpriteManager("robbinFlapSpriteManager", "assets/scenes/robin_flap_1.png", 1, { width: 65, height: 62 }, this.scene)
            let robbinFlap = new BABYLON.Sprite("player", this.robbinFlapSpriteManager);
            robbinFlap.playAnimation(0, 5, true, 100);
            robbinFlap.position = new BABYLON.Vector3(-1, 2, -1);

            let text = '', height = 0.15;
            if (messageNumber == 1) {
                text = 'Welcome to Scam Man and Robbin’! \n\n You are Scam Man, a cloaked vigilante who’s on a mission to protect people’s pensions from scams. \n\n I’m Robbin’, and I’m here to help you!';
                height = 0.35;
            } else if (messageNumber == 2) {
                text = 'You must correctly identify six of the most common pension scams and destroy them. \n\n Collect the bonuses and coins to build a healthy pension pot and be in with a chance of winning. ';
                height = 0.31;
            } else if (messageNumber == 3) {
                text = (GAME.isMobile() || GAME.isPad()) ? 'Swipe left and right on the screen to move in each direction…' : 'Use left and right arrow keys to move in each direction…';
            } else if (messageNumber == 4) {
                text = 'Collect as many coins as you can by letting them fall on you…';
            } else if (messageNumber == 5) {
                text = (GAME.isMobile() || GAME.isPad()) ? 'Swipe upwards to activate your torch and shine a light on the falling scams to destroy them…' : 'Use spacebar or up arrow key to activate your torch and shine a light on the falling scams to destroy them…';
            } else if (messageNumber == 6) {
                text = 'Be sure to collect any bonuses that fall, but don’t shine your torch on them as this will destroy them…';
            }
            let hud = new UI('stageLoadingUI', true);
            let menuTexture = hud.menuTexture;

            let background = new BABYLON.GUI.Rectangle();
            background.width = 1;
            background.height = 1;
            background.thickness = 0;
            background.background = "grey";
            background.alpha = 0.75;
            menuTexture.addControl(background);

            // Tutorial Frame
            let image = new BABYLON.GUI.Image("icon", "assets/scenes/tutorial_plate.png");
            image.width = 1;
            image.height = height;
            image.top = (GAME.engine.getRenderHeight() * 16) / 100;
            image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            menuTexture.addControl(image);


            // Tutorial Frame
            let robinName = new BABYLON.GUI.Image("icon", "assets/scenes/tutorial_plate_robin.png");
            robinName.width = 0.22;
            robinName.height = 0.051;
            robinName.top = (GAME.engine.getRenderHeight() * 11) / 100;
            robinName.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            robinName.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            menuTexture.addControl(robinName);

            // Message Frame
            let rectBox = new BABYLON.GUI.Rectangle();
            rectBox.width = 0.67;
            rectBox.height = height;
            rectBox.left = '-15px';
            rectBox.top = (GAME.engine.getRenderHeight() * (height == 0.15 ? 15 : 15)) / 100;
            rectBox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            rectBox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            rectBox.thickness = 0;
            menuTexture.addControl(rectBox);

            // Message Content
            let textControl = new BABYLON.GUI.TextBlock();
            textControl.text = text;
            textControl.fontSize = GAME.engine.getRenderHeight() < 600 ? 11 : 13;
            textControl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
            textControl.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            textControl.textWrapping = true;
            textControl.fontFamily = "'Tomorrow',sans-serif";
            rectBox.addControl(textControl);


            let trigger = setInterval(() => {
                this.skipControl.thickness = this.skipControl.thickness ? 0 : 1.5
            }, 300);
            // Skip Button
            this.skipControl = hud.addImgButton('continueBtn', {
                'imgpath': "assets/scenes/Continue.png",
                'top': ((GAME.engine.getRenderHeight() * ((height + 0.16) * 100)) / 100),
                'width': 0.2,
                'height': 0.055,
                'thickness': 1.5,
                'color': 'white',
                'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
                'onclick': () => {
                    if (!this.player.pausedImage.isVisible) {
                        robbinFlap.dispose();
                        image.dispose();
                        robinName.dispose();
                        rectBox.dispose();
                        textControl.dispose();
                        clearInterval(trigger);
                        this.skipControl.dispose();
                        background.dispose();
                        this.activeMessage = false;
                        GAME.resume();
                        if (messageNumber < 4) {
                            this.createTutorialText(messageNumber + 1);
                        }
                    }
                }
            });

            if (messageNumber == 1) {
                // Top Header
                let modeDis = new BABYLON.GUI.Rectangle();
                modeDis.width = 1;
                modeDis.height = 0.1;
                modeDis.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                modeDis.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                modeDis.thickness = 0;
                modeDis.background = "#45186e";
                menuTexture.addControl(modeDis);

                let modeControl = new BABYLON.GUI.TextBlock();
                modeControl.text = 'Tutorial Mode';
                modeControl.color = 'white'
                modeControl.fontSize = 15;
                modeControl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                modeControl.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                modeControl.textWrapping = true;
                modeControl.fontFamily = "'Tomorrow',sans-serif";
                modeDis.addControl(modeControl);
            }

            let cornerSphere = function (scene) {
                let frustumPlanes = BABYLON.Frustum.GetPlanes(scene.activeCamera.getTransformationMatrix());
                let d = frustumPlanes[0].d;
                let aspectRatio = GAME.engine.getAspectRatio(scene.activeCamera);
                let fov = scene.activeCamera.fov;

                let y = 2 * d * Math.tan(fov / 2);
                let x = y * aspectRatio;
                let z = d;

                robbinFlap.position.x = -x + 1;
                robbinFlap.position.y = y - (2.2 + (height == 0.15 ? 0.1 : 1.2));
                robbinFlap.position.z = z;
                robbinFlap.size = 1.5;
            }

            this.scene.registerBeforeRender(() => cornerSphere(this.scene));

        }
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
        this.player.playerLanding = true;
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
            let player = new BABYLON.Sprite("player", this.player.spriteManagerPlayer['lose']);
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

        this.tutorialTrigger = setInterval(() => {
            if (this.currentTimeLength >= GAME.options.tutorialLength) {
                this.freezeGeneration = true;
                // After all game objects are done start game
                setTimeout(() => {
                    if (!this.player.gameEnded) {
                        this.player.gameEnded = true;
                        clearInterval(this.scams.trigger);
                        clearInterval(this.boons.trigger);
                        GAME.goToLevel('RunnerLevel');
                    }
                }, 3000);
                clearInterval(this.tutorialTrigger);
            }
            if (this.currentTimeLength === 7) {
                this.scams.generate();
            }
            if (this.currentTimeLength === 18) {
                this.player.freezeScams = true;
                this.boons.generate();
            }
            if (!GAME.isPaused()) {
                this.currentTimeLength += 1;
            }
        }, 1000);
    }

    /**
     * Function to call logics that will be rendered seamlessly.
     */
    beforeRender() {
        if (!GAME.isPaused()) {
            this.player.pauseButtonControl.isVisible = true;
            this.player.coinsTextControl.isVisible = false;
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
                    this.player.skipControl.isVisible = true;
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