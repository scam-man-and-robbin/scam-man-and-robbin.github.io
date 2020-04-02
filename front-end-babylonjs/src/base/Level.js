import AssetsDatabase from './AssetsDatabase';

export default class Level {

    constructor() {

        /**
         * We can use this object to store materials that can be reused along the game
         */
        this.materials = {};

        this.scene = null;

        this.assets = null;

        this.foreground = null;
    }

    start() {
        GAME.resume();
        GAME.stopRenderLoop();

        if (this.setProperties) {
            this.setProperties();
        } else {
            GAME.log.debugWarning('The setProperties method is recommended to initialize the Level properties');
        }

        this.createScene();
    }

    createScene() {
        GAME.engine.displayLoadingUI();
        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);
        let imgPath = "";
        if(GAME.currentLevelName === 'RunnerLevel' || GAME.currentLevelName === 'TutorialLevel') {
            // To change bg image based on device
            imgPath = "/assets/scenes/game_bg_dark.png";
        } else {
            imgPath = "/assets/scenes/Start_screen_background.png";
        }

        var background = new BABYLON.Layer("back", imgPath, this.scene);
        background.isBackground = true;
        this.foreground = new BABYLON.Layer("front", "/assets/scenes/distort1.png", this.scene, false);
        this.foreground.layerMask = 0;
        // Add assets management and execute beforeRender after finish
        this.assets = new AssetsDatabase(this.scene, () => {

            GAME.log.debug('Level Assets loaded');

            if (this.buildScene) {
                this.buildScene();
            } else {
                GAME.log.debugWarning('You can add the buildScene method to your level to define your scene');
            }

            // If has the beforeRender method
            if (this.beforeRender) {
                this.scene.registerBeforeRender(
                    this.beforeRender.bind(this)
                );
            } else {
                GAME.log.debugWarning('You can define animations and other game logics that happends inside the main loop on the beforeRender method');
            }

            GAME.startRenderLoop();

        });

        if (this.setupAssets) {
            this.setupAssets();
        }

        // Load the assets
        this.assets.load();

        // Mute sounds by default
        // if (window.localStorage['mute_sound'] === 'undefined' || window.localStorage['mute_sound'] === undefined) {
        //     window.localStorage['mute_sound'] = 1;
        // }
        BABYLON.Engine.audioEngine.onAudioLockedObservable.add(() => {
            GAME.log.debugWarning('Sounds are locked. Please refresh cache');
        });
        BABYLON.Engine.audioEngine.onAudioUnlockedObservable.add(() => {
            // GAME.log.debugWarning('Sounds are unlocked.');
        });

        return this.scene;
    }

    exit() {
        this.scene.dispose();
        this.scene = null;
    }

    addMaterial(material) {
        this.materials[material.name] = material;
    }

    getMaterial(materialName) {
        return this.materials[materialName];
    }

    removeMaterial(materialName) {
        let material = null;
        if (material = this.materials[materialName]) {
            material.dispose();
            delete this.materials[materialName];
        }
    }
}