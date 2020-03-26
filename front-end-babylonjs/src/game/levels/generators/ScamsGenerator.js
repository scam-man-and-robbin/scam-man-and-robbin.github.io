import UI from './../../../base/UI';
import Message from '../../../../public/message.json';
import stages from '../../../../public/stage.json';

export default class ScamsGenerator {

    /**
    * Class description
    *
    * To handle Scam Object Related Actions. 
    */

    constructor(level) {

        this.decision = true;
        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.foreground = level.foreground;
        this.createCommonMaterials();
        this.scamSet = new Set();
        this.scamTypes = [];
        this.activeScams = [];

    }

    /**
     * Function to create a material for scam with diffusion of red color 
     */

    createCommonMaterials() {

        let scamMaterial = new BABYLON.StandardMaterial("scamMaterial", this.scene);
        scamMaterial.diffuseTexture = new BABYLON.Texture("assets/scenes/Cold_call.png", this.scene);
        scamMaterial.diffuseTexture.hasAlpha = true;
        scamMaterial.backFaceCulling = true;

        this.level.addMaterial(scamMaterial);

    }

    /**
     * Function to randomly generate scam object with it's behaviour 
     */
    generate() {

        // New scams keep generating every 4 second
        setInterval(() => {
            if (!GAME.isPaused() && this.player.lives && this.level.age < 65 && !this.level.freezeGeneration && this.scene) {
                this.scamTypes = [];
                for (let index = 1; index <= this.level.nextStage; index++) {
                    var scamList = stages["stage_" + (this.level.nextStage - index)]["scams"]
                    scamList.forEach(element => {
                        if(this.scamTypes.indexOf(element) === -1) {
                            this.scamTypes.push(element);
                        }
                    });
                }
                let randomTileTypeNumber = Math.floor((Math.random() * this.scamTypes.length));
                let scamType = this.scamTypes[randomTileTypeNumber];
                this.player.activeScam = scamType;
                if (GAME.currentLevelName === 'TutorialLevel' && !this.scamSet.size) {
                    this.level.createTutorialText(2);
                }
                this.activeScams.push(randomTileTypeNumber);
                if (scamType == 'splitter') {
                    this.createSplitterScams(randomTileTypeNumber);
                } else {
                    this.createScams(scamType, randomTileTypeNumber);
                }
                if (!this.scamSet.has(scamType)) {
                    this.scamSet.add(scamType);
                }
            }
        }, 4000);
    }

    /**
     * Function to create the scam object.
     * @param {string} type - Flag to decide the behaviour of the scam.
     */
    createScams(type, randomTileTypeNumber) {

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
        let scamDiameter = GAME.isMobile() ? 0.35 : 0.4;
        // let scams = BABYLON.Mesh.CreateCylinder("scam_"+randomPositionChooser, 0.1, scamDiameter, scamDiameter, 16, 0, this.scene);
        let scams = BABYLON.MeshBuilder.CreateBox("scam_" + randomPositionChooser, {
            width: scamDiameter,
            height: scamDiameter,
            depth: 0.001
        }, this.scene);

        let message = Message.message;
        let location = message[type].path;

        scams.material = this.level.getMaterial('scamMaterial').clone('scam_material' + randomPositionChooser);
        scams.material.diffuseTexture = new BABYLON.Texture(location, this.scene);
        scams.material.diffuseTexture.hasAlpha = true;
        scams.position.x = positionX;
        scams.position.y = 3;
        scams.position.z = 0;

        if (type == 'zig_zag') {
            scams.animations.push(this.createZigZagScamAnimation(scams));
        } else if (type == 'normal_scam') {
            scams.animations.push(this.createScamAnimation());
        }
        else if (type == 'speedy') {
            scams.animations.push(this.createSpeedyScamAnimation());
        }
        else if (type == 'accelerator') {
            scams.animations.push(this.createAcceleratorScamAnimation());
        }
        else if (type == 'black_out') {
            scams.animations.push(this.createBlackoutAnimation());
        }
        else if (type == 'diagonal') {
            scams.animations.push(this.createDiagonalScamAnimation(scams));
        }
        let scamAnimation = this.scene.beginAnimation(scams, 0, 2000, false);
        var trigger = setInterval(() => {
            let playerMesh = this.player.getMesh();
            if (scams) {
                let scamMesh = [];
                this.scene.meshes.forEach(element => {
                    if (element['name'].includes("bullet") && !scamMesh.includes(element['name'])) {
                        scamMesh.push(element['name']);
                        if (element.intersectsMesh(scams, false)) {
                            // this.slicer(element)
                            // element.material.emissiveColor = new BABYLON.Color3.FromHexString('#ff0000')
                            scams.dispose();
                            this.foreground.layerMask = 0;
                            clearInterval(this.blackOutTrigger);
                            setTimeout(() => {
                                element.dispose();
                                this.removeActiveScam(randomTileTypeNumber);
                                clearInterval(trigger);
                                this.player.shootAction.dispose();
                                clearInterval(this.player.shootTrigger);
                                this.player.beamEnabled = false;
                            }, 200);
                            this.player.keepScam(randomPositionChooser);
                        }
                    }
                });
                if (this.player.groundMesh.intersectsMesh(scams, false)) {
                    this.foreground.layerMask = 0;
                    this.player.checkLife();
                    scams.dispose();
                    this.removeActiveScam(randomTileTypeNumber);
                    clearInterval(trigger);
                }
                else if (this.player.mesh.intersectsMesh(scams, false)) {
                    this.foreground.layerMask = 0;
                    this.player.checkLife();
                    scams.dispose();
                    this.removeActiveScam(randomTileTypeNumber);
                    clearInterval(trigger);
                }
                if (!this.player.lives || this.level.age >= 65) {
                    scams.dispose();
                    this.removeActiveScam(randomTileTypeNumber);
                    clearInterval(trigger);
                }
                if (GAME.isPaused()) {
                    scams.paused = true;
                    scamAnimation.pause();
                }
                if (!GAME.isPaused() && scams.paused) {
                    scamAnimation.restart();
                }
            } else {
                this.removeActiveScam(randomTileTypeNumber);
                clearInterval(trigger);
            }
        }, 5);
        setTimeout(() => {
            scamAnimation.pause();
            scams.dispose();
            this.removeActiveScam(randomTileTypeNumber);
        }, 10000);
    }

    /**
     * Function for scam objects to fall in normal speed 
     */
    createScamAnimation() {
        let scamAnimation = new BABYLON.Animation("scamfall", "position.y", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        let position = 3;
        for (let index = 0; index < 6; index++) {
            keys.push({ frame: index * 15, value: position });
            position = position - 1.5;
        }

        scamAnimation.setKeys(keys);

        return scamAnimation;
    }

    /**
     * Function for scam objects to fall in zigzag
     * @param {object} scams - To perform the behaviour of the scam.
     */
    createZigZagScamAnimation(scams) {
        let scamAnimation = new BABYLON.Animation("scamfall", "position", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        let position = scams.position;
        let shift = false;
        let incrementBy = 1;
        for (let index = 0; index < 8; index++) {
            keys.push({ frame: index * 15, value: position });
            // Shift Right
            if (position.x == (GAME.isMobile() ? 1 : 1.5)) {
                shift = true;
                incrementBy = -1;
            } else if (position.x == -(GAME.isMobile() ? 1 : 1.5)) {
                shift = true;
                incrementBy = 1;
            } else {
                shift = false
            }
            if (shift) {
                position = position.add(new BABYLON.Vector3(((GAME.isMobile() ? 1 : 1.5)) * (incrementBy), -1, 0));
            } else {
                position = position.add(new BABYLON.Vector3(((GAME.isMobile() ? 1 : 1.5)) * (incrementBy), -1, 0));
            }
        }

        scamAnimation.setKeys(keys);
        var easingFunction = new BABYLON.CircleEase();

        // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

        // Adding easing function to my animation
        scamAnimation.setEasingFunction(easingFunction);

        return scamAnimation;
    }

    /**
     * Function for scam objects to fall in speedy manner 
     */
    createSpeedyScamAnimation() {
        let scamAnimation = new BABYLON.Animation("scamfall", "position.y", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        keys.push({ frame: 0, value: 3 });
        keys.push({ frame: 30, value: -3 });
        scamAnimation.setKeys(keys);
        return scamAnimation;
    }

    /**
     * Function for scam objects to fall in accelerator manner 
     */
    createAcceleratorScamAnimation() {
        let scamAnimation = new BABYLON.Animation("scamfall", "position.y", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        keys.push({ frame: 0, value: 3 });
        keys.push({ frame: 15, value: 1.5 });
        keys.push({ frame: 30, value: -3 });
        scamAnimation.setKeys(keys);
        return scamAnimation;
    }

    /**
     * Function to perform screen blackout 
     */
    createBlackoutAnimation() {
        var imgPath = 'distort1.png';
        this.foreground.dispose();
        this.blackOutTrigger = setInterval(() => {
            this.foreground.layerMask = 0;
            if (!GAME.isPaused() && this.player.lives && this.level.age < 65) {
                this.foreground = new BABYLON.Layer("front", "/assets/scenes/" + imgPath, this.scene);
                this.foreground.isBackground = false;
                this.foreground.layerMask = 1;
                if (imgPath == 'distort1.png') {
                    imgPath = 'distort2.png';
                } else {
                    imgPath = 'distort1.png';
                }
            }
        }, 500);

        return this.createScamAnimation();
    }

    /**
     * Function for scam objects to fall in Diagonal
     * @param {object} scams - To perform the behaviour of the scam.
     */
    createDiagonalScamAnimation(scams) {
        let scamAnimation = new BABYLON.Animation("scamfall", "position", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        let position = scams.position;
        for (let index = 0; index < 5; index++) {
            keys.push({ frame: index * 15, value: position });
            if (index == 1 && position.x != 0) {        // keys[index].frame
                if (position.x == (GAME.isMobile() ? 1 : 1.5)) {
                    // Move Left        
                    position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 1.5) * (-2), -1.5, 0));
                } else {
                    // Move Right
                    position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 1.5) * (2), -1.5, 0));
                }
            }
            //Move Down
            else if (index != 4 || position.x == 0) {
                position = position.add(new BABYLON.Vector3(0, -1.5, 0));
            }
        }
        scamAnimation.setKeys(keys);
        var easingFunction = new BABYLON.CircleEase();

        // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

        // Adding easing function to my animation
        scamAnimation.setEasingFunction(easingFunction);
        return scamAnimation;
    }

    createSplitterScams(randomTileTypeNumber) {

        let scams = [];
        var trigger = [];
        for (let index = 0; index < 2; index++) {
            let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number
            let scamDiameter = GAME.isMobile() ? 0.35 : 0.4;
            scams[index] = BABYLON.MeshBuilder.CreateBox("scam_" + randomPositionChooser, {
                width: scamDiameter,
                height: scamDiameter,
                depth: 0.001
            }, this.scene);

            let message = Message.message;
            let location = message["splitter"].path;

            scams[index].material = this.level.getMaterial('scamMaterial').clone('scam_material' + randomPositionChooser);
            scams[index].material.diffuseTexture = new BABYLON.Texture(location, this.scene);
            scams[index].material.diffuseTexture.hasAlpha = true;
            scams[index].position.x = 0;
            scams[index].position.y = 3;
            scams[index].position.z = 0;
            scams[index].animations.push(this.createSplitterAnimation(scams[index], index == 1 ? 'right' : 'left', index));
            let scamAnimation = this.scene.beginAnimation(scams[index], 0, 2000, false);
            trigger[index] = setInterval(() => {
                let playerMesh = this.player.getMesh();
                if (scams[index]) {
                    let scamMesh = [];
                    this.scene.meshes.forEach(element => {
                        if (element['name'].includes("bullet") && !scamMesh.includes(element['name'])) {
                            scamMesh.push(element['name']);
                            if (element.intersectsMesh(scams[index], false)) {
                                // this.slicer(element)
                                // element.material.emissiveColor = new BABYLON.Color3.FromHexString('#ff0000')
                                scams[index].dispose();
                                this.foreground.layerMask = 0;
                                clearInterval(this.blackOutTrigger);
                                setTimeout(() => {
                                    element.dispose();
                                    this.removeActiveScam(randomTileTypeNumber);
                                    clearInterval(trigger[index]);
                                    this.player.shootAction.dispose();
                                    clearInterval(this.player.shootTrigger);
                                    this.player.beamEnabled = false;
                                }, 200);
                                this.player.keepScam(randomPositionChooser);
                            }
                        }
                    });
                    if (this.player.groundMesh.intersectsMesh(scams[index], false)) {
                        this.foreground.layerMask = 0;
                        this.player.checkLife();
                        scams[index].dispose();
                        this.removeActiveScam(randomTileTypeNumber);
                        clearInterval(trigger[index]);
                    }
                    else if (this.player.mesh.intersectsMesh(scams[index], false)) {
                        this.foreground.layerMask = 0;
                        this.player.checkLife();
                        scams[index].dispose();
                        this.removeActiveScam(randomTileTypeNumber);
                        clearInterval(trigger[index]);
                    }
                    if (!this.player.lives || this.level.age >= 65) {
                        scams[index].dispose();
                        this.removeActiveScam(randomTileTypeNumber);
                        clearInterval(trigger[index]);
                    }
                    if (GAME.isPaused()) {
                        scams[index].paused = true;
                        scamAnimation.pause();
                    }
                    if (!GAME.isPaused() && scams[index].paused) {
                        scamAnimation.restart();
                    }
                } else {
                    this.removeActiveScam(randomTileTypeNumber);
                    clearInterval(trigger[index]);
                }
            }, 5);
            setTimeout(() => {
                scamAnimation.pause();
                scams[index].dispose();                
                this.removeActiveScam(randomTileTypeNumber);
            }, 8000);
        }
    }


    createSplitterAnimation(scams, direction) {
        let scamAnimation = new BABYLON.Animation("scamfall", "position", this.level.getGameSpeed() - 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];
        let position = scams.position;
        for (let index = 0; index < 7; index++) {
            keys.push({ frame: index * 15, value: position });
            if (index == 1 && direction == 'right') {
                position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 1.5), -1.5, 0));
                this.decision = !this.decision;
            } else if (index == 1) {
                position = position.add(new BABYLON.Vector3((GAME.isMobile() ? -1 : -1.5), -1.5, 0));
            } else if (index == 0) {
                position = position.add(new BABYLON.Vector3(0, -0.8, 0));
            } else {
                if (this.decision) {
                    position = position.add(new BABYLON.Vector3(0, -1, 0));
                } else {
                    position = position.add(new BABYLON.Vector3(0, -1.5, 0));
                }
            }
        }
        scamAnimation.setKeys(keys);
        var easingFunction = new BABYLON.CircleEase();

        // For each easing function, you can choose beetween EASEIN (default), EASEOUT, EASEINOUT
        easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEIN);

        // Adding easing function to my animation
        scamAnimation.setEasingFunction(easingFunction);

        return scamAnimation;
    }

    removeActiveScam(randomTileTypeNumber) {
        var index = this.activeScams.indexOf(randomTileTypeNumber);
        if (index !== -1) this.activeScams.splice(index, 1);
    }


}