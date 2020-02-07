export default class UI {

    constructor(uiName) {
        this.currentControlID = 0;
        this.controls = [];

        this.menuTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(uiName);
    }

    addButton(name, text, options = {}) {
        let button = new BABYLON.GUI.Button.CreateSimpleButton(name, text);

        button.width = options.width || 0.5;
        button.height = options.height || '60px';
        button.color = options.color || 'black';
        button.outlineWidth = options.outlineWidth || 0;
        button.outlineColor = options.outlineColor || button.color;
        button.background = options.background || 'white';
        button.left = options.left || '0px';
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
        let imgbutton = new BABYLON.GUI.Button.CreateImageOnlyButton(name, "assets/scenes/scam-man-play-btn.png");

        imgbutton.width = '0.25';
        imgbutton.height = '0.1';
        imgbutton.thickness = 0;
        imgbutton.top = '210';

        // imgbutton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        // imgbutton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

        if (options.onclick) {
            imgbutton.onPointerUpObservable.add(options.onclick);
        }

        this.menuTexture.addControl(imgbutton);
        this.add(imgbutton);

        return imgbutton;
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
        textControl.top = options.top || '0px';
        textControl.textHorizontalAlignment = (typeof options.horizontalAlignment !== 'undefined') ? options.horizontalAlignment : BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        textControl.textVerticalAlignment = (typeof options.verticalAlignment !== 'undefined') ? options.verticalAlignment : BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        textControl.textWrapping = options.wrapping || true;

        this.menuTexture.addControl(textControl);
        this.add(textControl);

        return textControl;
    }

    addImage() {
        let img = new BABYLON.GUI.Image("img", "assets/scenes/scam-man-fulltitle-mainpage.png");

        // img.width = 0.5;
        // img.height = '50px';
        img.strech = BABYLON.GUI.Image.stretch_uniform;
        img.width = '0.7';
        img.height = '0.6';
        img.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        img.top = '100'

        this.menuTexture.addControl(img)

        return img;
    }

    displayMessage(scamhitted){
        GAME.pause();
        var rect1 = new BABYLON.GUI.Rectangle();
        var hit =  new BABYLON.GUI.TextBlock("Hit Message", "YOU ARE SCAMMED");
        var label0 = new BABYLON.GUI.TextBlock("Educational Message", scamhitted);
        if(GAME.isMobile())
        {
            rect1.width = 1;
            rect1.height = '50px';
            label0.fontSize = "12em";
            label0.lineSpacing = '1px';
            hit.fontSize = "30em";
            hit.paddingBottom = '150px'
            label0.top = "1px";
        }
        else{
            hit.fontSize = "45em";
            hit.paddingBottom = '250px'
            rect1.width = 1;
            rect1.height = '130px';
            label0.fontSize = "35em";
            label0.lineSpacing = '2px';
            label0.top = "18px";
        }
        hit.color = "red";
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
        // label0.horizontalAlignment = BABYLON.GUI.Control.horizontal_alignment_left;
        rect1.addControl(label0);

        setTimeout(() =>{
            // label0.dispose();
            hit.dispose();
            rect1.dispose();
            GAME.resume();
        },2000);
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

}