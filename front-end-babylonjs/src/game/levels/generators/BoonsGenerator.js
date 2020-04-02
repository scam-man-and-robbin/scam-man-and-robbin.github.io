import UI from './../../../base/UI';
import Message from '../../../../public/message.json';
import stages from '../../../../public/stage.json';
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
        this.lastTwoBoons = [];
        // Special Boons
        this.boonTypes = [
            // 'normal_boon',
            'invisiblity_boon',
            'life_boon'
        ];
        this.activeBoons = [];

    }

    /**
     * Function to create Boon material.
     * Initial Dev - Simple Green Color Texture
     */
    createCommonMaterials() {
        this.boonMaterial = new BABYLON.StandardMaterial("boonMaterial", this.scene);
        this.boonMaterial.diffuseTexture = new BABYLON.Texture("assets/scenes/Refuse_v2.png", this.scene);
        this.boonMaterial.diffuseTexture.hasAlpha = true;
        this.boonMaterial.backFaceCulling = true;

        this.level.addMaterial(this.boonMaterial);
    }

    /**
     * Function to generate coins every n seconds
     * 10 seconds for now. May increase based on UX
     */
    generate() {

        // New boons keep generating every 10 second
        this.trigger = setInterval(() => {
            if (!GAME.isPaused() && this.player && this.player.lives && this.level.age < 65 && !this.level.freezeGeneration && this.scene) {
                
                // Append boons from previous stage and include current stage boons
                this.boonTypes = [];
                for (let index = 1; index <= this.level.nextStage; index++) {
                    var stage = this.level.nextStage - index;
                    if(stage || GAME.currentLevelName === 'TutorialLevel') {
                        var scamList = stages["stage_" + (this.level.nextStage - index)]["boons"]
                        scamList.forEach(element => {
                            if(this.boonTypes.indexOf(element) === -1) {
                                this.boonTypes.push(element);
                            }
                        });
                    }
                }


                let randomTileTypeNumber = Math.floor((Math.random() * this.boonTypes.length));
                let boonType = this.boonTypes[randomTileTypeNumber];

                // Ensure invisibility boon did not appear in last two boons
                while(this.lastTwoBoons.includes("invisiblity_boon") && boonType == 'invisiblity_boon') {
                    randomTileTypeNumber = Math.floor((Math.random() * this.boonTypes.length));
                    boonType = this.boonTypes[randomTileTypeNumber];
                }                
                if(this.lastTwoBoons.length === 2) {
                    this.lastTwoBoons.shift();
                }
                this.lastTwoBoons.push(boonType);

                if (GAME.currentLevelName === 'TutorialLevel' && !this.typeOfBoon) {
                    this.level.createTutorialText(6);
                }
                this.activeBoons.push(randomTileTypeNumber);
                this.typeOfBoon++;
                let message = Message.message;
                let location = message[boonType].path;


                this.texture = new BABYLON.Texture(location, this.scene);
                this.boonMaterial.diffuseTexture = this.texture
                this.boonMaterial.diffuseTexture.hasAlpha = true;
                this.createBoons(boonType, randomTileTypeNumber);
                if (!this.boonSet.has(boonType)) {
                    this.boonSet.add(boonType);
                }
            }
        }, GAME.currentLevelName === 'TutorialLevel' ? 4000 : 11000);
    }


    /**
     * 
     * @param {string} type - Type of Boon Object
     * Currently only one type of Boon Entity
     */
    createBoons(type, randomTileTypeNumber) {
        // To position boon objects on different lanes randomly Default to Middle Lane
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
        let boonDiameter = GAME.isMobile() ? 0.45 : 0.45;
        let boons = BABYLON.MeshBuilder.CreateBox("boon_" + randomPositionChooser, {
            width: boonDiameter,
            height: boonDiameter,
            depth: 0.001
        }, this.scene);
        boons.material = this.level.getMaterial('boonMaterial');
        boons.material.diffuseTexture.hasAlpha = true;
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
                            setTimeout(() => {
                                element.dispose();
                                this.removeActiveBoon(randomTileTypeNumber);
                                clearInterval(trigger);
                                this.player.shootAction.dispose();
                                clearInterval(this.player.shootTrigger);
                                this.player.beamEnabled = false;
                            }, 200);
                        }
                    }
                });
                if (playerMesh.intersectsMesh(boons, false)) {
                    boons.dispose();
                    this.player.keepBoon(type);
                    this.removeActiveBoon(randomTileTypeNumber);
                    clearInterval(trigger);
                }
                else if (this.player.groundMesh.intersectsMesh(boons, false)) {
                    boons.dispose();
                    this.removeActiveBoon(randomTileTypeNumber);
                    clearInterval(trigger);
                }
                if (!this.player.lives || this.level.age >= 65) {
                    boons.dispose();
                    this.removeActiveBoon(randomTileTypeNumber);
                    clearInterval(trigger);
                }
                if (GAME.isPaused()) {
                    boons.paused = true;
                    boonAnimation.pause();
                }
                if (!GAME.isPaused() && boons.paused) {
                    boonAnimation.restart();
                }
            } else {
                this.removeActiveBoon(randomTileTypeNumber);
                clearInterval(trigger);
            }
        }, 5);
        setTimeout(() => {
            var trigger = setInterval(() => {
                if(!GAME.isPaused) {
                    boonAnimation.pause();
                    boons.dispose();
                    this.removeActiveBoon(randomTileTypeNumber);
                    clearInterval(trigger);
                }
            }, 100);
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

    removeActiveBoon(randomTileTypeNumber) {
        var index = this.activeBoons.indexOf(randomTileTypeNumber);
        if (index !== -1) this.activeBoons.splice(index, 1);
    }

}