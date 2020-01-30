export default class TilesGenerator {

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.createCommonMaterials();

    }

    createCommonMaterials() {

        let coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
        coinMaterial.diffuseColor = new BABYLON.Color3.Yellow();
        coinMaterial.emissiveColor = new BABYLON.Color3.Yellow();
        coinMaterial.specularColor = new BABYLON.Color3.Yellow();

        // Scam objects
        let hazardMaterial = new BABYLON.StandardMaterial("hazardMaterial", this.scene);
        hazardMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
        hazardMaterial.emissiveColor = new BABYLON.Color3(0, 0, 1);
        hazardMaterial.specularColor = new BABYLON.Color3(0, 0, 1);

        // Freeze materials to improve performance (this material will not be modified)
        coinMaterial.freeze();
        hazardMaterial.freeze();

        this.level.addMaterial(coinMaterial);
        this.level.addMaterial(hazardMaterial);

    }

    generate() {

        // New coins keep generating every 2 second
        setInterval(() => {
            if(!GAME.isPaused()){
                this.createCoins();
            }
        }, 2000);
    }



    createCoins() {

        // To position scam objects on different lanes randomly Default to Middle Lane
        let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number
        let positionX = 0;
        if(randomPositionChooser >= 0 && randomPositionChooser < 30) {
            positionX = GAME.isMobile() ? -1 : -2.5; // Positining on the left
        }

        if(randomPositionChooser >= 30) {
            positionX = 0;
        }
        if(randomPositionChooser >= 60) {
            positionX = GAME.isMobile() ? 1 : 2.5; // Positioning on the right
        }
        let coinDiameter = GAME.isMobile() ? 0.2 : 0.4;
        let coins = BABYLON.Mesh.CreateCylinder("coin", 0.01, coinDiameter, coinDiameter, 16, 0, this.scene);
        coins.material = this.level.getMaterial('coinMaterial');
        coins.position.x = positionX;
        coins.position.y = 3;
        coins.position.z = 0;
        coins.rotation.x = 1.2;

        coins.animations.push(this.createCoinAnimation());
        let coinAnimation = this.scene.beginAnimation(coins, 0, 2000, false);
        let playerMesh = this.player.getMesh();
        if (coins.intersectsMesh(playerMesh, false)) {
            console.log("yes")
            coins.dispose();
            this.player.keepCoin();
        }
        var trigger = setInterval(() => {
            if(coins.position.y < playerMesh.position.y) {
                this.player.keepCoin();
                clearInterval(trigger);
            }
        }, 10);
        setTimeout(() => {
            coinAnimation.pause();
            coins.dispose();
        }, 20000);
        if(GAME.isPaused()){
            coinAnimation.pause();
        }
    }

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

}