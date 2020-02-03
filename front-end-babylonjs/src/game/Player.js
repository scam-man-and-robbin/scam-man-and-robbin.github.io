import UI from '../base/UI';

export default class Player {

    /**
    * Class description
    *
    * To handle Player Object Related Actions. 
    * Core Game Logics are handled here.
    */
    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.changePosition = false;
        this.nextBullet = true;
        this.bullerCounter = 1;
        this.coins = 0;
        this.scamCount = 0;
        this.boonCount = 0;
        this.lives = GAME.options.player.lives;
        this.godMode = GAME.options.player.godMode;
        this.allowCoinChange = true;
        this.createCommonMaterials();
        this.setupPlayer();

    }

    /**
     * Function to create player material.
     * Initial Dev - Simple Purple Color Texture
     */
    createCommonMaterials() {

        let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#8510d8");
        playerMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#8510d8");
        playerMaterial.specularColor = new BABYLON.Color3.FromHexString("#8510d8");

        // Freeze materials to improve performance (this material will not be modified)
        playerMaterial.freeze();

        this.level.addMaterial(playerMaterial);

    }

    /**
    * Function to create player object.
    * Initial Dev - Rectangular Box with simple Purple Color Texture
    */
    setupPlayer() {

        this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
            width: 0.4,
            height: 0.8,
            depth: 0.1
        }, this.scene);
        this.mesh.position = new BABYLON.Vector3(0, -3, 0);
        this.mesh.material = this.level.getMaterial('playerMaterial');
        this.changePosition = true;
        this.gotCoinSound = this.level.assets.getSound('gotCoinSound');
        this.scammedSound = this.level.assets.getSound('damageSound');
        this.createHUD();

    }

    /**
    * Function to create UI Texts (Coin Counter, Lives Counter).
    */
    createHUD() {
        this.hud = new UI('playerHudUI');
        this.coinsTextControl = null;
        this.livesTextControl = null;
        this.coinsTextControl = this.hud.addText('Coins: $0', {
            'top': '-10px',
            'left': '-10px',
            'fontSize': '15px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        });

        this.livesTextControl = this.hud.addText('Lives: ' + this.lives, {
            'top': '10px',
            'left': '-10px',
            'fontSize': '15px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT
        });
    }

    /**
    * Function to handle coin counter.
    * Called when coin is passively landed over ground
    */
    keepCoin() {
        if (this.lives != 0 && this.allowCoinChange) {
            this.coins += 100;
            this.gotCoinSound.play();
            this.coinsTextControl.text = 'Coins: $' + this.coins;
            this.coinsTextControl.fontSize = '16px';
            setTimeout(() => {
                this.coinsTextControl.fontSize = '15px';
            }, 500);
        }
    }

    /**
    * Function to handle Live counter.
    * Called when scam is missed and landed over player
    */
    checkLife() {
        if (this.godMode) return;

        if (this.lives <= 1) {
            this.lives = 0;
            this.livesTextControl.text = 'Lives: ' + this.lives;

            this.coins = 0;
            this.coinsTextControl.text = 'Coins: $' + this.coins;
            this.coinsTextControl.fontSize = '18px';
            this.allowCoinChange = false;
            if (this.onDie) {
                this.onDie();
            }
        } else {
            this.lives--;
            this.livesTextControl.text = 'Lives: ' + this.lives;
            this.scammedSound.play();
            // Reduce coins when scammed.
            let newCoins = Math.floor((this.coins / GAME.options.player.lives) * (GAME.options.player.lives - this.lives));
            var factor = Math.floor((this.coins - newCoins) / 10);
            var trigger = setInterval(() => {
                this.coins -= factor;
                if(this.coins > newCoins) {
                    this.coinsTextControl.text = 'Coins: $' + this.coins;
                    this.coinsTextControl.fontSize = '18px';
                    this.coinsTextControl.color = 'red';
                }else {
                    this.coins = newCoins
                    this.allowCoinChange = true;
                    this.coinsTextControl.text = 'Coins: $' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = 'black';
                    clearInterval(trigger);
                }
            }, 50);
            
        }

    }

    /**
    * Function to handle player actions.
    * Called when coin is passively landed over ground
    */
    move() {
        this.checkDirectionMovement();
        this.checkShoot();
    }

    /**
    * Function to handle player left, right and center actions.
    */
    checkDirectionMovement() {
        if (GAME.keys.left) {
            if (this.changePosition && this.mesh.position.x > (GAME.isMobile() ? -1 : -2.5)) {
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

    /**
    * Function to set up animation based on direction type.
    * @param {string} type - Direction Type [Left/Right]
    * @param {float} startValue - Current Position X of Player
    */
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

    /**
    * Function to handle player shoot actions.
    */
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

    /**
    * Function to handle bullet/beam animation actions.
    */
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

    // Function to access Player entity outside this class.
    getMesh() {
        return this.mesh;
    }

    // Function to access Points entity outside this class.
    getPoints() {
        return this.scamCount;
    }

    /**
     * Function to handle scam counter.
     */
    keepScam() {
        this.scamCount++;
        this.checkAndSaveRecord(this.scamCount);
    }

    /**
     * Function to handle boon counter.
     * @todo Any other logics in future to be added
     * 1. Currenly coins are doubled.
     */
    keepBoon() {
        this.boonCount++;
        let newCoins = this.coins * 2;
        var factor = Math.floor((newCoins - this.coins) / 10);
        var trigger = setInterval(() => {
            this.coins += factor;
            if(this.coins < newCoins && this.allowCoinChange) {
                this.coinsTextControl.text = 'Coins: $' + this.coins;
                this.coinsTextControl.fontSize = '18px';
                this.coinsTextControl.color = 'green';
            }else {
                this.coins = this.lives > 0 ? newCoins : 0;
                this.coinsTextControl.text = 'Coins: $' + this.coins;
                this.coinsTextControl.fontSize = '15px';
                this.coinsTextControl.color = 'black';
                clearInterval(trigger);
            }
        }, 50);
    }

    /**
     * Function to update highest score of player in this machine.
     * @param {int} points - Value that is saved to localstorage based on Is Record or Not
     */
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

    /**
     * Function to return if any high score record made by previous attempts.
     */
    hasMadePointsRecord() {
        return this.pointsRecord;
    }

    // Function to return last highest record.
    getLastRecord() {
        return window.localStorage['last_record'] || 0;
    }

    /**
     * Function to reset player postions and counters to initial levels to replay game.
     */
    reset() {

        this.coins = 0;
        this.mesh.position.x = 0;
        this.scamCount = 0;
        this.boonCount = 0;
        this.lives = GAME.options.player.lives;
        this.livesTextControl.text = 'Lives: ' + this.lives;
        this.coinsTextControl.text = 'Coins: $' + this.coins;

    }

}