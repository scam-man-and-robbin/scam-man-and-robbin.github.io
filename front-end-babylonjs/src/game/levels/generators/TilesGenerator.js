export default class TilesGenerator {

    /**
     * Class Description
     * 
     * To handle Coin Object related actions
     * @param {*} level - Values from core game screen
     */
    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.activeCoins = [];
        this.createCommonMaterials();

    }

    /**
     * Function to create coin material.
     * Initial Dev - Simple Yellow Color Texture
     */
    createCommonMaterials() {

        // let coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
        // coinMaterial.diffuseColor = new BABYLON.Color3.Yellow();
        // coinMaterial.emissiveColor = new BABYLON.Color3.Yellow();
        // coinMaterial.specularColor = new BABYLON.Color3.Yellow();

        let coinMaterial = new BABYLON.StandardMaterial("coinMaterial", this.scene);
        coinMaterial.diffuseTexture = new BABYLON.Texture("assets/scenes/Coins.png", this.scene);
        coinMaterial.diffuseTexture.hasAlpha = true;
        coinMaterial.backFaceCulling = true;

        // Freeze materials to improve performance (this material will not be modified)
        // coinMaterial.freeze();

        this.level.addMaterial(coinMaterial);

    }

    /**
     * Function to generate coins every n seconds
     * 2 seconds for now. May increase based on UX
     */
    generate() {

        // New coins keep generating every 2 second
        setInterval(() => {
            if (!GAME.isPaused() && this.player.lives && this.level.age < 65 && !this.level.freezeGeneration) {
                this.createCoins();
            }
        }, 2000);
    }


    /**
     * Function to create coins on random position (3 lanes)
     */
    createCoins() {

        // To position scam objects on different lanes randomly Default to Middle Lane
        let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number
        let positionX = 0;
        if (randomPositionChooser >= 0 && randomPositionChooser < 30) {
            positionX = GAME.isMobile() ? -1 : -1.5; // Positining on the left
        }

        if (randomPositionChooser >= 30) {
            positionX = 0;
        }
        if (randomPositionChooser >= 60) {
            positionX = GAME.isMobile() ? 1 : 1.5; // Positioning on the right
        }
        this.activeCoins.push(randomPositionChooser);
        let coinDiameter = GAME.isMobile() ? 0.3 : 0.4;
        let coins = BABYLON.Mesh.CreateCylinder("coin", 0.01, coinDiameter, coinDiameter, 16, 0, this.scene);
        coins.material = this.level.getMaterial('coinMaterial');
        coins.position.x = positionX;
        coins.position.y = 3;
        coins.position.z = 0;
        coins.rotation.x = 4.712;

        coins.animations.push(this.createCoinAnimation());
        let coinAnimation = this.scene.beginAnimation(coins, 0, 2000, false);
        let playerMesh = this.player.getMesh();
        let groundPlane = this.player.groundMesh;
        /**
         * @todo Currently we have set up passive coin collection. 
         * Incase of collectable action change here
         */
        var trigger = setInterval(() => {
            if (groundPlane.intersectsMesh(coins, false)) {
                coins.dispose();
                this.removeActiveCoin(randomPositionChooser);
                clearInterval(trigger);
            }
            if (playerMesh.intersectsMesh(coins, false)) {
                this.player.keepCoin();
                coins.dispose();
                this.removeActiveCoin(randomPositionChooser);
                clearInterval(trigger);
            }
            if (!this.player.lives || this.level.age >= 65) {
                coins.dispose();
                this.removeActiveCoin(randomPositionChooser);
                clearInterval(trigger);
            }
            if (GAME.isPaused()) {
                coins.paused = true;
                coinAnimation.pause();
            }
            if (!GAME.isPaused() && coins.paused) {
                coinAnimation.restart();
            }
        }, 10);
        setTimeout(() => {
            coinAnimation.pause();
            coins.dispose();
        }, 20000);
        if (GAME.isPaused()) {
            coinAnimation.pause();
        }
    }

    /**
     * Function to setup coin movements
     * Currenly coins have only vertical motion
     */
    createCoinAnimation() {
        let coinAnimation = new BABYLON.Animation("coinfall", "position.y", this.level.getGameSpeed(), BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        keys.push({ frame: 0, value: 3 });
        keys.push({ frame: 15, value: 1.5 });
        keys.push({ frame: 30, value: 0 });
        keys.push({ frame: 45, value: -1.5 });
        keys.push({ frame: 60, value: -3 });
        keys.push({ frame: 85, value: -4.5 });

        coinAnimation.setKeys(keys);

        return coinAnimation;
    }

    removeActiveCoin(randomTileTypeNumber) {
        var index = this.activeCoins.indexOf(randomTileTypeNumber);
        if (index !== -1) this.activeCoins.splice(index, 1);
    }

}