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
        this.ageControl = null;
        this.progressValueInvisible = null;
        this.advancedTexture = null;
        this.setupTimer();
    }


    setupTimer() {

        // GUI

        this.advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", false);

        // Outer Rectangle for Values
        let frame = new BABYLON.GUI.Rectangle();
        frame.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        frame.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        frame.width = 1;
        frame.height = "50px";
        frame.thickness = 0;
        frame.background = "#45186e";
        this.advancedTexture.addControl(frame);

        // Outer Rectangle for Values
        let outterRect = new BABYLON.GUI.Rectangle();
        outterRect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        outterRect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        outterRect.top = '15px';
        // outterRect.left = '10px';
        outterRect.width = 0.8;
        outterRect.height = "45px";
        outterRect.thickness = 0;
        this.advancedTexture.addControl(outterRect);


        // Rectangle box for Progress Bar
        let rect1 = new BABYLON.GUI.Rectangle();
        rect1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        rect1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        rect1.top = '15px';
        // rect1.left = '10px';
        rect1.width = 0.8;
        rect1.height = "25px";
        rect1.cornerRadius = 40;
        rect1.color = "#935DB6";
        rect1.thickness = 3;
        rect1.background = "white";
        let img = new BABYLON.GUI.Image("image", "assets/scenes/stripe.jpg");
        img.alpha = 0.2;
        rect1.addControl(img);

        let progressBar = new BABYLON.GUI.Rectangle();
        progressBar.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        progressBar.width = 1;
        progressBar.left = '0px';
        progressBar.height = "15px";
        progressBar.cornerRadius = 100;
        progressBar.color = "#DDDBE0";
        progressBar.thickness = 0;
        progressBar.background = "#DDDBE0";
        progressBar.alpha = 0.6;
        rect1.addControl(progressBar);


        // Yellow Progress Bar that moves as age timer
        this.progressValue = new BABYLON.GUI.Rectangle();
        this.progressValue.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.progressValue.width = 0;
        this.progressValue.left = '0px';
        this.progressValue.height = 1;
        this.progressValue.cornerRadius = 20;
        this.progressValue.color = "#EBC514";
        this.progressValue.thickness = 0;
        this.progressValue.background = "#EBC514";
        rect1.addControl(this.progressValue);
        this.advancedTexture.addControl(rect1);

        // Outer Box that increases with age
        this.progressValueInvisible = new BABYLON.GUI.Rectangle();
        this.progressValueInvisible.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.progressValueInvisible.width = 0;
        this.progressValueInvisible.thickness = 0;
        outterRect.addControl(this.progressValueInvisible);


        // Age Value Text that increases
        this.ageControl = new BABYLON.GUI.TextBlock();
        this.ageControl.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        this.ageControl.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        this.ageControl.text = '18';
        this.ageControl.color = '#DDDBE0';
        this.ageControl.fontSize = 10;
        this.ageControl.isVisible = false;

        this.progressValue.addControl(this.ageControl);

        for (let index = 1; index <= 4; index++) {
            let splitter = new BABYLON.GUI.Rectangle();
            splitter.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
            splitter.width =  0.334 * index;
            splitter.height = 1;
            splitter.thickness = 3;
            splitter.color = '#CCCACE';
            splitter.background = 'transparent';
            progressBar.addControl(splitter);  
        }

        let moveProgressWidth = 0;
        let ageValue = 0;
        let gameLength = GAME.options.gameLength; // 1 min
        this.trigger = setInterval(() => {
            if (ageValue < 47) {
                if (!GAME.isPaused()) {
                    moveProgressWidth += ((98 / gameLength) / 100 / 10);
                    ageValue += (47 / gameLength / 10);
                    this.progressValue.width = moveProgressWidth;
                    this.progressValueInvisible.width = moveProgressWidth + 0.01;
                    let value = Math.round(18 + ageValue);
                    this.ageControl.text = "" + value;
                    if (value > 63 || value < 23) {
                        this.ageControl.alpha = 0;
                    } else {
                        this.ageControl.alpha = 1;
                    }
                }
            } else {
                this.player.win();
                clearInterval(this.trigger);
            }
        }, 100);

    }

    clear() {
        clearInterval(this.trigger);
        this.advancedTexture.dispose();
    }

}