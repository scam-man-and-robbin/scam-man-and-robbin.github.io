import AssetsDatabase from './AssetsDatabase';

export default class Level {

    constructor() {

        /**
         * We can use this object to store materials that can be reused along the game
         */
        this.materials = {};

        this.scene = null;

        this.assets = null;

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
        // Create the scene space
        this.scene = new BABYLON.Scene(GAME.engine);

        // To change bg image based on device
        let imgPath = "/assets/scenes/white_bg.png";
        if(GAME.isMobile()){
            imgPath = "/assets/scenes/white_bg.png";
        }

        var background = new BABYLON.Layer("back", imgPath, this.scene);
        background.isBackground = true;
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

    /**
     * Interpolate a value inside the Level Scene using the BABYLON Action Manager
     * @param {*} target The target object
     * @param {*} property The property in the object to interpolate
     * @param {*} toValue The final value of interpolation
     * @param {*} duration The interpolation duration in milliseconds
     * @param {*} afterExecutionCallback Callback executed after ther interpolation ends
     */
    interpolate(target, property, toValue, duration, afterExecutionCallback = null) {

        if (!this.scene.actionManager) {
            this.scene.actionManager = new BABYLON.ActionManager(this.scene);
        }

        let interpolateAction = new BABYLON.InterpolateValueAction(
            BABYLON.ActionManager.NothingTrigger,
            target,
            property,
            toValue,
            duration
        );

        interpolateAction.onInterpolationDoneObservable.add(() => {
            GAME.log.debug('Interpolation done');
            if (afterExecutionCallback) afterExecutionCallback();
        });

        this.scene.actionManager.registerAction(interpolateAction);
        interpolateAction.execute();

    }

}