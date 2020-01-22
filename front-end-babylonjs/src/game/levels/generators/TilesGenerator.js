export default class TilesGenerator {

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;

        /**
         * Default tiles properties
         */
        this.tileDepth = 5;
        this.maxTilesAtTime = 1;
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
        this.generatedTilesBlocksNumber = 0;
        this.startedCoin = false;
        this.scene.enablePhysics(new BABYLON.Vector3(0, -5, 0));
        this.createCommonMaterials();

    }

    createCommonMaterials() {

        let coinMaterial = new BABYLON.StandardMaterial('coinMaterial', this.scene);
        coinMaterial.diffuseTexture = new BABYLON.Texture("assets/scenes/coin_euro.png", this.scene);
        coinMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.coinColor);
        coinMaterial.emissiveColor = new BABYLON.Color3.FromHexString(GAME.options.coinColor);

        // Ground on which player is positioned
        let tileMaterialLight = new BABYLON.StandardMaterial("tileMaterialLight", this.scene);
        tileMaterialLight.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.tileLightColor);
        tileMaterialLight.alpha = 0;

        // Ground on which player is positioned
        let tileMaterialDark = new BABYLON.StandardMaterial("tileMaterialDark", this.scene);
        tileMaterialDark.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.tileDarkColor);
        tileMaterialDark.alpha = 0;

        // Scam objects
        let hazardMaterial = new BABYLON.StandardMaterial("hazardMaterial", this.scene);
        hazardMaterial.diffuseTexture = new BABYLON.Texture("assets/scenes/coin_euro.png", this.scene);
        hazardMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.hazardColor);

        // Freeze materials to improve performance (this material will not be modified)
        coinMaterial.freeze();
        tileMaterialLight.freeze();
        tileMaterialDark.freeze();
        hazardMaterial.freeze();

        this.level.addMaterial(coinMaterial);
        this.level.addMaterial(tileMaterialLight);
        this.level.addMaterial(tileMaterialDark);
        this.level.addMaterial(hazardMaterial);

    }

    generate() {
        if (!this.startedCoin) {
            this.createNormalGroundTile();
        }

        // Increases the number of generated tile blocks (to add tags on objects and easily dispose them)
        this.generatedTilesBlocksNumber += 1;

        // Let's generate the next 20 ground tiles (or holes :D) - 200 "meters" of tiles
        for (let currentTilesNumber = 1; currentTilesNumber <= this.maxTilesAtTime; currentTilesNumber++) {

            // Increment the global level number of generated tiles
            this.generatedTilesNumber += 1;

            // Colliders default options (the colliders will be used to throw actions actions like: dispose old tiles, 
            // generate more tiles, etc)
            // Set visible to true to see the colliders on the scene
            let collidersDefaultOptions = {
                width: 100,
                height: 100,
                visible: false,
                disposeAfterCollision: true,
                collisionMesh: this.player.getMesh(),
                positionZ: ((this.generatedTilesNumber - 1) * this.tileDepth),
            };

            // If is the first tile at time (skips first generation because it is not necessary), 
            // adds a collider (this collider will be used to delete the old tiles)
            // whenever the player intersects it.
            if (currentTilesNumber == 1 && this.generatedTilesNumber != 1) {

                // Copy default options
                let colliderOptions = Object.assign({}, collidersDefaultOptions);
                colliderOptions.onCollide = () => {
                    this.disposeOldTiles();
                }

                this.level.addCollider('deleteOldTilesCollider', colliderOptions);

            }

            // If is the tenth tile (1), we'll add a collider to generate more tile when collides with it
            if (currentTilesNumber == 1) {

                // Copy default options
                let colliderOptions = Object.assign({}, collidersDefaultOptions);
                colliderOptions.onCollide = () => {
                    this.generate();
                }

                this.level.addCollider('generateMoreTilesCollider', colliderOptions);
            }

            this.createTiles();

        }

    }

    createTiles() {

        // If the player is starting to play (first 200 'meters'), creates normal ground tiles,
        // else, choose a tyle type randomly
        // Start scam objects to fall after 3 tiles
        if (this.generatedTilesNumber > 3) {
            this.createTileWithHighObstacleTile();
        }
    }

    /**
     * Create tile helpful to measure age
     * @param {*} options 
     */
    createTile(options) {

        options = options ? options : { width: GAME.options.level.tileWidth, height: 0.1, depth: this.tileDepth };

        let tile = BABYLON.MeshBuilder.CreateBox("groundTile" + this.generatedTilesNumber, options, this.scene);
        BABYLON.Tags.AddTagsTo(tile, 'tilesBlock tilesBlock' + this.generatedTilesBlocksNumber);

        tile.receiveShadows = true;

        tile.position.z = ((this.generatedTilesNumber - 1) * this.tileDepth);
        tile.position.y = -0.5;

        tile.checkCollisions = true;

        tile.material = ((this.generatedTilesNumber % 2) == 0) ? this.level.getMaterial('tileMaterialLight') : this.level.getMaterial('tileMaterialDark');


        return tile;

    }

    /**
     * Create coins for an specific tile 
     * @param {*} tile 
     */
    createCoins(tile) {
        this.startedCoin = true;
        // To keep repeating coin generation
        setInterval(() => {
            if (!GAME.isPaused()) {
                let positionX = tile.position.x;
                let slideByX = 0;
                let playerMesh = this.player.getMesh();
                let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number

                if (randomPositionChooser >= 0 && randomPositionChooser < 33.33) {
                    positionX = -4; // Positining on the left
                    slideByX = -1;
                }

                if (randomPositionChooser >= 33.33) {
                    positionX = tile.position.x
                }

                if (randomPositionChooser >= 66.66) {
                    positionX = 4.2; // Positioning on the right
                    slideByX = 1;
                }

                // To generate currency coins
                let coinsNumber = this.generatedTilesNumber;
                let sphere = BABYLON.Mesh.CreateCylinder("coin_fall_" + Math.random() + coinsNumber + this.generatedTilesNumber, .25, 0.8, 0.8, 16, 0, this.scene);
                sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 300 }, this.scene);
                sphere.material = this.level.getMaterial('coinMaterial');
                sphere.position.x = positionX;
                sphere.position.y = 6;
                sphere.position.z = playerMesh.position.z + 25;
                sphere.rotation.x = 2;
                BABYLON.Tags.AddTagsTo(sphere, 'tilesBlock_fall tilesBlock' + this.generatedTilesBlocksNumber);
                sphere.physicsImpostor.setLinearVelocity({
                    'isNonUniform': true,
                    'x': slideByX,
                    'y': 0.001,
                    'z': 0
                });
                sphere.executeOnIntersection(playerMesh, () => {
                    this.player.keepCoin();
                    sphere.material.alpha = 0;
                    this.level.interpolate(sphere.position, 'y', 1000, 10);
                }, true);
                setTimeout(() => {
                    sphere.dispose();
                }, 20000);
            }
        }, 300);
    }

    createNormalGroundTile() {


        let tile = this.createTile();

        // 60% chances to generate coins on the tile
        if (Math.floor((Math.random() * 100)) > 40) {
            this.createCoins(tile, true);
        }
    }

    /**
     * Create scam objects for an specific type 
     */
    createTileWithHighObstacleTile(tileNumber) {

        let tile = this.createTile(tileNumber);
        let positionX = tile.position.x;
        let slideByX = 0;
        let playerMesh = this.player.getMesh();
        let playerMesh2 = this.player.getMesh2();

        // To position scam objects on different lanes randomly Default to Middle Lane
        let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number

        // if(randomPositionChooser >= 0 && randomPositionChooser < 30) {
        //     positionX = -4.5; // Positining on the left
        //     slideByX = -1.5;
        // }          

        // // if(randomPositionChooser >= 20) {
        // //     positionX = -0.6666; // Positining on the left
        // // }

        // if(randomPositionChooser >= 30) {
        //     positionX = tile.position.x
        // }

        // // if(randomPositionChooser >= 60) {
        // //     positionX = 0.6666; // Positioning on the right
        // // }

        // if(randomPositionChooser >= 60) {
        //     positionX = 4.5; // Positioning on the right
        //     slideByX = 1.5;
        // }
        let coinsNumber = 1;
        let sphere = BABYLON.Mesh.CreateCylinder("scam_fall_" + Math.random() + coinsNumber + this.generatedTilesNumber, .25, 0.8, 0.8, 16, 0, this.scene);
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 300 }, this.scene);
        sphere.material = this.level.getMaterial('hazardMaterial');
        sphere.position.x = positionX;
        sphere.position.y = 5;
        sphere.position.z = playerMesh.position.z + 20;
        sphere.rotation.x = 2;
        BABYLON.Tags.AddTagsTo(sphere, 'tilesBlock_fall tilesBlock' + this.generatedTilesBlocksNumber);
        sphere.physicsImpostor.setLinearVelocity({
            'isNonUniform': true,
            'x': slideByX,
            'y': 0.001,
            'z': 0
        });
        let dropped = false;
        setInterval(() => {
            if (!dropped) {
                if (sphere.position.y < playerMesh2.position.y) {
                    sphere.dispose();
                    this.player.die();
                    dropped = true;
                }
            }
        }, 100);
        setTimeout(() => {
            sphere.dispose();
        }, 20000);

    }

    /**
     * Disposes old tiles and obstacles (last 20 unused tiles and their obstacles)
     */
    disposeOldTiles() {
        let lastTilesBlock = this.generatedTilesBlocksNumber - 1,
            tilesBlocks = this.scene.getMeshesByTags('tilesBlock' + lastTilesBlock);

        for (let index = 0; index < tilesBlocks.length; index++) {
            tilesBlocks[index].dispose();
        }
    }

    /**
     * Disposes all level tiles to restart the level
     */
    disposeAll() {
        let tilesBlocks = this.scene.getMeshesByTags('tilesBlock');

        for (let index = 0; index < tilesBlocks.length; index++) {
            tilesBlocks[index].dispose();
        }
    }

    reset() {
        this.disposeAll();
        this.lastTileType = 'HOLE';
        this.generatedTilesNumber = 0;
    }

}