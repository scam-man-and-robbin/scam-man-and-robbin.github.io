import UI from '../base/UI';
import Message from './../../public/message.json';

export default class Player {

    /**
    * Class description
    *
    * To handle Player Object Related Actions. 
    * Core Game Logics are handled here.
    */
    constructor(level) {

        this.message = new UI('pauseScreen');
        this.level = level;
        this.scene = level.scene;
        this.changePosition = false;
        this.nextBullet = true;
        this.bullerCounter = 1;
        this.coins = 0;
        this.maxCoins = 0;
        this.scamCount = 0;
        this.boonCount = 0;
        this.lives = GAME.options.player.lives;
        this.godMode = GAME.options.player.godMode;
        this.allowCoinChange = true;
        this.activeScam = null;
        this.coinsTextControl = null;
        this.pauseButtonControl = null;
        this.lastScamId = null;
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
        // playerMaterial.freeze();

        let bulletMaterial = new BABYLON.StandardMaterial("bulletMaterial", this.scene);
        bulletMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#887FC0");
        bulletMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#887FC0");
        bulletMaterial.specularColor = new BABYLON.Color3.FromHexString("#887FC0");
        bulletMaterial.alpha = 0.4;

        // Freeze materials to improve performance (this material will not be modified)
        bulletMaterial.freeze();

        this.level.addMaterial(playerMaterial);
        this.level.addMaterial(bulletMaterial);

    }

    /**
    * Function to create player object.
    * Initial Dev - Rectangular Box with simple Purple Color Texture
    */
    setupPlayer() {

        this.mesh = BABYLON.MeshBuilder.CreateBox("player", {
            width: 0.4,
            height: 0.8,
            depth: 0.01
        }, this.scene);
        this.mesh.position = new BABYLON.Vector3(0, -2.3, 0);
        this.mesh.material = this.level.getMaterial('playerMaterial');
        this.changePosition = true;
        this.gotCoinSound = this.level.assets.getSound('gotCoinSound');
        this.scammedSound = this.level.assets.getSound('damageSound');
        this.groundMesh = BABYLON.MeshBuilder.CreateBox("groundplane", {
            width: screen.width,
            height: 0.1,
            depth: 0.01
        }, this.scene);
        this.groundMesh.position = new BABYLON.Vector3(0, -2.7, 0);

        this.createHUD();

    }

    /**
    * Function to create UI Texts (Coin Counter, Lives Counter).
    */
    createHUD() {
        this.hud = new UI('playerHudUI');
        // if(flag){
        //     this.hud.show();
        // }
        // else{
        //     this.hud.hide();
        // }
        this.coinsTextControl = null;
        this.pauseButtonControl = null;
        this.coinsTextControl = this.hud.addText('Pension Pot: £0', {
            'top': '-10px',
            'left': '-10px',
            'fontSize': '15px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        });

        this.pauseButtonControl = this.hud.addButton('Pause','PAUSE',{
            'width':(GAME.isMobile() ? 0.15 : 0.1),
            'height':0.05,
            'top' : '10px',
            'left' : '-10px',
            'isVisible' : true,
            'fontSize': '10em',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
            'onclick': () => {
                this.coinsTextControl.isVisible = false;
                this.pauseButtonControl.isVisible = false;
                this.message.pauseScreen(this.coins,this.scamCount,this.boonCount,this.level.scams ? this.level.scams.scamSet : null)
            }
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
            this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
            this.coinsTextControl.fontSize = '15px';
            setTimeout(() => {
                this.coinsTextControl.fontSize = '15px';
            }, 500);
            this.maxCoins = this.coins > this.maxCoins ? this.coins : this.maxCoins;
        }
    }

    /**
    * Function to handle Live counter.
    * Called when scam is missed and landed over player
    */
    checkLife() {
        if (this.mesh.material.alpha != 1) return;
        if (this.godMode) return;

        if (this.coins <= 1) {
            this.coins = 0;
            this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
            this.coinsTextControl.fontSize = '15px';
            this.allowCoinChange = false;
            if (this.onDie) {
                this.onDie();
            }
        } else {
            // this.message = new UI('displayMessage');
            let message = Message.Message;
            // this.lives--;
            // this.livesTextControl.text = 'Lives: ' + this.lives;
            this.scammedSound.play();
            // Reduce coins when scammed.
            // let newCoins = Math.floor((this.coins / GAME.options.player.lives) * (GAME.options.player.lives - this.lives));
            // var factor = Math.floor((this.coins - newCoins) / 10);
            let newCoins = Math.floor(this.coins-message[this.activeScam].reduction);
            var factor = Math.floor((this.coins - newCoins) / 10);
            var trigger = setInterval(() => {
                this.coins -= factor;
                if (this.coins > newCoins) {
                    this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = 'red';
                } else {
                    this.allowCoinChange = true;
                    this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = 'black';
                    clearInterval(trigger);
                }
                if (this.coins <= 1) {
                    this.allowCoinChange = false;
                    if (this.onDie) {
                        this.onDie();
                    }
                    clearInterval(trigger);
                }
            }, 50);

        }

    }

    /**
    * Function to handle player actions.
    * Called when coin is passively landed over ground
    */
    // visible(){
    //     let status = true;
    //     this.createHUD(status);
    // }
    move() {
        this.checkDirectionMovement();
        this.checkShoot();
    }

    /**
    * Function to handle player left, right and center actions.
    */
    checkDirectionMovement() {
        if (GAME.keys.left) {
            if (this.changePosition && this.mesh.position.x > (GAME.isMobile() ? -1 : -1.5)) {
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
            if (this.changePosition && this.mesh.position.x < (GAME.isMobile() ? 1 : 1.5)) {
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
        let playerMotion = new BABYLON.Animation("playerSideMotion", "position.x", 1000, BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);

        let keys = [];
        var frameCounter = 0, value = 0;
        for (let index = 0; index < 5; index++) {
            if (type == 'left') {
                value += (GAME.isMobile() ? -0.2 : -0.3);
            } else {
                value += (GAME.isMobile() ? 0.2 : 0.3);
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
        if (GAME.keys.shoot && !this.beamEnabled) {
            
            let bullet = BABYLON.Mesh.CreateCylinder("bullet_" + this.bullerCounter++, 3, 1, 0.05, 0, 0, this.scene);
            // scams.position = this.mesh.getAbsolutePosition().clone();
            let meshPosition = this.mesh.getAbsolutePosition().clone();
            bullet.position.x = meshPosition.x;
            bullet.position.y = -0.4;

            bullet.material = this.level.getMaterial('bulletMaterial');
            this.beamEnabled = true;
            // Clear bullet after half second
            setTimeout(() => {
                bullet.dispose();
                this.beamEnabled = false;
            }, 700);
            var trigger = setInterval(() => {
                if(!this.changePosition) {
                    bullet.dispose();
                    this.beamEnabled = false;
                    clearInterval(trigger);
                }
            }, 100);

        }
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
    keepScam(scamId) {
        if(this.lastScamId !== scamId) {
            this.lastScamId = scamId;
            this.scamCount++;
            this.checkAndSaveRecord(this.scamCount);
        }
    }

    /**
     * Function to handle boon counter.
     * @todo Any other logics in future to be added
     * 1. Currenly coins are doubled.
     */
    keepBoon(boon) {
        this.boonCount++;
        if (boon == 'LIFE_BOON' && this.lives < 3) {
            this.lives += 1;
            // this.livesTextControl.text = 'Lives: ' + this.lives;
        }
        else if (boon == 'INVISIBLITY_BOON') {
            this.mesh.material.alpha = 0.3;
            setTimeout(() => {
                var count = 0;
                this.mesh.material.alpha = 1;
                var trigger = setInterval(() => {
                    this.mesh.material.alpha = (count % 2) ? 0.3 : 1;
                    count += 1;
                    if(count > 10) {
                        clearInterval(trigger);
                    }
                }, 200);
            }, 10000);
        }
        else if(boon == 'NORMAL_BOON') {
            let newCoins = this.coins * 2;
            var factor = Math.floor((newCoins - this.coins) / 10);
            var trigger = setInterval(() => {
                this.coins += factor;
                this.maxCoins = (this.coins > this.maxCoins) ? this.coins : this.maxCoins;
                if (this.coins < newCoins && this.allowCoinChange) {
                    this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = 'green';
                } else {
                    this.coins = this.lives > 0 ? newCoins : 0;
                    this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = 'black';
                    clearInterval(trigger);
                }
            }, 50);
        }
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
        this.maxCoins = 0;
        this.mesh.position.x = 0;
        this.scamCount = 0;
        this.boonCount = 0;
        this.lives = GAME.options.player.lives;
        this.coinsTextControl.text = 'Pension Pot: £' + this.coins;
        this.allowCoinChange = true;
        this.pauseButtonControl.isVisible = true;

    }

}