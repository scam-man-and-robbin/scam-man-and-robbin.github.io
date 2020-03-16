import stages from '../../../../public/stage.json';
import Message from '../../../../public/message.json'
import UI from "../../../base/UI";

export default class StageCounter {

    /**
    * Class description
    *
    * To handle Age Timer. 
    */

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
    }

    addText(text, options = {}) {
        let textControl = new BABYLON.GUI.TextBlock();
        textControl.text = text;
        textControl.color = options.color || 'black';
        textControl.fontSize = options.fontSize || 20;
        textControl.outlineWidth = options.outlineWidth || 0;
        textControl.outlineColor = options.outlineColor || "black";
        textControl.lineSpacing = options.lineSpacing || '0px';
        textControl.left = options.left || '0px';
        textControl.paddingRight = options.paddingRight || '10px';
        textControl.top = options.top || '0px';
        textControl.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textControl.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textControl.textWrapping = options.wrapping || true;

        return textControl;
    }


    /**
     * Function to notify user of each stage
     * Show scams and boons for corresponding stage
     * Scam and boon message appear from message.json
     * Stage configuration is from stage.json
     */
    showStage(stage) {
        GAME.pause();
        let show = true, timer = GAME.options.messageReadTime, screen = 1;
        this.scamsMessage = [];
        this.scamsImage = [];
        let stageUI = new UI('stageLoadingUI');

        // let background = new BABYLON.GUI.Rectangle();
        // background.width = 1;
        // background.height = 1;
        // background.thickness = 0;
        // background.background = "#FFDA75";
        // background.alpha = 1;
        // stageUI.menuTexture.addControl(background);

        var background = stageUI.addImage('stageScreen',{
            'imgpath' : "assets/scenes/stage_screen.png",
            'width' : 1,
            'height' : 1
        });
        background.isVisible = false;
        this.stageUI = new BABYLON.GUI.Rectangle();
        this.stageUI.width = 0.9;
        this.stageUI.height = 1;
        this.stageUI.thickness = 0;
        this.stageUI.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        stageUI.menuTexture.addControl(this.stageUI);

        let stageData = stages["stage_" + stage];

        if (stageData) {

            // this.stageStatus = this.addText('Stage ' + stage, {
            //     'top': '-180px',
            //     'color': GAME.options.pointsTextColor,
            //     'outlineColor': GAME.options.pointsOutlineTextColor,
            //     'outlineWidth': '2px',
            //     'fontSize': '25px',
            //     'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
            // });
            // stageUI.menuTexture.addControl(this.stageStatus);

            if (stageData['message']) {
                this.gameSubTextControl = this.addText(stageData['message'], {
                    'top': '-140px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                });
                this.stageUI.addControl(this.gameSubTextControl);
            }
            if (stageData['instruction']) {
                this.gameInstructionControl = this.addText(stageData['instruction'], {
                    'top': '-60px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                });
                this.stageUI.addControl(this.gameInstructionControl);
            }

            // Skip button
            stageUI.addImgButton('continueBtn', {
                'imgpath': "assets/scenes/scam-man-continue-btn.png",
                'top': '-50px',
                'width': GAME.isMobile() ? 0.4 : 0.25,
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
                'onclick': () => {
                    // this.player.coinsTextControl.isVisible = true;
                    // stageUI.clear();
                    // GAME.resume();
                    // show = false;
                    this.player.selectSound.play();
                    if (screen === 1 && stage > 0) {
                        timer = GAME.options.messageReadTime;
                        this.setBoons(stageData);
                        this.scamDescription.dispose();
                        this.scamsMessage.forEach(scam => {
                            scam.dispose();
                        });
                        this.scamsImage.forEach(image => {
                            image.dispose();
                        });
                        // background.background = "#F38669";
                        screen = 2;
                        this.player.infoSound.play();
                    } else if (show) {
                        // stageUI.remove(this.stageStatus);
                        this.player.coinsTextControl.isVisible = true;
                        stageUI.clear();
                        if (!this.player.gameEnded) {
                            GAME.resume();
                            this.player.landPlayer();
                        }
                        show = false;
                    }
                }
            });
            if (stageData['scams']) {
                let top = -140;
                this.scamDescription = this.addText("Shine your torch and avoid the following scams! ", {
                    'top': top,
                    'color': GAME.options.pointsTextColor,
                    'outlineColor': GAME.options.pointsOutlineTextColor,
                    'outlineWidth': '2px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                })
                this.stageUI.addControl(this.scamDescription);
                stageData['scams'].forEach(scam => {
                    top = top + 100;
                    let image = new BABYLON.GUI.Image("icon", Message.message[scam].path);
                    image.width = 0.15;
                    image.height = 0.1;
                    image.top = top;
                    image.left = 0.1;
                    image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    this.stageUI.addControl(image);

                    let display = new BABYLON.GUI.Rectangle();
                    display.width = 0.75;
                    display.height = 0.1;
                    display.thickness = 0;
                    display.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                    display.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    display.top = top;
                    this.stageUI.addControl(display);

                    let scamsMessage = this.addText(Message.message[scam]['info'], {
                        'top': '1px',
                        'fontSize': '15px',
                        'left': '10px',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                    })
                    this.scamsMessage.push(scamsMessage);
                    this.scamsImage.push(image)
                    display.addControl(scamsMessage);
                });
            }
            this.player.coinsTextControl.isVisible = false;
            stageUI.show();
        }
    }

    setBoons(stageData) {
        let top = -140;
        this.stageUI.addControl(this.addText("Collect bonus points", {
            'top': top,
            'color': GAME.options.pointsTextColor,
            'outlineColor': GAME.options.pointsOutlineTextColor,
            'outlineWidth': '2px',
            'fontSize': '15px',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
        }));
        stageData['boons'].forEach(scam => {
            top = top + 100;
            let image = new BABYLON.GUI.Image("icon", Message.message[scam].path);
            image.width = 0.15;
            image.height = 0.1;
            image.top = top;
            image.left = 0.1;
            image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            this.stageUI.addControl(image);

            let display = new BABYLON.GUI.Rectangle();
            display.width = 0.75;
            display.height = 0.1;
            display.thickness = 0;
            display.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
            display.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            display.top = top;
            this.stageUI.addControl(display);

            let scamsMessage = this.addText(Message.message[scam]['info'], {
                'top': '1px',
                'fontSize': '15px',
                'left': '10px',
                'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
            });
            display.addControl(scamsMessage);
        });
    }

}