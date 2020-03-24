import Message from './../../public/message.json';
import Game from '../Game.js';

export default class UI {

    constructor(uiName) {
        this.currentControlID = 0;
        this.controls = [];

        this.menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(uiName);
        this.style = this.menuTexture.createStyle();
        this.style.fontFamily = "'Tomorrow', sans-serif";
    }

    addButton(name, text, options = {}) {
        let button = new BABYLON.GUI.Button.CreateSimpleButton(name, text);

        button.width = options.width || 0.5;
        button.height = options.height || '60px';
        button.color = options.color || 'black';
        button.outlineWidth = options.outlineWidth || 0;
        button.fontSize = options.fontSize || '20em';
        button.outlineColor = options.outlineColor || button.color;
        button.background = options.background || 'white';
        button.horizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.verticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        button.left = options.left || '0px';
        button.right = options.right || '0px';
        button.top = options.top || '0px';
        button.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        button.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        if (options.onclick) {
            button.onPointerUpObservable.add(options.onclick);
        }

        this.menuTexture.addControl(button);
        this.add(button);

        return button;
    }

    addImgButton(name, options = {}) {
        let imgbutton = new BABYLON.GUI.Button.CreateImageOnlyButton(name, options.imgpath);

        imgbutton.thickness = 0;
        imgbutton.width = options.width || 0.5;
        imgbutton.height = options.height || '60px';
        imgbutton.color = options.color || 'black';
        imgbutton.outlineWidth = options.outlineWidth || 0;
        imgbutton.outlineColor = options.outlineColor || imgbutton.color;
        imgbutton.background = options.background || 'transparent';
        imgbutton.horizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        imgbutton.verticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        imgbutton.left = options.left || '0px';
        imgbutton.isVisible = options.isVisible || true ;
        imgbutton.right = options.right || '0px';
        imgbutton.top = options.top || '20px';
        imgbutton.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        imgbutton.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        if (options.onclick) {
            imgbutton.onPointerUpObservable.add(options.onclick);
        }

        this.menuTexture.addControl(imgbutton);
        this.add(imgbutton);

        return imgbutton;
    }

    pauseScreen(coins, danger, safety, scamset) {
        GAME.pause();
        let background = new BABYLON.GUI.Rectangle();
        background.width = 1;
        background.height = 1;
        background.thickness = 0;
        background.background = "#0EAFDE";
        background.alpha = 1;
        this.menuTexture.addControl(background);

        let screen = new BABYLON.GUI.Rectangle();
        screen.width = 0.9;
        screen.height = 1;
        screen.thickness = 0;
        screen.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        background.addControl(screen);

        let pointText = new BABYLON.GUI.TextBlock('Pension Pot', 'Pension pot £:' + coins);
        pointText.top = '7em';
        pointText.color = GAME.options.pointsTextColor;
        pointText.outlineColor = GAME.options.pointsOutlineTextColor;
        pointText.outlineWidth = 0;
        pointText.fontSize = '15px';
        pointText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        pointText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        screen.addControl(pointText);

        let scamText = new BABYLON.GUI.TextBlock('Scam Count', 'Scam Count :' + danger);
        scamText.top = '7em';
        scamText.color = GAME.options.pointsTextColor;
        scamText.outlineColor = GAME.options.pointsOutlineTextColor;
        scamText.outlineWidth = 0;
        scamText.fontSize = '12px';
        scamText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        scamText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        screen.addControl(scamText);

        let boonText = new BABYLON.GUI.TextBlock('Boon Count', 'Boon Count :' + safety);
        boonText.top = '21em';
        // boonText.left =  (GAME.isMobile() ? '-10em' : '-100em');
        boonText.color = GAME.options.pointsTextColor;
        boonText.outlineColor = GAME.options.pointsOutlineTextColor;
        boonText.outlineWidth = 0;
        boonText.fontSize = '12px';
        boonText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        boonText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        screen.addControl(boonText);

        if( scamset && scamset.size){
            let arr = Array.from(scamset);
            let temp = 0;
            for (let index = 0; index < scamset.size; index++) {
                let scamName = arr[index];
                let message = Message.message;

                let image = new BABYLON.GUI.Image("icon", message[scamName].path);
                image.width = 0.15;
                image.height = 0.08;
                image.top = 36 + temp;
                image.left = 0.1;
                image.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                image.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                screen.addControl(image);
                
                let display = new BABYLON.GUI.Rectangle();
                display.width = 0.75;
                display.height = 0.075;
                display.thickness = 0;
                display.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                display.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                display.top =  42 + temp;
                screen.addControl(display);
                
                let scamDescription = new BABYLON.GUI.TextBlock('Scam Description', message[scamName].info)
                scamDescription.color = GAME.options.pointsTextColor;
                scamDescription.outlineColor = GAME.options.pointsOutlineTextColor;
                scamDescription.outlineWidth = 0;
                scamDescription.top = '1px';
                scamDescription.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                scamDescription.fontSize = '12px';
                scamDescription.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                scamDescription.textWrapping = true;
                scamDescription.lineSpacing = '0px';
                display.addControl(scamDescription);
                if (GAME.isMobile()) {
                    temp += 55;
                }
                else {
                    temp += 100;
                }
            }
        } else {
            var info = new BABYLON.GUI.TextBlock("CASUAL", "You haven't hit any scams");
            info.color = 'red'
            info.fontSize = "28em";
            // info.paddingBottom = '150px';
            screen.addControl(info)
        }

        let buttonResume = new BABYLON.GUI.Button.CreateSimpleButton('RESUME', 'RESUME');
        buttonResume.width = 0.2;
        buttonResume.height = 0.05;
        buttonResume.color = 'black';
        buttonResume.fontSize = "10em";
        buttonResume.background = 'white';
        buttonResume.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        buttonResume.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        buttonResume.top = '-5em';
        buttonResume.onPointerUpObservable.add(function () {
            GAME.resume();
            background.dispose();
            screen.dispose();
        });
        screen.addControl(buttonResume);


    }

    addText(text, options = {}) {
        let textControl = new BABYLON.GUI.TextBlock();
        textControl.width = options.width || 1;
        textControl.text = text;
        textControl.color = options.color || 'black';
        textControl.fontSize = options.fontSize || 20;
        textControl.outlineWidth = options.outlineWidth || 0;
        textControl.outlineColor = options.outlineColor || "black";
        textControl.lineSpacing = options.lineSpacing || '0px';
        textControl.left = options.left || '0px';
        textControl.paddingRight = options.paddingRight || '0px';
        textControl.top = options.top || '0px';
        textControl.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textControl.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textControl.textWrapping = options.wrapping || true;
        textControl.style = this.style;
        textControl.style.fontSize = options.fontSize || 20;
        this.menuTexture.addControl(textControl);
        this.add(textControl);

        return textControl;
    }

    addImage(name,options = {}) {
        let img = new BABYLON.GUI.Image(name, options.imgpath);

        img.thickness = 0;
        img.strech = options.strech || BABYLON.GUI.Image.stretch_uniform;
        img.width = options.width || 0.5;
        img.height = options.height || '60px';
        img.color = options.color || 'black';
        img.outlineWidth = options.outlineWidth || 0;
        img.outlineColor = options.outlineColor || img.color;
        // img.isVisible = options.isVisible || true ;
        img.background = options.background || 'transparent';
        img.horizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        img.verticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        img.left = options.left || '0px';
        img.right = options.right || '0px';
        img.top = options.top || '0px';
        // img.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        // img.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

        this.menuTexture.addControl(img);
        this.add(img);


        return img;
    }

    displayMessage(scamhitted, signal) {
        GAME.pause();
        var rect1 = new BABYLON.GUI.Rectangle();
        var label0 = new BABYLON.GUI.TextBlock("Educational Message", scamhitted);
        var hit = new BABYLON.GUI.TextBlock("Signal", signal);
        hit.color = (signal == 'HIT IT') ? 'red' : 'green';
        if (GAME.isMobile()) {
            rect1.width = 1;
            rect1.height = '55px';
            label0.fontSize = "14em";
            label0.lineSpacing = '1px';
            hit.fontSize = "30em";
            hit.paddingBottom = '150px'
            label0.top = "1px";
        }
        else {
            hit.fontSize = "45em";
            hit.paddingBottom = '250px'
            rect1.width = 1;
            rect1.height = '130px';
            label0.fontSize = "35em";
            label0.lineSpacing = '2px';
            label0.top = "18px";
        }
        rect1.cornerRadius = 0;
        rect1.thickness = 0;
        rect1.background = "grey";
        rect1.alpha = 0.7;
        // rect1.horizontalAlignment = BABYLON.GUI.Control.horizontal_alignment_left;
        this.menuTexture.addControl(rect1);

        this.menuTexture.addControl(hit);
        label0.fontFamily = "monospace";
        label0.color = "white";
        label0.textVerticalAlignment = 0;
        label0.textWrapping = true;
        // label0.resizeToFit = true;
        // label0.horizontalAlignment = BABYLON.GUI.Control.horizontal_alignment_left;
        rect1.addControl(label0);

        setTimeout(() => {
            // label0.dispose();
            hit.dispose();
            rect1.dispose();
            GAME.resume();
        }, GAME.options.messageReadTime);
    }

    add(control) {
        control.uiControlID = this.currentControlID++;
        this.controls.push(control);
    }

    remove(control) {
        control.isVisible = false;
        this.controls.splice(control.uiControlID, 1);
    }

    show() {
        this.controls.forEach(control => control.isVisible = true);
    }

    hide() {
        this.controls.forEach(control => control.isVisible = false);
    }

    clear() {
        this.controls.forEach(control => control.dispose());
        this.menuTexture.dispose();
    }

}