import UI from '../base/UI';

export default class Player {

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.changePosition = false;
        this.nextBullet = true;
        this.bullerCounter = 1;
        this.coins = 0;
        this.scamCount = 0;
        this.lives = GAME.options.player.lives;
        this.godMode = GAME.options.player.godMode;
        this.createCommonMaterials();
        this.setupPlayer();

    }

    createCommonMaterials() {

        let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#8510d8");
        playerMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#8510d8");
        playerMaterial.specularColor = new BABYLON.Color3.FromHexString("#8510d8");

        // Freeze materials to improve performance (this material will not be modified)
        playerMaterial.freeze();

        this.level.addMaterial(playerMaterial);

    }

    setupPlayer() {

        this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
            width: 0.4,
            height: 0.8,
            depth: 0.1
        }, this.scene);
        this.mesh.position = new BABYLON.Vector3(0, -3, 0);
        this.mesh.material = this.level.getMaterial('playerMaterial');
        this.changePosition = true;
        this.createHUD();

    }

    createHUD() {
        this.hud = new UI('playerHudUI');
        this.coinsTextControl = null;
        this.livesTextControl = null;
        this.coinsTextControl = this.hud.addText('Coins: $0', {
            'top': '10px',
            'left': '10px',
            'fontSize': '15px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
        });

        this.livesTextControl = this.hud.addText('Lives: ' + this.lives, {
            'top': '10px',
            'left': '-10px',
            'fontSize': '15px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
    }

    keepCoin() {
        this.coins++;
        this.coinsTextControl.text = 'Coins: $' + this.coins;
    }

    checkLife() {
        if (this.godMode) return;

        if (this.lives <= 1) {
            this.lives = 0;
            this.livesTextControl.text = 'Lives: ' + this.lives;

            if (this.onDie) {
                this.onDie();
            }
        } else {
            this.lives--;
            this.livesTextControl.text = 'Lives: ' + this.lives;
        }
    }

    move() {
        this.checkDirectionMovement();
        this.checkShoot();
    }

    checkDirectionMovement() {
        if (GAME.keys.left) {
            if (this.changePosition && this.mesh.position.x > (GAME.isMobile() ? -1 : -2.5) ) {
                this.changePosition = false;
                this.mesh.animations = [];
                this.mesh.animations.push(this.createPlayerSideMotion('left', this.mesh.position.x));
                this.scene.beginAnimation(this.mesh, 0, 100, false);
                setTimeout(() => {
                    this.changePosition = true;
                }, 300);

            }
        }

        if (GAME.keys.right) {
            if (this.changePosition && this.mesh.position.x < (GAME.isMobile() ? 1 : 2.5)) {
                this.changePosition = false;
                this.mesh.animations = [];
                this.mesh.animations.push(this.createPlayerSideMotion('right', this.mesh.position.x));
                this.scene.beginAnimation(this.mesh, 0, 100, false);
                setTimeout(() => {
                    this.changePosition = true;
                }, 300);
            }
        }
    }

    createPlayerSideMotion(type, startValue) {
        let playerMotion = new BABYLON.Animation("playerSideMotion", "position.x", this.level.getGameSpeed() * 20, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];
        var frameCounter = 0, value = 0;
        for (let index = 0; index < 5; index++) {
            if (type == 'left') {
                value += (GAME.isMobile() ? -0.2 : -0.5);
            } else {
                value += (GAME.isMobile() ? 0.2 : 0.5);
            }
            keys.push({ frame: frameCounter, value: startValue + value });
            frameCounter += 15;
        }

        playerMotion.setKeys(keys);

        return playerMotion;
    }

    checkShoot() {
        if (GAME.keys.shoot) {

            const bullet = BABYLON.MeshBuilder.CreateBox("bullet_" + this.bullerCounter++, {
                width: 0.1,
                height: 0.2,
                depth: 0.01
            }, this.scene);
            bullet.position = this.mesh.getAbsolutePosition().clone();
            bullet.material = this.level.getMaterial('playerMaterial');

            bullet.animations = [];
            bullet.animations.push(this.createBulletMotion(bullet.position.y));
            this.scene.beginAnimation(bullet, 0, 1000, false);
            // Clear bullet after a second
            setTimeout(() => {
                bullet.dispose();
            }, 1500);

        }
    }

    createBulletMotion(startValue) {
        let bulletMotion = new BABYLON.Animation("bulletShoot", "position.y", 400, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];
        var frameCounter = 0, value = 0;
        for (let index = 0; index < 40; index++) {
            keys.push({ frame: frameCounter, value: startValue + value });
            frameCounter += 15;
            value += 0.7
        }

        bulletMotion.setKeys(keys);

        return bulletMotion;
    }

    getMesh() {
        return this.mesh;
    }

    getPoints() {
        return this.scamCount;
    }

    keepScam() {
        this.scamCount++;
        this.checkAndSaveRecord(this.scamCount);
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

    reset() {

        this.coins = 0;
        this.mesh.position.x = 0;
        this.scamCount = 0;
        this.lives = GAME.options.player.lives;
        this.livesTextControl.text = 'Lives: ' + this.lives;
        this.coinsTextControl.text = 'Coins: $' + this.coins;

    }

}