export default class BoonsGenerator {

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
        this.createCommonMaterials();

        // For now only one type of Boon Behaviour
        this.boonTypes = [
            'NORMAL_BOON'
        ];

    }

    /**
     * Function to create Boon material.
     * Initial Dev - Simple Green Color Texture
     */
    createCommonMaterials() {

        let boonMaterial = new BABYLON.StandardMaterial('boonMaterial', this.scene);
        boonMaterial.diffuseColor = new BABYLON.Color3.Green();
        boonMaterial.emissiveColor = new BABYLON.Color3.Green();
        boonMaterial.specularColor = new BABYLON.Color3.Green();

        // Freeze materials to improve performance (this material will not be modified)
        boonMaterial.freeze();

        this.level.addMaterial(boonMaterial);

    }

    /**
     * Function to generate coins every n seconds
     * 10 seconds for now. May increase based on UX
     */
    generate() {

        // New boons keep generating every 10 second
        setInterval(() => {
            if (!GAME.isPaused()) {
                var boonType = 'NORMAL_BOON';
                let randomTileTypeNumber = Math.floor((Math.random() * this.boonTypes.length));
                boonType = this.boonTypes[randomTileTypeNumber];
                if (boonType == 'NORMAL_BOON') {
                    this.createBoons('NORMAL_BOON');
                }
            }
        }, 10000);
    }


    /**
     * 
     * @param {string} type - Type of Boon Object
     * Currently only one type of Boon Entity
     */
    createBoons(type) {

        // To position boon objects on different lanes randomly Default to Middle Lane
        let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number
        let positionX = 0;
        if (randomPositionChooser >= 0 && randomPositionChooser < 30) {
            positionX = GAME.isMobile() ? -1 : -2.5; // Positining on the left
        }

        if (randomPositionChooser >= 30) {
            positionX = 0;
        }
        if (randomPositionChooser >= 60) {
            positionX = GAME.isMobile() ? 1 : 2.5; // Positioning on the right
        }
        let boonDiameter = GAME.isMobile() ? 0.2 : 0.4;
        let boons = BABYLON.MeshBuilder.CreateBox("boon_" + randomPositionChooser, {
            width: boonDiameter,
            height: boonDiameter,
            depth: 0.01
        }, this.scene);

        boons.material = this.level.getMaterial('boonMaterial');
        boons.position.x = positionX;
        boons.position.y = 3;
        boons.position.z = 0;

        boons.animations.push(this.createBoonAnimation());
        let boonAnimation = this.scene.beginAnimation(boons, 0, 2000, false);
        var trigger = setInterval(() => {
            let playerMesh = this.player.getMesh();
            if (boons) {
                let boonMesh = [];
                this.scene.meshes.forEach(element => {
                    if (element['name'].includes("bullet") && !boonMesh.includes(element['name'])) {
                        boonMesh.push(element['name']);
                        if (element.intersectsMesh(boons, false)) {
                            boons.dispose();
                            element.visibility = false;
                            clearInterval(trigger);
                        }
                    }
                });
                if (playerMesh.intersectsMesh(boons, false)) {
                    boons.dispose();
                    this.player.keepBoon();
                    clearInterval(trigger);
                }
                if (boons.position.y < (playerMesh.position.y + 0.5)) {
                    boons.dispose();
                    clearInterval(trigger);
                }
            } else {
                clearInterval(trigger);
            }
        }, 5);
        setTimeout(() => {
            boonAnimation.pause();
            boons.dispose();
        }, 10000);
    }

    /**
     * Function to setup boon movements
     * Currenly boons have only vertical motion
     */
    createBoonAnimation() {
        let boonAnimation = new BABYLON.Animation("boonfall", "position.y", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        keys.push({ frame: 0, value: 3 });
        keys.push({ frame: 15, value: 1.5 });
        keys.push({ frame: 30, value: 0 });
        keys.push({ frame: 45, value: -1.5 });
        keys.push({ frame: 60, value: -3 });
        keys.push({ frame: 85, value: -4.5 });

        boonAnimation.setKeys(keys);

        return boonAnimation;
    }

}