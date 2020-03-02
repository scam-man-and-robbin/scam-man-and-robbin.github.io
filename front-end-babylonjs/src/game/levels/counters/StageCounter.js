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
        textControl.lineSpacing = options.lineSpacing || '5px';
        textControl.left = options.left || '0px';
        textControl.paddingRight = options.paddingRight || '0px';
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
        let show = true, timer = 6, screen = 1;
        this.scamsMessage = [];
        let stageUI = new UI('stageLoadingUI');

        let background = new BABYLON.GUI.Rectangle();
        background.width = 1;
        background.height = 1;
        background.thickness = 0;
        background.background = "#FFDA75";
        background.alpha = 1;
        stageUI.menuTexture.addControl(background);

        this.stageUI = new BABYLON.GUI.Rectangle();
        this.stageUI.width = 0.9;
        this.stageUI.height = 1;
        this.stageUI.thickness = 0;
        this.stageUI.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        stageUI.menuTexture.addControl(this.stageUI);

        let stageData = stages["stage_" + stage];

        if (stageData) {

            this.stageStatus = this.addText('Level ' + stage + '…. Loading in ' + timer, {
                'top': '-180px',
                'color': GAME.options.pointsTextColor,
                'outlineColor': GAME.options.pointsOutlineTextColor,
                'outlineWidth': '2px',
                'fontSize': '25px',
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
            });
            stageUI.menuTexture.addControl(this.stageStatus);

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
            if (stage == 0) {
                stageUI.addImgButton('continueBtn', {
                    'imgpath': "assets/scenes/scam-man-continue-btn.png",
                    'top': '50px',
                    'width' : GAME.isMobile() ? 0.4 : 0.25,
                    'onclick': () => {
                        this.player.coinsTextControl.isVisible = true;
                        stageUI.clear();
                        GAME.resume();
                        show = false;
                    }
                });
            } else {
                let top = -140;
                this.scamDescription = this.addText("Beware the following scams", {
                    'top': top,
                    'color': GAME.options.pointsTextColor,
                    'outlineColor': GAME.options.pointsOutlineTextColor,
                    'outlineWidth': '2px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                })
                this.stageUI.addControl(this.scamDescription);
                stageData['scams'].forEach(scam => {
                    top = top + 60;
                    let scamsMessage = this.addText(Message.Message[scam]['Info'], {
                        'top': top,
                        'fontSize': '15px',
                        'left': '10px',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                    })
                    this.scamsMessage.push(scamsMessage);
                    this.stageUI.addControl(scamsMessage);
                });
            }
            this.player.coinsTextControl.isVisible = false;
            stageUI.show();

            let trigger = setInterval(() => {
                if (show) {
                    timer = timer - 1;
                    this.stageStatus.text = 'Level ' + stage + '…. Loading in ' + timer;
                }
                if(screen === 1 && !timer && stageData['boons'] && stageData['boons'].length) {
                    this.setBoons(stageData);
                    this.scamDescription.dispose();
                    this.scamsMessage.forEach(scam => {
                        scam.dispose();
                    });
                    background.background = "#F38669";
                    timer = 6;
                    screen = 2;
                }else if (show && timer <= 0) {
                    stageUI.remove(this.stageStatus);
                    this.player.coinsTextControl.isVisible = true;
                    stageUI.clear();
                    GAME.resume();
                    show = false;
                    clearInterval(trigger);
                }
            }, 1000);
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
            top = top + 60;
            this.stageUI.addControl(this.addText(Message.Message[scam]['Info'], {
                'top': top,
                'fontSize': '15px',
                'left': '10px',
                'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
            }));
        });
    }
 
}