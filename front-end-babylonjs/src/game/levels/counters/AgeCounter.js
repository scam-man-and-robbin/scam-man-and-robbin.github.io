export default class AgeCounter {

    /**
    * Class description
    *
    * To handle Age Timer. 
    */

    constructor(level) {

        this.level = level;
        this.scene = level.scene;
        this.player = level.player;
        this.progressValue = null;
        this.textControl = null;
        this.progressValueInvisible = null;
        this.advancedTexture = null;
        this.setupTimer();
    }


    setupTimer() {

        // GUI

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Outer Rectangle for Values
        var outterRect = new BABYLON.GUI.Rectangle();
        outterRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        outterRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        outterRect.top = '10px';
        outterRect.left = '10px';
        outterRect.width = 0.4;
        outterRect.height = "40px";
        outterRect.thickness = 0;
        this.advancedTexture.addControl(outterRect);


        // Rectangle box for Progress Bar
        var rect1 = new BABYLON.GUI.Rectangle();
        rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rect1.top = '10px';
        rect1.left = '10px';
        rect1.width = 0.4;
        rect1.height = "20px";
        rect1.cornerRadius = 40;
        rect1.color = "#F0E469";
        rect1.thickness = 3;
        rect1.background = "white";
        var img = new BABYLON.GUI.Image("image", "/assets/scenes/stripe.jpg");
        img.alpha = 0.2;
        rect1.addControl(img);

        var progressBar = new BABYLON.GUI.Rectangle();
        progressBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressBar.width = 0.98;
        progressBar.left = '2px';
        progressBar.height = "10px";
        progressBar.cornerRadius = 100;
        progressBar.color = "#EB12DB";
        progressBar.thickness = 0;
        progressBar.background = "#EB12DB";
        progressBar.alpha = 0.6;
        rect1.addControl(progressBar);


        // Yellow Progress Bar that moves as age timer
        this.progressValue = new BABYLON.GUI.Rectangle();
        this.progressValue.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.progressValue.width = 0;
        this.progressValue.left = '2px';
        this.progressValue.height = 1;
        this.progressValue.cornerRadius = 20;
        this.progressValue.color = "#F0E469";
        this.progressValue.thickness = 0;
        this.progressValue.background = "#F0E469";
        rect1.addControl(this.progressValue);
        this.advancedTexture.addControl(rect1);

        // Outer Box that increases with age
        this.progressValueInvisible = new BABYLON.GUI.Rectangle();
        this.progressValueInvisible.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.progressValueInvisible.width = 0;
        this.progressValueInvisible.thickness = 0;
        outterRect.addControl(this.progressValueInvisible);


        // Age Value Text that increases
        this.textControl = new BABYLON.GUI.TextBlock();
        this.textControl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.textControl.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.textControl.text = '18';
        this.textControl.color = '#EB12DB';
        this.textControl.fontSize = 10;

        this.progressValue.addControl(this.textControl);

        let startText = new BABYLON.GUI.TextBlock();
        startText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        startText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        startText.text = '18';
        startText.color = 'BLACK';
        startText.fontSize = 12;

        outterRect.addControl(startText);

        let endText = new BABYLON.GUI.TextBlock();
        endText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        endText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        endText.text = '65';
        endText.color = 'BLACK';
        endText.fontSize = 12;

        outterRect.addControl(endText);

        let label = new BABYLON.GUI.TextBlock();
        label.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        label.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        label.text = 'Age';
        label.color = 'BLACK';
        label.fontSize = 12;

        outterRect.addControl(label);

        let moveProgressWidth = 0;
        let ageValue = 0;
        let gameLength = GAME.options.gameLength; // 1 min
        var trigger = setInterval(() => {
            if (ageValue <= 47 && this.player.lives) {
                if (!GAME.isPaused() && this.player.lives) {
                    moveProgressWidth += ((98 / gameLength) / 100 / 10);
                    ageValue += (47 / gameLength / 10);
                    this.progressValue.width = moveProgressWidth;
                    this.progressValueInvisible.width = moveProgressWidth + 0.01;
                    let value = Math.round(18 + ageValue);
                    this.textControl.text = "" + value;
                    if (value > 63 || value < 23) {
                        this.textControl.alpha = 0;
                    } else {
                        this.textControl.alpha = 1;
                    }
                }
            } else if (!this.player.lives) {
                clearInterval(trigger);
            }
            else {
                this.player.win();
                clearInterval(trigger);
            }
        }, 100);

    }

}