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
        textControl.fontStyle = options.fontStyle || "";
        textControl.outlineWidth = options.outlineWidth || 0;
        textControl.outlineColor = options.outlineColor || "black";
        textControl.lineSpacing = options.lineSpacing || '0px';
        textControl.left = options.left || '0px';
        textControl.paddingRight = options.paddingRight || '10px';
        textControl.top = options.top || '0px';
        textControl.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textControl.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textControl.textWrapping = options.wrapping || true;
        textControl.fontFamily = options.fontFamily || "'Tomorrow', sans-serif";
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
        this.scamsHeading = [];
        this.scamsMessage = [];
        this.scamsImage = [];
        let stageUI = new UI('stageLoadingUI'); 

        let stageData = stages["stage_" + stage];

        let background = stageUI.addImage('stageScreen',{
            'imgpath' : "assets/scenes/stage_boarder.png",
            'width' : 1,
            'height' : 1
        });
        this.stageUI = new BABYLON.GUI.Rectangle();
        this.stageUI.width = 0.9;
        this.stageUI.height = 1;
        this.stageUI.thickness = 0;
        this.stageUI.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        stageUI.menuTexture.addControl(this.stageUI);

        if (stageData) {
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
                'imgpath': "assets/scenes/Continue.png",
                'top': -(GAME.engine.getRenderHeight()*4)/100,
                'width': 0.2,
                'height' : 0.05,
                'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
                'onclick': () => {
                    this.player.selectSound.play();
                    if (show) {
                        this.player.coinsTextControl.isVisible = true;
                        this.player.pausedImage.isVisible = false;
                        this.player.resumeButton.isVisible = false;
                        this.player.pauseButtonControl.isVisible = true;
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
                this.levelImage = new BABYLON.GUI.Image("levelImage", stageData.path);
                this.levelImage.width = 0.3;
                this.levelImage.height = GAME.isMobile() ? 0.05 : 0.07 ;  
                this.levelImage.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                this.levelImage.top = (GAME.engine.getRenderHeight()*3)/100;
                this.stageUI.addControl(this.levelImage);
                this.scamDescription = this.addText("Shine your torch and avoid the following scams! ", {
                    'top': (GAME.engine.getRenderHeight()*10)/100,
                    'color': GAME.options.pointsTextColor,
                    'fontSize': '15px',
                    'fontStyle' : 'bold',
                    'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP,
                    'textVerticalAlignment' : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                })
                this.stageUI.addControl(this.scamDescription);
                if(stage == 2){
                    this.warningMessage = this.addText("*This bonus will make you temporarily invincible", {
                        'top': -(GAME.engine.getRenderHeight()*10)/100,
                        'color': GAME.options.pointsTextColor,
                        'fontSize': '11px',
                        'fontStyle' : 'bold',
                        'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM,
                        'textVerticalAlignment' : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER
                    });
                    this.stageUI.addControl(this.warningMessage);
                }
                let leftimg = (GAME.engine.getRenderWidth()*10.5)/100;
                let leftdis = (GAME.engine.getRenderWidth()*4)/100;
                stageData['scams'].forEach(scam => {
                    let image = new BABYLON.GUI.Image("icon", Message.message[scam].path);
                    image.width = 0.2;
                    image.height = 0.1;
                    image.top =  (GAME.engine.getRenderHeight()*18)/100;
                    image.left = leftimg
                    image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    this.stageUI.addControl(image);
                    let display = new BABYLON.GUI.Rectangle();
                    display.width = 0.37;
                    display.height = 0.22;
                    display.thickness = 0;
                    display.left = leftdis
                    display.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                    display.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    display.top = (GAME.engine.getRenderHeight()*28.5)/100;
                    this.stageUI.addControl(display);
                    let scamsHeading = this.addText(Message.message[scam]['name'], {
                        'top': '0px',
                        'fontSize': '11px',
                        'left': '1px',
                        'fontStyle' : 'bold',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
                    });
                    let scamsMessage = this.addText(Message.message[scam]['info'], {
                        'top': '30px',
                        'fontSize': '11px',
                        'left': '1px',
                        'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
                    });
                    leftimg = leftimg + ((GAME.engine.getRenderWidth()*55)/100);
                    leftdis = leftdis + ((GAME.engine.getRenderWidth()*55)/100);
                    this.scamsHeading.push(scamsHeading);
                    this.scamsMessage.push(scamsMessage);
                    this.scamsImage.push(image)
                    display.addControl(scamsHeading);
                    display.addControl(scamsMessage);
                });
            }
            this.player.coinsTextControl.isVisible = false;
            stageUI.show();
        }
        this.setBoons(stageData);
    }

    setBoons(stageData) {
        this.stageUI.addControl(this.addText("Collect bonus points for good scam awareness!", {
            'top' : (GAME.engine.getRenderHeight()* 50)/100,
            'color': GAME.options.pointsTextColor,
            'fontSize': '15px',
            'fontStyle' : 'bold',
            'verticalAlignment': BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP
        }));
        let leftimg = (GAME.engine.getRenderWidth()*10.5)/100;
        let leftdis = (GAME.engine.getRenderWidth()*4)/100;
        stageData['boons'].forEach(scam => {
            let image = new BABYLON.GUI.Image("icon", Message.message[scam].path);
            image.width = 0.2;
            image.height = 0.1;
            image.top = (GAME.engine.getRenderHeight()* 58)/100;
            image.left = leftimg;
            image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            this.stageUI.addControl(image);

            let display = new BABYLON.GUI.Rectangle();
            display.width = 0.37;
            display.height = 0.22;
            display.thickness = 0;
            display.left = leftdis;
            display.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            display.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            display.top = (GAME.engine.getRenderHeight()* 69)/100;
            this.stageUI.addControl(display);

            let scamsHeading = this.addText(Message.message[scam]['name'], {
                'top': '0px',
                'fontSize': '11px',
                'left': '1px',
                'fontStyle' : 'bold',
                'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
            });
            let scamsMessage = this.addText(Message.message[scam]['info'], {
                'top': '30px',
                'fontSize': '11px',
                'left': '1px',
                'horizontalAlignment': BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER,
            });
            leftimg = leftimg + ((GAME.engine.getRenderWidth()*55)/100);
            leftdis = leftdis + ((GAME.engine.getRenderWidth()*55)/100);
            display.addControl(scamsHeading);
            display.addControl(scamsMessage);
        });
    }

}