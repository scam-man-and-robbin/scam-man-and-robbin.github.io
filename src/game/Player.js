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
        this.gameEnded = false;
        this.freezeScams = false;
        this.createCommonMaterials();
        this.setupPlayer();
    }
    /**
     * Function to create player material.
     * Initial Dev - Simple Purple Color Texture
     */
    createCommonMaterials() {
        let playerMaterial = new BABYLON.StandardMaterial("playerMaterial", this.scene);
        playerMaterial.diffuseTexture = new BABYLON.Texture("assets/scenes/Standing 1 1.png", this.scene);
        playerMaterial.diffuseTexture.hasAlpha = true;
        playerMaterial.backFaceCulling = true;

        let bulletMaterial = new BABYLON.StandardMaterial("bulletMaterial", this.scene);
        bulletMaterial.diffuseColor = new BABYLON.Color3.FromHexString("#887FC0");
        bulletMaterial.emissiveColor = new BABYLON.Color3.FromHexString("#887FC0");
        bulletMaterial.specularColor = new BABYLON.Color3.FromHexString("#887FC0");
        bulletMaterial.alpha = 0.5;
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
            width: 1.2,
            height: 1.2,
            depth: 0.01
        }, this.scene);
        this.mesh.position = new BABYLON.Vector3(0, -2.1, 0);
        this.mesh.material = this.level.getMaterial('playerMaterial');
        this.changePosition = true;
        this.gotCoinSound = this.level.assets.getSound('gotCoinSound');
        this.gameLostSound = this.level.assets.getSound('gameLostSound');
        this.beginGameSound = this.level.assets.getSound('beginGameSound');
        this.infoSound = this.level.assets.getSound('infoSound');
        this.scammedSound = this.level.assets.getSound('damageSound');
        this.zappingSound = this.level.assets.getSound('zappingSound');
        this.winningSound = this.level.assets.getSound('winningSound');
        this.selectSound = this.level.assets.getSound('selectSound');
        this.movementSound = this.level.assets.getSound('movementSound');
        this.groundMesh = BABYLON.MeshBuilder.CreateBox("groundplane", {
            width: screen.width,
            height: 0.1,
            depth: 0.01
        }, this.scene);
        this.groundMesh.position = new BABYLON.Vector3(0, -2.7, 0);
        this.groundMesh.isVisible = false;
        this.mesh.material.alpha = 0;
        this.spriteManagerPlayer = [];
        this.spriteManagerPlayer['left'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/scamman_walk_left.png", 1, { width: 61, height: 60 }, this.scene);
        this.spriteManagerPlayer['right'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/scamman_walk_right.png", 1, { width: 61, height: 60 }, this.scene);
        this.spriteManagerPlayer['up'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/scamman_attack.png", 1, { width: 41, height: 62 }, this.scene);
        this.spriteManagerPlayer['land'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/scamman_land.png", 1, { width: 118, height: 198 }, this.scene);
        this.spriteManagerPlayer['lose'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/scam man_lose.png", 1, { width: 39, height: 48 }, this.scene);
        this.spriteManagerPlayer['win'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/scam man_win.png", 1, { width: 66, height: 62 }, this.scene);
        this.spriteManagerPlayer['shield'] = new BABYLON.SpriteManager("playerManager", "assets/scenes/shield.png", 1, { width: 61, height: 60 }, this.scene);
        this.createHUD();
    }
    /**
    * Function to create UI Texts (Coin Counter, Lives Counter).
    */
    createHUD() {
        this.hud = new UI('playerHudUI');
        this.coinsTextControl = null;
        this.pauseButtonControl = null;
        this.groundImg = this.hud.addImage('groundImage',{
            'imgpath' : "assets/scenes/ground_image.png",
            'width' : 1,
            'isVisible': true,
            'height' : 0.075,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        });
        this.moneyBar = this.hud.addImage('moneyBar',{
            'imgpath' : "assets/scenes/moneybar.png",
            "width" : 0.4,
            "height" : 0.05,
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*1/100)),
            "left": Math.floor((GAME.engine.getRenderWidth()*2/100)),
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        });
        this.potImg = this.hud.addImage('potImage',{
            'imgpath' : "assets/scenes/pot.png",
            "width" : 0.09,
            "height" : 0.055,
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*0.8/100)), 
            "left": Math.floor(-(GAME.engine.getRenderWidth()*20/100)),
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        });
        this.coinsTextControl = this.hud.addText('£ 0', {
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*2.1/100)),
            "left": "4px",
            'fontSize': '16px',
            'fontStyle': 'bold',
            'color' : '#FFFF99',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
        });
        if (GAME.currentLevelName == 'TutorialLevel') {
            this.coinsTextControl.isVisible = false;
            this.moneyBar.isVisible = false;
            this.potImg.isVisible = false;
            this.skipControl = this.hud.addImgButton('SkipBtn', {
                'imgpath': "assets/scenes/Skip_tutorial.png",
                'top': -(GAME.engine.getRenderHeight()*1)/100,
                'width': 0.2,
                'height' : 0.05,
                'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
                'onclick': () => {
                    this.gameEnded = true;                    
                    clearInterval(this.level.scams.trigger);
                    clearInterval(this.level.boons.trigger);
                    clearInterval(this.level.tutorialTrigger);
                    GAME.goToLevel('RunnerLevel');
                }
            });
            this.skipControl.isVisible = false;
        }

        this.pauseButtonControl = this.hud.addImgButton('PAUSE', {
            'imgpath' : "assets/scenes/pause.png",
            'width': 0.12,
            'height': 0.08,
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*1.5/100)),
            'left': '-25px',
            'isVisible': true,
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
            'onclick': () => {
                this.selectSound.play();
                GAME.pause();
                this.resumeButton.isVisible = true;
                this.pauseButtonControl.isVisible = false;
                this.pausedImage.isVisible = true;
                if (this.level.skipControl) {
                    this.level.skipControl.isVisible = false;
                }
            }
        });
        this.pausedImage = this.hud.addImage('PAUSED',{
            'imgpath' : "assets/scenes/PausedScreen.png",
            'width': 0.5,
            'height': 0.1,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER,
        });
        this.pausedImage.isVisible = false;
        this.soundMuteButtonControl = this.hud.addImgButton('MUTE', {
            'imgpath' : "assets/scenes/music_on.png",
            'width' : 0.12,
            'height': 0.08,
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*1.5/100)),
            'left': '25px',
            'isVisible': true,
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
            'onclick': () => {
                window.localStorage['mute_sound'] = 1;
                this.soundUnMuteButtonControl.isVisible = true;
                this.soundMuteButtonControl.isVisible = false;
                BABYLON.Engine.audioEngine.setGlobalVolume(0);
            }
        });
        this.soundUnMuteButtonControl = this.hud.addImgButton('UNMUTE', {
            'imgpath' : "assets/scenes/music_off.png",
            'width' : 0.12,
            'height': 0.08,
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*1.5/100)),
            'left': '25px',
            'isVisible': true,
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
            'onclick': () => {
                window.localStorage['mute_sound'] = 0;
                this.soundUnMuteButtonControl.isVisible = false;
                this.soundMuteButtonControl.isVisible = true;
                BABYLON.Engine.audioEngine.unlock();
                BABYLON.Engine.audioEngine.setGlobalVolume(20);
            }
        });
        this.resumeButton = this.hud.addImgButton('RESUME',{
            'imgpath' : "assets/scenes/Play_Button.png",
            'width' : 0.12,
            'height': 0.08,
            'top' : Math.floor(-(GAME.engine.getRenderHeight()*1.5/100)),
            'left': '-25px',
            'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT,
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
            'onclick' : () =>{
                if(!this.level.activeMessage) {
                    GAME.resume();
                }
                if (this.skipControl) {
                    this.skipControl.isVisible = true;
                }
                if (this.level.skipControl) {
                    this.level.skipControl.isVisible = true;
                }
                this.pausedImage.isVisible = false;
                this.resumeButton.isVisible = false;
                this.pauseButtonControl.isVisible = true;
            }
        });
        this.resumeButton.isVisible = false;

    }
    /**
    * Function to handle coin counter.
    * Called when coin is passively landed over ground
    */
    keepCoin() {
        if (this.lives != 0 && this.allowCoinChange) {
            this.coins += 100;
            this.coins = GAME.options.maxLifetimeAllowance < this.coins ? GAME.options.maxLifetimeAllowance : this.coins;
            this.gotCoinSound.play();
            this.coinsTextControl.text = '£ ' + this.coins;
            this.coinsTextControl.fontSize = '15px';
            setTimeout(() => {
                this.coinsTextControl.fontSize = '15px';
            }, 500);
            this.maxCoins = this.coins > this.maxCoins ? this.coins : this.maxCoins;
        }
    }
    /**
    * Function to handle Pension Pot visual.
    */
    handlePot() {
        let url = "";
        if(this.coins) {
            url = "assets/scenes/pot low.png";
        }
        if(this.coins > 2000) {
            url = "assets/scenes/pot-1.png";
        }
        if(this.coins > 4000) {
            url = "assets/scenes/pot-2.png";
        }
        if(this.coins > 8000) {
            url = "assets/scenes/pot-3.png";
        }
        if(this.coins > 10000) {
            url = "assets/scenes/pot-4.png";
        }
        if(this.coins > 13500) {
            url = "assets/scenes/pot-full.png";
        }
        if(url) {
            this.potImg.source = url;
            this.potImg.width = 0.09;
        }
        
    }
    /**
    * Function to handle Live counter.
    * Called when scam is missed and landed over player
    */
    checkLife() {
        if (this.shielded) return;
        if (this.godMode) return;
        if(GAME.currentLevelName == 'TutorialLevel') return;
        if (this.coins <= 1) {
            this.coins = 0;
            this.coinsTextControl.text = '£ ' + this.coins;
            this.coinsTextControl.fontSize = '15px';
            this.allowCoinChange = false;
            if (this.onDie) {
                this.onDie();
            }
        } else {
            let message = Message.message;
            this.scammedSound.play();
            // Reduce coins when scammed.

            this.scamming = true;
            let newCoins = Math.floor(this.coins - message[this.activeScam].reduction);
            let factor = Math.floor((this.coins - newCoins) / 10);
            let trigger = setInterval(() => {
                this.coins -= factor;
                if (this.coins > newCoins) {
                    this.coinsTextControl.text = '£ ' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = '#ff0000';
                } else {
                    this.allowCoinChange = true;
                    this.coinsTextControl.text = '£ ' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = '#FFFF99';
                    this.scamming = false;
                    clearInterval(trigger);
                }
                if (this.coins <= 1) {
                    this.coins = 0;
                    this.allowCoinChange = false;
                    this.scamming = false;
                    this.coinsTextControl.text = '£ ' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = '#ff0000';
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
    move() {
        this.checkDirectionMovement();
        this.checkShoot();
        this.handlePot();
        if (window.localStorage['mute_sound'] == 1) {
            this.soundUnMuteButtonControl.isVisible = true;
            this.soundMuteButtonControl.isVisible = false;
            BABYLON.Engine.audioEngine.setGlobalVolume(0);
        } else {
            this.soundUnMuteButtonControl.isVisible = false;
            this.soundMuteButtonControl.isVisible = true;
            BABYLON.Engine.audioEngine.unlock();
            BABYLON.Engine.audioEngine.setGlobalVolume(20);
        }
    }
    /**
    * Function to handle player left, right and center actions.
    */
    checkDirectionMovement() {
        if (GAME.keys.left && !this.gameEnded && !this.playerLanding) {
            if (this.changePosition && this.mesh.position.x > (GAME.isMobile() ? -1 : -1)) {
                this.movementSound.play();
                this.changePosition = false;
                if (this.shootAction) {
                    this.shootAction.dispose();
                    clearInterval(this.shootTrigger);
                }
                let player = new BABYLON.Sprite("player", this.spriteManagerPlayer['left']);
                player.playAnimation(0, 7, true, 60);
                player.position = this.mesh.position;
                player.size = 1.15;
                player.isPickable = true;
                let movement = setInterval(() => {
                    player.position = this.mesh.position;
                }, 20);
                this.mesh.animations = [];
                this.mesh.animations.push(this.createPlayerSideMotion('left', this.mesh.position.x));
                this.scene.beginAnimation(this.mesh, 0, 100, false);
                setTimeout(() => {
                    this.changePosition = true;
                    clearInterval(movement);
                    player.dispose();
                }, 100);
            }
        }
        if (GAME.keys.right && !this.gameEnded && !this.playerLanding) {
            if (this.changePosition && this.mesh.position.x < (GAME.isMobile() ? 1 : 1)) {
                this.movementSound.play();
                this.changePosition = false;
                if (this.shootAction) {
                    this.shootAction.dispose();
                    clearInterval(this.shootTrigger);
                }
                let player = new BABYLON.Sprite("player", this.spriteManagerPlayer['right']);
                // this.mesh.material.alpha = 0;
                player.playAnimation(0, 7, true, 40);
                player.position = this.mesh.position;
                player.size = 1.15;
                player.isPickable = true;
                let movement = setInterval(() => {
                    player.position = this.mesh.position;
                }, 20);
                this.mesh.animations = [];
                this.mesh.animations.push(this.createPlayerSideMotion('right', this.mesh.position.x));
                this.scene.beginAnimation(this.mesh, 0, 100, false);
                setTimeout(() => {
                    this.changePosition = true;
                    clearInterval(movement);
                    player.dispose();
                }, 100);
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
        let frameCounter = 0, value = 0;
        for (let index = 0; index < 5; index++) {
            if (type == 'left') {
                value += (GAME.isMobile() ? -0.2 : -0.2);
            } else {
                value += (GAME.isMobile() ? 0.2 : 0.2);
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
        if (GAME.keys.shoot && !this.beamEnabled && this.changePosition && !this.gameEnded && !this.playerLanding) {
            if (this.bullet) {
                this.bullet.isVisible = false;
            }
            this.bullet = BABYLON.Mesh.CreateCylinder("bullet_" + this.bullerCounter++, 3, 1, 0.05, 0, 0, this.scene);
            // scams.position = this.mesh.getAbsolutePosition().clone();
            let meshPosition = this.mesh.getAbsolutePosition().clone();
            this.bullet.position.x = meshPosition.x;
            this.bullet.position.y = -0.3;
            this.bullet.material = this.level.getMaterial('bulletMaterial');
            this.level.light.excludedMeshes.push(this.bullet);
            this.beamEnabled = true;
            if (this.shootAction) {
                this.shootAction.dispose();
                clearInterval(this.shootTrigger);
            }
            this.shootAction = new BABYLON.Sprite("player", this.spriteManagerPlayer['up']);
            this.shootAction.playAnimation(0, 3, false, 25);
            this.shootAction.position.x = this.mesh.position.x + 0.2;
            this.shootAction.position.y = this.mesh.position.y - 0.1;
            this.shootAction.position.z = this.mesh.position.z;
            this.shootAction.size = 1;
            this.shootAction.isPickable = true;
            this.shootTrigger = setInterval(() => {
                this.shootAction.position.x = this.mesh.position.x + 0.2;
                this.shootAction.position.y = this.mesh.position.y - 0.1;
                this.shootAction.position.z = this.mesh.position.z;
            }, 24);
            // Clear bullet after half second
            setTimeout(() => {
                this.bullet.dispose();
                this.beamEnabled = false;
                this.shootAction.dispose();
                clearInterval(this.shootTrigger);
            }, 700);
            let trigger = setInterval(() => {
                if (!this.changePosition) {
                    this.bullet.dispose();
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
        this.checkAndSaveRecord(this.coins);
        return this.coins;
    }
    /**
     * Function to handle scam counter.
     */
    keepScam(scamId) {
        this.zappingSound.play();
        if (this.lastScamId !== scamId) {
            this.lastScamId = scamId;
            this.scamCount++;
        }
    }
    /**
     * Function to handle boon counter.
     * @todo Any other logics in future to be added
     * 1. Currenly coins are increased based on predefined value.
     */
    keepBoon(boon) {
        this.boonCount++;
        this.gotCoinSound.play();
        if (boon == 'invisiblity_boon') {
            this.shielded = 10;
            if(this.shieldTrigger) {
                this.shieldSprite.dispose();
                clearInterval(this.maintainPositionTrigger);
                clearInterval(this.shieldTrigger);
            }
            this.shieldSprite = new BABYLON.Sprite("shieldSprite", this.spriteManagerPlayer['shield']);
            this.shieldSprite.playAnimation(0, 7, true, 100);
            this.shieldSprite.position = this.mesh.position;
            this.shieldSprite.size = 1.15;
            this.maintainPositionTrigger = setInterval(() => {
                this.shieldSprite.position = this.mesh.position;
                if(this.beamEnabled) {
                    this.shieldSprite.isVisible = false;
                }else {
                    this.shieldSprite.isVisible = true;
                }
            }, 100);
            this.shieldTrigger = setInterval(() => {
                this.shielded--;
                if(!this.shielded) {
                    this.shieldSprite.dispose();
                    clearInterval(this.maintainPositionTrigger);
                    clearInterval(this.shieldTrigger);
                }
            }, 1000);
        }
        let message = Message.message;
        let newCoins = Math.floor(this.coins + message[boon].addition);
        newCoins = newCoins > GAME.options.maxLifetimeAllowance ? GAME.options.maxLifetimeAllowance : newCoins;
        let factor = Math.floor((newCoins - this.coins) / 10);
        if (factor) {
            let trigger = setInterval(() => {
                this.coins += factor;
                this.maxCoins = (this.coins > this.maxCoins) ? this.coins : this.maxCoins;
                if (this.coins < newCoins && this.allowCoinChange) {
                    this.coinsTextControl.text = '£ ' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = 'green';
                } else {
                    this.coins = this.lives > 0 ? newCoins : 0;
                    this.coinsTextControl.text = '£ ' + this.coins;
                    this.coinsTextControl.fontSize = '15px';
                    this.coinsTextControl.color = '#FFFF99';
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
        this.coinsTextControl.text = '£ ' + this.coins;
        this.allowCoinChange = true;
        this.pauseButtonControl.isVisible = true;
    }

    landPlayer() {
        this.playerLanding = true;
        this.beginGameSound.play();
        this.landAction = new BABYLON.Sprite("land", this.spriteManagerPlayer['land']);
        this.landAction.position = new BABYLON.Vector3(0.18, -0.7, 0);
        this.landAction.height = 4;
        this.landAction.width = 2.25;
        // this.landAction.size = 3.1;
        this.landAction.playAnimation(0, 11, false, 100, () => {
            this.mesh.material.alpha = 1;
            this.playerLanding = false;
            this.level.freezeGeneration = false;
            this.landAction.dispose();
        });
        this.landAction.isPickable = true;
        this.mesh.position.x = 0;
    }
}