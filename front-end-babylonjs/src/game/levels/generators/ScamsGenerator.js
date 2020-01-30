export default class ScamsGenerator {

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.createCommonMaterials();
        this.scamTypes = [
            'NORMAL_SCAM',
            'ZIG_ZAG',
            // 'SPLITTER'
        ];

    }

    createCommonMaterials() {

        let scamMaterial = new BABYLON.StandardMaterial('scamMaterial', this.scene);
        scamMaterial.diffuseColor = new BABYLON.Color3.Red();
        scamMaterial.emissiveColor = new BABYLON.Color3.Red();
        scamMaterial.specularColor = new BABYLON.Color3.Red();

        // Freeze materials to improve performance (this material will not be modified)
        scamMaterial.freeze();

        this.level.addMaterial(scamMaterial);

    }

    generate() {

        // New scams keep generating every 4 second
        setInterval(() => {
            if (!GAME.isPaused()) {
                var scamType = 'NORMAL_SCAM';
                let randomTileTypeNumber = Math.floor((Math.random() * this.scamTypes.length));
                scamType = this.scamTypes[randomTileTypeNumber];
                if (scamType == 'NORMAL_SCAM') {
                    this.createScams('NORMAL_SCAM');
                } else if (scamType == 'ZIG_ZAG') {
                    this.createScams('ZIG_ZAG');
                }
            }
        }, 4000);
    }



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
        let scamDiameter = GAME.isMobile() ? 0.2 : 0.4;
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
        } else {
            scams.animations.push(this.createScamAnimation());
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
                    console.log("kill")
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

    createScamAnimation() {
        let scamAnimation = new BABYLON.Animation("scamfall", "position.y", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        keys.push({ frame: 0, value: 3 });
        keys.push({ frame: 15, value: 1.5 });
        keys.push({ frame: 30, value: 0 });
        keys.push({ frame: 45, value: -1.5 });
        keys.push({ frame: 60, value: -3 });
        keys.push({ frame: 85, value: -4.5 });

        scamAnimation.setKeys(keys);

        return scamAnimation;
    }

    createZigZagScamAnimation(scams) {
        let scamAnimation = new BABYLON.Animation("scamfall", "position", this.level.getGameSpeed() - 5, BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        let position = scams.position;
        let shift = false;
        let incrementBy = 1;
        for (let index = 0; index < 8; index++) {
            keys.push({ frame: index*15, value: position });
            // Shift Right
            if(position.x == (GAME.isMobile() ? 1 : 2.5)) {
                shift = true;
                incrementBy = -1;
            }else if(position.x == -(GAME.isMobile() ? 1 : 2.5)){
                shift = true;
                incrementBy = 1;
            }else{
                shift = false
            } 
            if(shift){
                position = position.add(new BABYLON.Vector3(((GAME.isMobile() ? 1 : 2.5))*(incrementBy), -1, 0));
            }else{
                position = position.add(new BABYLON.Vector3(((GAME.isMobile() ? 1 : 2.5))*(incrementBy), -1, 0));
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