export default class ScamsGenerator {

    /**
    * Class description
    *
    * To handle Scam Object Related Actions. 
    */

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.foreground = level.foreground;
        this.createCommonMaterials();
        this.scamTypes = [
            'NORMAL_SCAM',
            'BLACK_OUT',
            'ACCELERATOR',
            'ZIG_ZAG',
            'SPEEDY',
            'DIAGONAL',
            'SPLITTER'
        ];

    }

    /**
     * Function to create a material for scam with diffusion of red color 
     */

    createCommonMaterials() {

        let scamMaterial = new BABYLON.StandardMaterial('scamMaterial', this.scene);
        scamMaterial.diffuseColor = new BABYLON.Color3.Red();
        scamMaterial.emissiveColor = new BABYLON.Color3.Red();
        scamMaterial.specularColor = new BABYLON.Color3.Red();

        // Freeze materials to improve performance (this material will not be modified)
        scamMaterial.freeze();

        this.level.addMaterial(scamMaterial);

    }

    /**
     * Function to randomly generate scam object with it's behaviour 
     */
    generate() {

        // New scams keep generating every 4 second
        setInterval(() => {
            if (!GAME.isPaused() && this.player.lives) {
                var scamType = 'NORMAL_SCAM';

                // To change difficulty as scam point increased
                var scamTypesLength = 1;
                if (this.player.scamCount > 5) {
                    scamTypesLength = 2;
                }

                if (this.player.scamCount > 10) {
                    scamTypesLength = 4;
                }

                if (this.player.scamCount > 15) {
                    scamTypesLength = this.scamTypes.length;
                }

                let randomTileTypeNumber = Math.floor((Math.random() * scamTypesLength));
                scamType = this.scamTypes[randomTileTypeNumber];
                if (scamType == 'SPLITTER') {
                    this.createSplitterScams();
                } else {
                    this.createScams(scamType);
                }
            }
        }, 4000);
    }

    /**
     * Function to create the scam object.
     * @param {string} type - Flag to decide the behaviour of the scam.
     */
    createScams(type) {

        // To position scam objects on different lanes randomly Default to Middle Lane
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
        let scamDiameter = GAME.isMobile() ? 0.35 : 0.7;
        // let scams = BABYLON.Mesh.CreateCylinder("scam_"+randomPositionChooser, 0.1, scamDiameter, scamDiameter, 16, 0, this.scene);
        let scams = BABYLON.MeshBuilder.CreateBox("scam_" + randomPositionChooser, {
            width: scamDiameter,
            height: scamDiameter,
            depth: 0.01
        }, this.scene);

        scams.material = this.level.getMaterial('scamMaterial');
        scams.position.x = positionX;
        scams.position.y = 3;
        scams.position.z = 0;

        if (type == 'ZIG_ZAG') {
            scams.animations.push(this.createZigZagScamAnimation(scams));
        } else if (type == 'NORMAL_SCAM') {
            scams.animations.push(this.createScamAnimation());
        }
        else if (type == 'SPEEDY') {
            scams.animations.push(this.createSpeedyScamAnimation());
        }
        else if (type == 'ACCELERATOR') {
            scams.animations.push(this.createAcceleratorScamAnimation());
        }
        else if (type == 'BLACK_OUT') {
            scams.animations.push(this.createBlackoutAnimation());
        }
        else if (type == 'DIAGONAL') {
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
                            element.visibility = false;
                            this.player.keepScam();
                            clearInterval(trigger);
                        }
                    }
                });
                if (scams.position.y < (playerMesh.position.y + 0.5)) {
                    this.player.checkLife();
                    scams.dispose();
                    clearInterval(trigger);
                }
            } else {
                clearInterval(trigger);
            }
        }, 5);
        setTimeout(() => {
            scamAnimation.pause();
            scams.dispose();
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
            if (position.x == (GAME.isMobile() ? 1 : 2.5)) {
                shift = true;
                incrementBy = -1;
            } else if (position.x == -(GAME.isMobile() ? 1 : 2.5)) {
                shift = true;
                incrementBy = 1;
            } else {
                shift = false
            }
            if (shift) {
                position = position.add(new BABYLON.Vector3(((GAME.isMobile() ? 1 : 2.5)) * (incrementBy), -1, 0));
            } else {
                position = position.add(new BABYLON.Vector3(((GAME.isMobile() ? 1 : 2.5)) * (incrementBy), -1, 0));
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
        // var background = new BABYLON.Layer("front", "/assets/scenes/white_bg_opaque.png", this.scene);
        // background.isBackground = false;
        this.foreground.layerMask = 1;
        setTimeout(() => {
            this.foreground.layerMask = 0;
        }, 1500);
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
                if (position.x == (GAME.isMobile() ? 1 : 2.5)) {
                    // Move Left        
                    position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 2.5) * (-2), -2, 0));
                } else {
                    // Move Right
                    position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 2.5) * (2), -2, 0));
                }
            }
            //Move Down
            else if (index != 4 || position.x == 0) {
                position = position.add(new BABYLON.Vector3(0, -2, 0));
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

    createSplitterScams() {
        
        let scams = [];
        var trigger = [];
        for (let index = 0; index < 2; index++) {
            let randomPositionChooser = Math.floor((Math.random() * 100)); // 0 to 100 random number
            let scamDiameter = GAME.isMobile() ? 0.35 : 0.7;
            scams[index] = BABYLON.MeshBuilder.CreateBox("scam_" + randomPositionChooser, {
                width: scamDiameter,
                height: scamDiameter,
                depth: 0.01
            }, this.scene);

            scams[index].material = this.level.getMaterial('scamMaterial');
            scams[index].position.x = 0;
            scams[index].position.y = 3;
            scams[index].position.z = 0;

            scams[index].animations.push(this.createSplitterAnimation(scams[index], index == 1 ? 'right' : 'left'));
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
                                element.visibility = false;
                                this.player.keepScam();
                                clearInterval(trigger[index]);
                            }
                        }
                    });
                    if (scams[index].position.y < (playerMesh.position.y + 0.5)) {
                        this.player.checkLife();
                        scams[index].dispose();
                        clearInterval(trigger[index]);
                    }
                } else {
                    clearInterval(trigger[index]);
                }
            }, 5);
            setTimeout(() => {
                scamAnimation.pause();
                scams[index].dispose();
            }, 10000);
        }
    }


    createSplitterAnimation(scams, direction) {
        let scamAnimation = new BABYLON.Animation("scamfall", "position", this.level.getGameSpeed() - 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        let position = scams.position;
        for (let index = 0; index < 6; index++) {
            keys.push({ frame: index * 15, value: position });
            if (index == 1 && direction == 'right') {
                position = position.add(new BABYLON.Vector3((GAME.isMobile() ? 1 : 2.5), -1.5, 0));
            } else if (index == 1) {
                position = position.add(new BABYLON.Vector3((GAME.isMobile() ? -1 : -2.5), -1.5, 0));
            } else {
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


}