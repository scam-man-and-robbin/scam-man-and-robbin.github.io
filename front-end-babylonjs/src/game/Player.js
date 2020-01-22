import UI from '../base/UI';

export default class Player {

    constructor(level) {

        this.level = level;
        this.scene = level.scene;

        this.statuses = {
            'RUNNING': true,
            'JUMPING': false,
            'DRAGGING': false,
            'FALLING_DOWN': false,
            'SLOW': false,
            'DEAD': false
        };

        /**
         * HUD Controls
         */
        this.coinsTextControl = null;
        this.metersTextControl = null;
        this.livesTextControl = null;

        /**
         * SOUNDS
         */
        this.dieSound = null;
        this.jumpSound = null;
        this.damageSound = null;
        this.gotCoinSound = null;

        /**
         * Set it to true to make the player indestructible for tests
         */
        this.godMode = false;

        this.defaultSpeed = GAME.options.player.defaultSpeed;
        this.speed = this.defaultSpeed;

        this.gravity = GAME.options.player.gravity;

        /**
         * Stores the player last altitude to check if the player is falling down
         */
        this.jumpForce = GAME.options.player.jumpForce;
        this.jumpMaxAltitude = GAME.options.player.jumpMaxAltitude;

        // Stores the last player altitude from every frame
        this.defaultAltitude = 0.25;
        this.lastAltitude = this.defaultAltitude;

        this.coins = 0;
        this.points = 0;
        this.pointsRecord = false;

        // How many times the user was damaged at time
        this.damages = 0;

        this.onDie = null;
        this.changePosition = true;
        this.nextBullet = true;
        this.lives = GAME.options.player.lives;
        /**
         * Used to store the travelled distance and calculate where to generate more level tiles
         * and to give points to the player
         * The travelledDistance will reset each 100 "meters". When travelledDistance is equal to 70
         * the Level will generate more tiles
         */
        this.travelledDistance = 0;
        this.totalTravelledDistance = 0;

        this.setupPlayer();

    }

    setupPlayer() {

        this.dieSound = this.level.assets.getSound('playerDieSound');
        this.gotCoinSound = this.level.assets.getSound('gotCoinSound');
        this.damageSound = this.level.assets.getSound('damageSound');

        // Shadows
        var light = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0, -0.5, -1.0), this.scene);
        var shadowGenerator = new BABYLON.ShadowGenerator(524, light);
        shadowGenerator.useBlurExponentialShadowMap = true;

        var scene = this.scene;
        // Dude
        BABYLON.SceneLoader.ImportMesh("him", "assets/scenes/", "Dude.babylon", scene, function (newMeshes2, particleSystems2, skeletons2) {
            var scamMan = newMeshes2[0];
            scamMan.rotation.x = -0.5;
            scamMan.rotation.y = 3.2;
            scamMan.position = new BABYLON.Vector3(0, -12, 10);
            scamMan.scaling = new BABYLON.Vector3(0.05, 0.05, 0.05);
            var texture = new BABYLON.Texture("/assets/scenes/scam-man-onduty.png", scene);
            scamMan.diffuseTexture = texture;
            scene.beginAnimation(skeletons2[0], 0, 100, true, 1.0);
            return scene;
        }, function (scene) {
            // Called during inprogress
            console.log("InProgress")
        }, function (scene, message, exception) {
            // Called when Error Occurs
            console.log("onError");
        });

        this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
            width: 0.3333333,
            height: 0.5,
            depth: 0.3333333
        }, this.scene);
        var setMesh = false;
        this.mesh.position.y = this.defaultAltitude;

        // To set mesh2 for player
        setInterval(() => {
            if (!setMesh) {
                this.scene.meshes.forEach(element => {
                    if (element['name'] == 'him') {
                        this.mesh.visibility = false;
                        setMesh = true;
                        this.mesh2 = element;
                    }
                });
            }
        }, 500);


        // let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        // playerMaterial.diffuseColor = new BABYLON.Color3.FromHexString(GAME.options.playerColor);

        // this.mesh.material = playerMaterial;

        // Adds the collision ellipsoid fitting it on the Player "Box" mesh
        this.mesh.setEllipsoidPerBoundingBox();
        this.setupAnimations();
        this.createHUD();

    }

    setupAnimations() {
        let blinkAnimation = new BABYLON.Animation("blinkAnimation", "material.alpha", 120, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];

        //At the animation key 0, the value of alpha is "1"
        keys.push({ frame: 0, value: 1 });

        //At the animation key 15, the value of alpha is "0.2"
        keys.push({ frame: 15, value: 0.2 });

        //At the animation key 30, the value of alpha is "1"
        keys.push({ frame: 30, value: 1 });

        blinkAnimation.setKeys(keys);

        this.mesh.animations = [];
        this.mesh.animations.push(blinkAnimation);
        if (this.mesh2) {
            this.mesh2.animations = [];
            this.mesh2.animations.push(blinkAnimation);
        }
    }

    createHUD() {
        this.hud = new UI('playerHudUI');

        this.metersTextControl = this.hud.addText('Age: 0', {
            'top': '10px',
            'left': '10px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });

        this.coinsTextControl = this.hud.addText('Pension Pot: $0', {
            'top': '10px',
            'left': '-10px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
        this.livesTextControl = this.hud.addText('Lives: ' + this.lives, {
            'top': '35px',
            'left': '-10px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
    }

    getMesh() {
        return this.mesh;
    }

    getMesh2() {
        if (this.mesh2) {
            return this.mesh2;
        } else {
            return this.mesh;
        }
    }

    damage() {

        this.damages++;

        this.damageSound.play();
        this.blink();
        this.speed = this.defaultSpeed / 2;

        this.statuses.SLOW = true;

        setTimeout(() => {
            this.statuses.SLOW = false;
            this.speed = this.defaultSpeed;
        }, 1500);

    }

    blink() {
        let blinkAnimation = this.scene.beginAnimation(this.mesh, 0, 30, true);

        setTimeout(() => {
            blinkAnimation.pause();
            this.mesh.material.alpha = 1;
            this.mesh2.material.alpha = 1;
        }, 1500);
    }

    move() {

        if (this.statuses.DEAD) return;

        let animationRatio = (this.scene.getAnimationRatio() / 50),
            gravity = 0,
            jump = (this.statuses.JUMPING && !this.statuses.FALLING_DOWN) ? this.jumpForce * animationRatio : 0,
            runSpeed = this.speed * animationRatio;

        // If is jumping, multiply the speed by 1.5
        runSpeed *= (this.statuses.JUMPING) ? 1.5 : 1;

        this.mesh.moveWithCollisions(new BABYLON.Vector3(
            0,
            gravity + jump,
            runSpeed
        ));
        if (this.mesh2) {
            this.mesh2.moveWithCollisions(new BABYLON.Vector3(
                0,
                (gravity + jump) - 12,
                runSpeed
            ));
        }


        this.checkPlayerLateralMovement(animationRatio);
        this.calculateTravelledDistance(animationRatio);

        this.checkPlayerAltitude();
        this.checkPlayerDragging();
        this.shoot();

        if (this.mesh.position.y <= -2 && !this.statuses.DEAD) {
            this.die();
        }
        // if(this.mesh2 && this.mesh2.position.y <= -2 && !this.statuses.DEAD) {
        //     this.die();
        // }

    }

    calculateTravelledDistance(animationRatio) {
        if (this.travelledDistance >= 100) {
            this.travelledDistance = 0;
        }

        this.travelledDistance += this.speed * animationRatio / 100;
        this.totalTravelledDistance += this.speed * animationRatio;

        this.metersTextControl.text = 'Age: ' + Math.floor(this.totalTravelledDistance);
    }

    checkPlayerAltitude() {

        if (this.mesh.position.y < this.lastAltitude) {
            this.statuses.FALLING_DOWN = true;
        } else {
            this.statuses.FALLING_DOWN = false;
        }

        this.lastAltitude = this.mesh.position.y;

    }

    checkPlayerLateralMovement(animationRatio) {
        if (GAME.keys.left && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
            this.mesh.position.x -= (this.speed / 5) * animationRatio;
            if (this.changePosition) {
                this.changePosition = false;
                this.mesh2.position.x = this.mesh2.position.x <= -6 ? -6 : this.mesh2.position.x - 6;
                setTimeout(() => {
                    this.changePosition = true;
                }, 200);

            }
        }

        if (GAME.keys.right && !this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
            this.mesh.position.x += (this.speed / 5) * animationRatio;
            if (this.changePosition) {
                this.changePosition = false;
                this.mesh2.position.x = this.mesh2.position.x >= 6 ? 6 : this.mesh2.position.x + 6;
                setTimeout(() => {
                    this.changePosition = true;
                }, 200);
            }
        }
    }

    checkPlayerDragging() {

        if (GAME.keys.down) {

            if (!this.statuses.DRAGGING) {
                this.statuses.DRAGGING = true;
                this.speed = this.defaultSpeed * 1.5;

                // Smoothly interpolate the Player height to a half and then, readjust
                // the collision ellipsoid
                this.level.interpolate(this.mesh.scaling, 'y', 0.5, 100, () => {
                    // Manually reseting the collision ellipsoid height (mesh height/4)
                    this.mesh.ellipsoid.y = 0.125;
                });

                setTimeout(() => {
                    this.statuses.DRAGGING = false;

                    // Manually reseting the collision ellipsoid height (future mesh height/4)
                    // We need to make it before interpolation to avoid collision problems during 
                    // the interpolation proccess
                    this.mesh.ellipsoid.y = 0.25;

                    // Return the player to the normal height
                    this.level.interpolate(this.mesh.scaling, 'y', 1, 100);
                }, 700);
            }

        } else {

            if (!this.statuses.DRAGGING) {
                if (!this.statuses.JUMPING && !this.statuses.FALLING_DOWN) {
                    this.mesh.position.y = this.defaultAltitude;
                    if (this.mesh2) {
                        this.mesh2.position.y = this.defaultAltitude - 12;
                    }
                }

                if (!this.statuses.SLOW) {
                    this.speed = this.defaultSpeed;
                }
            }

        }

    }

    getTravelledDistance() {
        return this.travelledDistance;
    }

    keepCoin() {
        this.coins++;
        this.coinsTextControl.text = 'Pension Pot: $' + this.coins;
        this.gotCoinSound.play();
    }

    shoot() {
        if (this.mesh2) {
            const currentTime = new Date().getTime();
            let nextBulletTime = new Date().getTime();
            if (GAME.keys.shoot && this.nextBullet) {
                this.nextBullet = false;
                var forward = new BABYLON.Vector3(0, 0.2, 0);
                var direction = this.mesh2.getDirection(forward);
                direction.normalize();

                const bullet = BABYLON.Mesh.CreateSphere(`${currentTime}bullet`, 16, 1, this.scene);
                nextBulletTime = new Date().getTime() + 200;
                bullet.position = this.mesh2.getAbsolutePosition().clone();

                if (this.scene && this.scene.actionManager) {
                    const bulletAction = this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt) {
                        bullet.position.addInPlace(direction);
                    }));
                    setTimeout(() => {
                        this.scene.actionManager.unregisterAction(bulletAction);
                        bullet.dispose();
                        this.nextBullet = true;
                    }, 500)
                    setInterval(() => {
                        this.scene.meshes.forEach(element => {
                            if (element['name'].includes("scam_fall_")) {
                                if (bullet.intersectsMesh(element, true)) {
                                    this.keepCoin();
                                    this.slicer(element)
                                    // element.material.emissiveColor = new BABYLON.Color3.FromHexString('#ff0000')
                                    // element.dispose();
                                }
                            }
                        });
                    }, 10);
                } else {
                    this.scene.actionManager = new BABYLON.ActionManager(this.scene);
                    const bulletAction = this.scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt) {
                        bullet.position.addInPlace(direction);
                    }));
                    setTimeout(() => {
                        this.scene.actionManager.unregisterAction(bulletAction);
                        bullet.dispose();
                        this.nextBullet = true;
                    }, 500)
                    // bullet.dispose();
                }

            }
        }
    }

    reset() {

        this.statuses.DEAD = false;
        this.statuses.JUMPING = false;
        this.statuses.FALLING_DOWN = false;
        this.statuses.DRAGGING = false;

        this.coins = 0;
        this.damages = 0;
        this.mesh.position.x = 0;
        this.mesh.position.y = this.defaultAltitude;
        this.mesh.position.z = 0;
        this.mesh2.position.x = 0;
        this.mesh2.position.y = this.defaultAltitude - 12;
        this.mesh2.position.z = 0;
        this.travelledDistance = 0;
        this.totalTravelledDistance = 0;
        this.lives = GAME.options.player.lives;

    }

    die() {

        if (this.godMode) return;

        if (this.lives <= 1) {
            this.lives--;
            this.livesTextControl.text = 'Lives: ' + this.lives;
            this.statuses.DEAD = true;
            this.dieSound.play();

            if (this.onDie) {
                this.onDie();
            }
        } else {
            this.lives--;
            this.livesTextControl.text = 'Lives: ' + this.lives;
        }

    }

    getPoints() {
        return this.points;
    }

    calculatePoints() {
        this.points = 0;

        this.points += (this.coins * 10);
        this.points += this.totalTravelledDistance;
        this.points -= (this.damages * 5);

        this.points = (this.points > 0) ? this.points.toFixed(0) : 0;

        this.checkAndSaveRecord(this.points);

        return this.points;
    }

    checkAndSaveRecord(points) {
        let lastRecord = 0;

        this.pointsRecord = false;

        if (window.localStorage['last_record']) {
            lastRecord = parseInt(window.localStorage['last_record'], 10);
        }

        if (lastRecord < points) {
            this.pointsRecord = true;
            window.localStorage['last_record'] = points;
        }
    }

    hasMadePointsRecord() {
        return this.pointsRecord;
    }

    getLastRecord() {
        return window.localStorage['last_record'] || 0;
    }

    slicer(mesh) {
        if (mesh && mesh.subMeshes) {
            let boxSlicerSize = 100;
            var slicePoint = new BABYLON.Vector3.Zero()
            var boxSlicer = BABYLON.Mesh.CreateBox("boxSlicer", boxSlicerSize, this.scene);
            boxSlicer.rotation = new BABYLON.Vector3(0.46, 0, 0);
            boxSlicer.position = new BABYLON.Vector3(0.5 * boxSlicerSize + slicePoint.x, slicePoint.y, 0.5 * boxSlicerSize + slicePoint.z);
            var meshCSG = BABYLON.CSG.FromMesh(mesh);
            var slicerCSG = BABYLON.CSG.FromMesh(boxSlicer);
            var meshSliceSub = meshCSG.subtract(slicerCSG).toMesh(mesh.name + "_slice_left");
            meshSliceSub.physicsImpostor = new BABYLON.PhysicsImpostor(meshSliceSub, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.5 }, this.scene);
            var meshSliceInt = meshCSG.intersect(slicerCSG).toMesh(mesh.name + "_slice_right");
            meshSliceInt.physicsImpostor = new BABYLON.PhysicsImpostor(meshSliceInt, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 10, restitution: 0.5 }, this.scene);
            mesh.dispose();
            boxSlicer.dispose();
        }
    }

}