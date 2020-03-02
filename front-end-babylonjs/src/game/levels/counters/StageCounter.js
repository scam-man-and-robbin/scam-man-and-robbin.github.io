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


    /**
     * Function to notify user of each stage
     * Show scams and boons for corresponding stage
     * Scam and boon message appear from message.json
     * Stage configuration is from stage.json
     */
    showStage(stage) {
        GAME.pause();
        let show = true, timer = 3;
        this.stageUI = new UI('stageLoadingUI');

        let stageData = stages["stage_" + stage];

        if (stageData) {

            var rect1 = new BABYLON.GUI.Rectangle();
            rect1.width = 1;
            rect1.height = 1;
            rect1.background = "white";
            rect1.alpha = 0.7;
            this.stageUI.menuTexture.addControl(rect1);

            this.stageStatus = this.stageUI.addText('Level ' + stage + '…. Loading in ' + timer, {
                'top': '-180px',
                'color': GAME.options.pointsTextColor,
                'outlineColor': GAME.options.pointsOutlineTextColor,
                'outlineWidth': '2px',
                'fontSize': '25px',
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
            });

            if (stageData['message']) {
                this.gameSubTextControl = this.stageUI.addText(stageData['message'], {
                    'top': '-140px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                });
            }
            if (stageData['instruction']) {
                this.gameInstructionControl = this.stageUI.addText(stageData['instruction'], {
                    'top': '-60px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                });
            }
            if (stage == 0) {
                this.stageUI.addImgButton('continueBtn', {
                    'imgpath': "assets/scenes/scam-man-continue-btn.png",
                    'top': '50px',
                    'onclick': () => {
                        this.player.coinsTextControl.isVisible = true;
                        this.stageUI.clear();
                        GAME.resume();
                        show = false;
                    }
                });
            } else {
                let top = -140;
                this.stageUI.addText("Beware the following scams", {
                    'top': top,
                    'color': GAME.options.pointsTextColor,
                    'outlineColor': GAME.options.pointsOutlineTextColor,
                    'outlineWidth': '2px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                });
                stageData['scams'].forEach(scam => {
                    top = top + 60;
                    this.stageUI.addText(Message.Message[scam]['Info'], {
                        'top': top,
                        'fontSize': '15px',
                        'left': '20px',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                    });
                    this.stageUI.addImgButton('Dynamic Logo',{
                        'top': top,
                        'imgpath' : Message.Message[scam]['path'],
                        'width': 0.08,
                        'height' : 0.08,
                        'left': '5px',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                    });
                });
                top = top + 60;
                this.stageUI.addText("Collect bonus points", {
                    'top': top,
                    'color': GAME.options.pointsTextColor,
                    'outlineColor': GAME.options.pointsOutlineTextColor,
                    'outlineWidth': '2px',
                    'fontSize': '15px',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                });
                stageData['boons'].forEach(scam => {
                    top = top + 60;
                    this.stageUI.addText(Message.Message[scam]['Info'], {
                        'top': top,
                        'fontSize': '15px',
                        'left': '10px',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT,
                        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                    });
                });
            }
            this.player.coinsTextControl.isVisible = false;
            this.stageUI.show();

            setInterval(() => {
                if (show) {
                    timer = timer - 1;
                    this.stageStatus.text = 'Level ' + stage + '…. Loading in ' + timer;
                }
                if (show && !timer) {
                    this.stageUI.remove(this.stageStatus);
                    this.player.coinsTextControl.isVisible = true;
                    this.stageUI.clear();
                    GAME.resume();
                    show = false;
                }
            }, 1000);
        }
    }

}