import UI from './../../../base/UI';
import Message from '../../../../public/message.json';
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
        this.typeOfBoon = 0;
        this.texture = null;
        this.boonSet = new Set();
        // Special Boons
        this.boonTypes = [
            // 'NORMAL_BOON',
            'INVISIBLITY_BOON',
            'LIFE_BOON'
        ];

    }

    /**
     * Function to create Boon material.
     * Initial Dev - Simple Green Color Texture
     */
    createCommonMaterials() {
        this.boonMaterial = new BABYLON.StandardMaterial('boonMaterial', this.scene);
        this.boonMaterial.diffuseColor = new BABYLON.Color3.Green();
        this.boonMaterial.emissiveColor = new BABYLON.Color3.Green();
        this.boonMaterial.specularColor = new BABYLON.Color3.Green();
        this.level.addMaterial(this.boonMaterial);
    }

    /**
     * Function to generate coins every n seconds
     * 10 seconds for now. May increase based on UX
     */
    generate() {

        // New boons keep generating every 10 second
        setInterval(() => {
            if (!GAME.isPaused() && this.player.lives) {
                var boonType = 'NORMAL_BOON';
                let flag;
                let randomTileTypeNumber = Math.floor((Math.random() * this.boonTypes.length));
                boonType = this.boonTypes[randomTileTypeNumber];
                this.typeOfBoon++;
                if (boonType == 'INVISIBLITY_BOON' && this.typeOfBoon % 5 == 0) {
                    flag = 'INVISIBLITY_BOON';
                    this.texture = new BABYLON.Texture("assets/scenes/alphabeti.png", this.scene);
                    this.boonMaterial.diffuseTexture = this.texture
                    this.createBoons('INVISIBLITY_BOON');
                }
                else if (boonType == 'LIFE_BOON' && this.typeOfBoon % 5 == 0) {
                    flag = 'LIFE_BOON';
                    this.texture = new BABYLON.Texture("assets/scenes/alphabetl.png", this.scene);
                    this.boonMaterial.diffuseTexture = this.texture
                    this.createBoons('LIFE_BOON');
                }
                else {
                    flag = 'NORMAL_BOON';
                    this.texture = new BABYLON.Texture("assets/scenes/alphabetn.png", this.scene);
                    this.boonMaterial.diffuseTexture = this.texture
                    this.createBoons('NORMAL_BOON');
                }
                this.message = new UI('displayMessage');
                if(!this.boonSet.has(flag)){
                    this.boonSet.add(flag);
                    let dummy = Message.Message;
                    this.message.displayMessage(dummy[flag].Info, "CATCH IT");
                }
            }
        }, 11000);
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
        let boonDiameter = GAME.isMobile() ? 0.35 : 0.7;
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
                    this.player.keepBoon(type);
                    clearInterval(trigger);
                }
                else if (this.player.groundMesh.intersectsMesh(boons, false)) {
                    boons.dispose();
                    // this.player.keepBoon(type);
                    clearInterval(trigger);
                }
                // if (boons.position.y < (playerMesh.position.y + 0.5)) {
                //     boons.dispose();
                //     clearInterval(trigger);
                // }
                if (GAME.isPaused()) {
                    boons.paused = true;
                    boonAnimation.pause();
                }
                if (!GAME.isPaused() && boons.paused) {
                    boonAnimation.restart();
                }
            } else {
                clearInterval(trigger);
            }
        }, 5);
        setTimeout(() => {
            boonAnimation.pause();
            boons.dispose();
        }, 15000);
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